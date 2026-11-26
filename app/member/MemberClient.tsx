"use client";

/* The member's home: their experiences as flyers first (going, saved,
   what's coming up, past), then their profile in a card they can edit in
   place. Reached from the avatar in the nav on every screen size. */

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMember } from "@/components/club/MemberProvider";
import { Avatar, MARK } from "@/components/club/ClubUI";
import EditProfileSheet from "@/components/club/EditProfileSheet";
import { Door } from "@/components/club/JourneyArt";
import { memberSince } from "@/lib/member";
import { events, eventSlug, type TigerEvent } from "@/lib/events";
import { daysUntil, whenLabel } from "@/lib/club/alerts";
import {
  getMyRsvpEventIds,
  getSavedEventIds,
  rsvpToEvent,
} from "@/lib/club/supabase";

type Row = { e: TigerEvent; days: number };

const WRAP = "mx-auto max-w-content px-5 md:px-10";
const GRID = "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 md:gap-x-6";

export default function MemberClient() {
  const router = useRouter();
  const { member, loading, available } = useMember();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [goingIds, setGoingIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);

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
        <div className={`${WRAP} py-16`}>
          <p className={`${MARK} text-ink/40`}>
            {available ? "Opening your club…" : "Membership is unavailable."}
          </p>
        </div>
      </main>
    );
  }

  const since = memberSince(member);
  const all: Row[] = events.map((e) => ({ e, days: daysUntil(e) }));
  const soonest = (a: Row, b: Row) => a.days - b.days;

  const going = all.filter((r) => goingIds.includes(r.e.id) && r.days >= 0).sort(soonest);
  const saved = all
    .filter((r) => savedIds.includes(r.e.id) && !goingIds.includes(r.e.id) && r.days >= 0)
    .sort(soonest);
  const comingUp = all
    .filter((r) => r.days >= 0 && !goingIds.includes(r.e.id) && !savedIds.includes(r.e.id))
    .sort(soonest)
    .slice(0, 4);
  const past = all
    .filter((r) => r.days < 0 && (goingIds.includes(r.e.id) || savedIds.includes(r.e.id)))
    .sort((a, b) => b.days - a.days);
  const attended = past.filter((r) => goingIds.includes(r.e.id)).length;


  return (
    <main className="min-h-svh bg-paper pt-[76px] pb-16 md:pt-20">
      {/* Profile header, Luma/Partiful style: the public face only */}
      <header className={`${WRAP} pt-6 pb-2 md:pt-6`}>
        <div className="flex flex-col items-center text-center">
          <Avatar member={member} size={112} />
          <h1 className="mt-5 font-wordmark font-extrabold text-ink tracking-tight leading-none text-[clamp(2rem,5vw,3rem)]">
            {member.firstName} {member.lastName}
          </h1>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[15px] text-ink/60">
            {member.city && <span>{member.city}</span>}
            {member.city && member.instagram && <span aria-hidden="true">·</span>}
            {member.instagram && (
              <a
                href={`https://instagram.com/${member.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink/75 hover:text-tiger-text"
              >
                @{member.instagram}
              </a>
            )}
            {(member.city || member.instagram) && since && <span aria-hidden="true">·</span>}
            {since && <span>Joined {since}</span>}
          </p>
          <dl className="mt-6 flex items-center gap-8">
            <Stat value={going.length} label="Going" door="closed" />
            <Stat value={attended} label="Attended" door="open" />
            <Stat value={saved.length} label="Saved" door="outline" />
          </dl>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-6 rounded-full border border-ink/20 px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40"
          >
            Edit profile
          </button>
        </div>
      </header>

      {/* Upcoming: RSVPed first, then saved-but-not-RSVPed */}
      <Section title="Your upcoming experiences" action={<MoreLink />}>
        {!ready ? (
          <SkeletonGrid />
        ) : going.length + saved.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink/20 px-6 py-10 text-center">
            <Door state="outline" className="mb-4 h-14 w-auto" />
            <p className="font-display text-[1.25rem] text-ink">Your next door is waiting.</p>
            <p className="mt-2 text-[15px] text-ink/60">
              RSVP or save an experience and it shows up here.
            </p>
          </div>
        ) : (
          <ul className={GRID}>
            {going.map((r) => (
              <FlyerCard key={r.e.id} row={r} badge="Going" badgeStrong door="closed" />
            ))}
            {saved.map((r) => (
              <FlyerCard key={r.e.id} row={r} badge="Saved" door="outline">
                <InlineRsvp
                  event={r.e}
                  onGoing={() => setGoingIds((ids) => [...ids, r.e.id])}
                />
              </FlyerCard>
            ))}
          </ul>
        )}
      </Section>

      {/* Coming up */}
      {ready && comingUp.length > 0 && (
        <Section title="Coming up at Tiger Club" action={<MoreLink />}>
          <ul className={GRID}>
            {comingUp.map((r) => (
              <FlyerCard key={r.e.id} row={r} />
            ))}
          </ul>
        </Section>
      )}

      {/* Past */}
      {ready && past.length > 0 && (
        <Section title="Past experiences">
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 md:gap-4">
            {past.map((r) => (
              <PastCard key={r.e.id} row={r} went={goingIds.includes(r.e.id)} />
            ))}
          </ul>
        </Section>
      )}

      <EditProfileSheet
        member={member}
        open={editing}
        onClose={() => setEditing(false)}
        onSignedOut={() => router.replace("/")}
      />
    </main>
  );
}

function Section({
  title,
  note,
  action,
  children,
}: {
  title: string;
  note?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={`${WRAP} pt-8 md:pt-12`}>
      <div className="mb-5 flex items-baseline justify-between gap-4 md:mb-7">
        <h2 className="font-display text-[1.5rem] md:text-[1.85rem] text-ink leading-tight">
          {title}
          {note && <span className="ml-3 align-middle text-[13px] text-ink/45">{note}</span>}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function MoreLink() {
  return (
    <Link
      href="/experiences"
      className="shrink-0 text-[14px] font-semibold text-tiger-text transition-colors hover:text-tiger-deep"
    >
      All experiences →
    </Link>
  );
}

function Stat({
  value,
  label,
  door,
}: {
  value: number;
  label: string;
  door: "open" | "closed" | "outline";
}) {
  return (
    <div className="flex flex-col-reverse items-center">
      <dt className="mt-1 flex items-center gap-1.5 text-[13px] text-ink/55">
        <Door state={door} className="h-5 w-auto" />
        {label}
      </dt>
      <dd className="font-wordmark text-[1.6rem] font-extrabold leading-none text-ink tabular-nums">
        {value}
      </dd>
    </div>
  );
}

function FlyerCard({
  row,
  badge,
  badgeStrong,
  door,
  children,
}: {
  row: Row;
  badge?: string;
  badgeStrong?: boolean;
  door?: "closed" | "outline";
  children?: React.ReactNode;
}) {
  const { e, days } = row;
  const label = badge ?? (days <= 7 ? whenLabel(days) : null);
  return (
    <li className="flex flex-col">
      <Link href={`/experiences/${eventSlug(e)}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/[0.06] ring-1 ring-ink/10">
          <Image
            src={e.image}
            alt=""
            fill
            sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {label && (
            <span
              className={`absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full py-1 pl-2 pr-2.5 text-[11px] font-semibold shadow-sm ${
                badgeStrong || days <= 1 ? "bg-tiger-fill text-white" : "bg-paper/95 text-ink"
              }`}
            >
              {door && (
                <Door
                  state={door}
                  className={`h-3.5 w-auto ${badgeStrong ? "[&_*]:stroke-white" : ""}`}
                />
              )}
              {label}
            </span>
          )}
        </div>
        <p className={`${MARK} mt-3 text-tiger-text`}>
          {e.month} {e.day}
          {e.time ? ` · ${e.time}` : ""}
        </p>
        <p className="mt-1 font-display text-[1.05rem] leading-snug text-ink group-hover:text-tiger-text md:text-[1.15rem]">
          {e.title}
        </p>
        {e.location && <p className="mt-0.5 truncate text-[13px] text-ink/50">{e.location}</p>}
      </Link>
      {children && <div className="mt-3">{children}</div>}
    </li>
  );
}

function PastCard({ row, went }: { row: Row; went: boolean }) {
  const { e } = row;
  return (
    <li>
      <Link href={`/experiences/${eventSlug(e)}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-ink/[0.06] ring-1 ring-ink/10">
          <Image
            src={e.image}
            alt=""
            fill
            sizes="(min-width:1024px) 16vw, 33vw"
            className="object-cover grayscale-[40%] opacity-80 transition group-hover:grayscale-0 group-hover:opacity-100"
          />
          {went && (
            <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-paper/95 py-0.5 pl-1.5 pr-2 text-[10px] font-semibold text-ink">
              <Door state="open" className="h-3 w-auto" />
              Went
            </span>
          )}
        </div>
        <p className="mt-2 truncate text-[13px] font-semibold text-ink/75">{e.title}</p>
      </Link>
    </li>
  );
}

function SkeletonGrid() {
  return (
    <ul className={GRID} aria-hidden="true">
      {[0, 1].map((i) => (
        <li key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-ink/[0.06]" />
      ))}
    </ul>
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
    else setNote("Couldn't save. Try again.");
  }

  if (note === "Sold out") {
    return <p className="text-center text-[13px] font-semibold text-ink/50">Sold out</p>;
  }
  return (
    <>
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="w-full rounded-full bg-tiger-fill px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-tiger-deep disabled:opacity-60"
      >
        {busy ? "…" : "RSVP"}
      </button>
      {note && <p className="mt-1.5 text-center text-[12px] text-tiger-text">{note}</p>}
    </>
  );
}
