-- Tiger Club: native RSVPs (Phase 1).
-- Run once in the Supabase SQL Editor for the production project.
-- Requires the existing public.members table (auth_user_id, id).

create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.members(id) on delete cascade,
  event_id    text not null,
  status      text not null default 'going' check (status in ('going', 'cancelled')),
  created_at  timestamptz not null default now(),
  unique (member_id, event_id)
);

alter table public.rsvps enable row level security;

-- Members can only see and change their own RSVPs.
create policy "members read own rsvps" on public.rsvps
  for select using (member_id in (select id from public.members where auth_user_id = auth.uid()));

create policy "members insert own rsvps" on public.rsvps
  for insert with check (member_id in (select id from public.members where auth_user_id = auth.uid()));

create policy "members update own rsvps" on public.rsvps
  for update using (member_id in (select id from public.members where auth_user_id = auth.uid()))
  with check (member_id in (select id from public.members where auth_user_id = auth.uid()));

-- RSVP with capacity enforced on the server. The advisory lock makes two
-- simultaneous RSVPs for the last spot queue up instead of both succeeding.
create or replace function public.rsvp_event(p_event_id text, p_capacity int)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_member uuid;
  v_going int;
begin
  select id into v_member from public.members where auth_user_id = auth.uid();
  if v_member is null then
    raise exception 'not_a_member';
  end if;

  perform pg_advisory_xact_lock(hashtext(p_event_id));

  perform 1 from public.rsvps
    where member_id = v_member and event_id = p_event_id and status = 'going';
  if found then
    return 'already';
  end if;

  select count(*) into v_going from public.rsvps
    where event_id = p_event_id and status = 'going';
  if p_capacity is not null and v_going >= p_capacity then
    return 'full';
  end if;

  insert into public.rsvps (member_id, event_id, status)
    values (v_member, p_event_id, 'going')
    on conflict (member_id, event_id) do update set status = 'going';
  return 'going';
end;
$$;

-- Counts only. Returns no names, so it is safe for signed-out visitors.
create or replace function public.rsvp_counts(event_ids text[])
returns table (event_id text, going bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select r.event_id, count(*)
  from public.rsvps r
  where r.status = 'going' and r.event_id = any(event_ids)
  group by r.event_id;
$$;

revoke all on function public.rsvp_event(text, int) from public;
grant execute on function public.rsvp_event(text, int) to authenticated;
grant execute on function public.rsvp_counts(text[]) to anon, authenticated;
