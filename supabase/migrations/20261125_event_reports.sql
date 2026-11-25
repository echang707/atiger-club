-- Tiger Club: day-before RSVP report email (Phase 1).
-- Run AFTER 20261125_rsvps.sql, once, in the Supabase SQL Editor.
--
-- What it does: every day at 9am Eastern, finds events starting 12 to 36
-- hours from now that haven't been reported yet, counts their website
-- RSVPs, and emails the count through Resend. Each event is reported once.
--
-- Before running, store your two secrets (replace the placeholders):
--   select vault.create_secret('re_YOUR_RESEND_KEY', 'resend_api_key');
--   select vault.create_secret('you@example.com', 'report_email');
-- The Resend key needs permission to send from atigerclub.com.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Upcoming dated events. Keep this in step with lib/events.ts: add a row
-- for every new event that should get a report.
create table if not exists public.event_schedule (
  event_id   text primary key,
  title      text not null,
  starts_at  timestamptz not null
);
alter table public.event_schedule enable row level security;  -- no policies: not readable by visitors

create table if not exists public.event_reports (
  event_id    text primary key references public.event_schedule(event_id) on delete cascade,
  sent_at     timestamptz not null default now(),
  going_count int not null
);
alter table public.event_reports enable row level security;

insert into public.event_schedule (event_id, title, starts_at) values
  ('letter-writing-social', 'Letter Writing Social', '2026-12-09 19:00:00-05'),
  ('board-game-night', 'Board Game Night', '2026-12-10 19:30:00-05'),
  ('creative-cafe-ornament-making', 'Creative Café: Ornament Making', '2026-12-12 11:00:00-05')
on conflict (event_id) do update set title = excluded.title, starts_at = excluded.starts_at;

create or replace function public.send_event_reports()
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  r record;
  v_key text;
  v_to text;
  v_count int;
  v_when text;
  v_sent int := 0;
begin
  select decrypted_secret into v_key from vault.decrypted_secrets where name = 'resend_api_key';
  select decrypted_secret into v_to from vault.decrypted_secrets where name = 'report_email';
  if v_key is null or v_to is null then
    raise exception 'Store resend_api_key and report_email in Vault first';
  end if;

  for r in
    select s.event_id, s.title, s.starts_at
    from public.event_schedule s
    where s.starts_at >= now() + interval '12 hours'
      and s.starts_at <  now() + interval '36 hours'
      and not exists (select 1 from public.event_reports x where x.event_id = s.event_id)
  loop
    select count(*) into v_count
      from public.rsvps
      where event_id = r.event_id and status = 'going';

    v_when := to_char(r.starts_at at time zone 'America/New_York', 'FMDay, FMMonth FMDD, FMHH12:MI AM');

    perform net.http_post(
      url     := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || v_key,
        'Content-Type', 'application/json'
      ),
      body    := jsonb_build_object(
        'from', 'Tiger Club <noreply@atigerclub.com>',
        'to', jsonb_build_array(v_to),
        'subject', format('Tomorrow: %s (%s RSVPs from the website)', r.title, v_count),
        'html', format(
          '<p>Tomorrow: <strong>%s</strong>, %s.</p><p><strong>%s</strong> people have RSVPed on the website.</p>',
          r.title, v_when, v_count)
      )
    );

    insert into public.event_reports (event_id, going_count) values (r.event_id, v_count);
    v_sent := v_sent + 1;
  end loop;

  return v_sent;
end;
$$;

revoke all on function public.send_event_reports() from public;

-- 14:00 UTC is 9am Eastern in winter and 10am in summer.
select cron.schedule(
  'tiger-club-event-reports',
  '0 14 * * *',
  $$select public.send_event_reports();$$
);
