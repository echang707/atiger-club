"use client";

/* One page for the member: their experiences first (going, saved, past),
   then their profile, which they can edit in place. Reached from the
   avatar in the nav on every screen size. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMember } from "@/components/club/MemberProvider";
import { ClubHero, ClubSection, ClubLink, BODY, MARK } from "@/components/club/ClubUI";
import ProfilePanel from "@/components/club/ProfilePanel";
import AddToCalendar from "@/components/club/AddToCalendar";
import { memberSince } from "@/lib/member";
import { events, eventSlug, type TigerEvent } from "@/lib/events";
import { daysUntil, whenLabel } from "@/lib/club/alerts";
import {
  getMyRsvpEventIds,
  getSavedEventIds,
  rsvpToEvent,
  signOut,
} from "@/lib/club/supabase";

type Row = { e: TigerEvent; days: number };

export default function MemberClient() {
  const router = useRouter();
  const { member, loading, available } = useMember();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [goingIds, setGoingIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [editRequest, setEditRequest] = useState(0);

  useEffect(() => {
    if (!member) return;
    Promise.all([getSavedEventIds(member.id), getMyRsvpEventIds(member.id)]).then(
      ([saved, going]) => {
        setSavedIds(saved);
        setGoingIds(going);
        setReady(true);
      },
    );
  }, [member]);

  useEffect(() => {
    if (!loading && !member) router.replace("/login?next=/member");
  }, [loading, member, router]);

  if (loading || !member) {
    return (
      <main className="min-h-svh pt-[76px] md:pt-20">
        <div className="mx-auto max-w-content px-6 py-16 md:px-10">
          <p className={`${MARK} text-ink/40`}>
            {available ? "Opening your club…" : "Membership is unavailable."}
          </p>
        </div>
      </main>
    );
  }

  const since = memberSince(member);

  const rows = (ids: string[]): Row[] =>
    events.filter((e) => ids.includes(e.id)).map((e) => ({ e, days: daysUntil(e) }));
  const soonest = (a: Row, b: Row) => a.days - b.days;

  const going = rows(goingIds).filter((r) => r.days >= 0).sort(soonest);
  const saved = rows(savedIds.filter((id) => !goingIds.includes(id)))
    .filter((r) => r.days >= 0)
    .sort(soonest);
  const past = rows(Array.from(new Set([...goingIds, ...savedIds])))
    .filter((r) => r.days < 0)
    .sort((a, b) => b.days - a.days);
  const attended = past.filter((r) => goingIds.includes(r.e.id)).length;

  function editProfile() {
    setEditRequest((n) => n + 1);
    document.getElementById("profile")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-svh bg-paper pt-[76px] md:pt-20">
      <ClubHero
        member={member}
        eyebrow="Your Club"
        title={`${member.firstName} ${member.lastName}`.trim()}
        subtitle={since ? `Member since ${since}` : null}
        actions={
          <>
            <Stat value={going.length} label="Going" />
            <Stat value={attended} label="Been to" />
            <Stat value={saved.length} label="Saved" />
            <button
              type="button"
              onClick={editProfile}
              className="self-center rounded-full border border-ink/20 px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              Edit profile
            </button>
          </>
        }
      />

      <ClubSection
        eyebrow="You're going"
        action={<ClubLink href="/experiences">Find more</ClubLink>}
      >
        {!ready ? null : going.length === 0 ? (
          <p className={BODY}>
            No RSVPs yet.{" "}
            <ClubLink href="/experiences">See what&rsquo;s coming up →</ClubLink>
          </p>
        ) : (
          <ul className="divide-y divide-ink/8">
            {going.map((r) => (
              <EventItem key={r.e.id} row={r}>
                <span className="shrink-0 rounded-full bg-tiger-fill/10 px-3 py-1.5 text-[12px] font-semibold text-tiger-text">
                  Going ✓
                </span>
              </EventItem>
            ))}
          </ul>
        )}
        {going.length > 0 && (
          <div className="mt-6 max-w-sm">
            <p className={`${MARK} mb-3 text-ink/40`}>Next up</p>
            <AddToCalendar event={going[0].e} />
          </div>
        )}
      </ClubSection>

      {ready && saved.length > 0 && (
        <ClubSection eyebrow="Saved, not RSVPed yet">
          <ul className="divide-y divide-ink/8">
            {saved.map((r) => (
              <EventItem key={r.e.id} row={r}>
                <InlineRsvp
                  event={r.e}
                  onGoing={() => setGoingIds((ids) => [...ids, r.e.id])}
                />
              </EventItem>
            ))}
          </ul>
        </ClubSection>
      )}

      {ready && past.length > 0 && (
        <ClubSection eyebrow="Past experiences">
          <ul className="divide-y divide-ink/8 opacity-70">
            {past.map((r) => (
              <EventItem key={r.e.id} row={r}>
                {goingIds.includes(r.e.id) ? (
                  <span className={`${MARK} shrink-0 text-ink/45`}>Went</span>
                ) : null}
              </EventItem>
            ))}
          </ul>
        </ClubSection>
      )}

      <div id="profile" className="scroll-mt-24">
        <ProfilePanel member={member} editRequest={editRequest} />
      </div>

      <section>
        <div className="mx-auto max-w-content px-6 py-10 md:px-10">
          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.replace("/");
            }}
            className={`${MARK} text-ink/45 transition-colors hover:text-ink`}
          >
            Log out
          </button>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="mr-4 min-w-[3.5rem]">
      <p className="font-wordmark text-[1.75rem] font-extrabold leading-none text-ink tabular-nums">
        {value}
      </p>
      <p className={`${MARK} mt-1 text-ink/45`}>{label}</p>
    </div>
  );
}

function EventItem({ row, children }: { row: Row; children?: React.ReactNode }) {
  const { e, days } = row;
  const soon = days >= 0 && days <= 7;
  return (
    <li className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/experiences/${eventSlug(e)}`} className="group min-w-0 flex-1">
          {soon && (
            <span
              className={`mb-1.5 inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wideish ${
                days <= 1 ? "bg-tiger-fill text-white" : "bg-ink/[0.06] text-ink/70"
              }`}
            >
              {whenLabel(days)}
            </span>
          )}
          <p className="font-display text-[1.15rem] leading-snug text-ink group-hover:text-tiger-text">
            {e.title}
          </p>
          <p className={`${MARK} mt-1.5 text-ink/45`}>
            {e.month} {e.day}
            {e.time ? ` · ${e.time}` : ""}
          </p>
          {e.location && <p className="mt-0.5 text-[14px] text-ink/50">{e.location}</p>}
        </Link>
        {children}
      </div>
    </li>
  );
}

function InlineRsvp({ event, onGoing }: { event: TigerEvent; onGoing: () => void }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setNote(null);
    const outcome = await rsvpToEvent(event.id, event.capacity ?? null);
    setBusy(false);
    if (outcome === "going" || outcome === "already") onGoing();
    else if (outcome === "full") setNote("Sold out");
    else setNote("Try again");
  }

  if (note === "Sold out") {
    return <span className={`${MARK} shrink-0 text-ink/45`}>Sold out</span>;
  }
  return (
    <div className="shrink-0 text-right">
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="rounded-full bg-tiger-fill px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-tiger-deep disabled:opacity-60"
      >
        {busy ? "…" : "RSVP"}
      </button>
      {note && <p className="mt-1 text-[12px] text-tiger-text">{note}</p>}
    </div>
  );
}
