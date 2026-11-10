"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMember } from "@/components/club/MemberProvider";
import { ClubHero, ClubSection, ClubLink, BODY, MARK } from "@/components/club/ClubUI";
import { membershipConfig } from "@/lib/membership";
import { memberSince } from "@/lib/member";
import { events, eventSlug, type TigerEvent } from "@/lib/events";
import { daysUntil, whenLabel } from "@/lib/club/alerts";
import { getSavedEventIds } from "@/lib/club/supabase";

export default function MemberClient() {
  const router = useRouter();
  const { member, loading, available } = useMember();
  const [savedEvents, setSavedEvents] = useState<typeof events>([]);

  useEffect(() => {
    if (!member) return;
    getSavedEventIds(member.id).then((ids) =>
      setSavedEvents(events.filter((e) => ids.includes(e.id)))
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

  // Upcoming soonest-first; past most-recent-first.
  const withDays = savedEvents.map((e) => ({ e, days: daysUntil(e) }));
  const upcoming = withDays.filter((x) => x.days >= 0).sort((a, b) => a.days - b.days);
  const past = withDays.filter((x) => x.days < 0).sort((a, b) => b.days - a.days);

  return (
    <main className="min-h-svh bg-paper pt-[76px] md:pt-20">
      <ClubHero
        member={member}
        eyebrow="Your Club"
        title={`Welcome back, ${member.firstName}.`}
        subtitle={since ? `Member since ${since}` : null}
        actions={
          <Link
            href="/member/profile"
            className="inline-block rounded-full border border-ink/20 px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40"
          >
            Edit profile
          </Link>
        }
      />

      {/* Your experiences */}
      <ClubSection
        eyebrow="Your experiences"
        action={
          savedEvents.length > 0 ? (
            <ClubLink href="/experiences">See all</ClubLink>
          ) : undefined
        }
      >
        {savedEvents.length === 0 ? (
          <div className="py-4">
            <p className={BODY}>
              Nothing saved yet. Browse upcoming experiences and hit{" "}
              <span className="text-ink font-medium">Save to your club</span>{" "}
              on anything that looks good.
            </p>
            <div className="mt-6">
              <ClubLink href="/experiences">See what&rsquo;s happening →</ClubLink>
            </div>
          </div>
        ) : (
          <div>
            {upcoming.length === 0 ? (
              <p className={BODY}>
                None of your saved experiences are coming up.{" "}
                <ClubLink href="/experiences">Find the next one →</ClubLink>
              </p>
            ) : (
              <ul className="divide-y divide-ink/8">
                {upcoming.map(({ e, days }) => (
                  <SavedRow key={e.id} e={e} days={days} />
                ))}
              </ul>
            )}

            {past.length > 0 && (
              <div className="mt-10">
                <p className={`${MARK} mb-3 text-ink/40`}>Past</p>
                <ul className="divide-y divide-ink/8 opacity-60">
                  {past.map(({ e, days }) => (
                    <SavedRow key={e.id} e={e} days={days} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </ClubSection>

      {/* Member benefits */}
      <ClubSection eyebrow="Member benefits">
        <p className="text-[1.15rem] font-medium text-ink mb-3">
          {membershipConfig.benefitHeadline}
        </p>
        <ul className="space-y-1.5">
          {membershipConfig.benefitLines.map((line) => (
            <li key={line} className={BODY}>
              {line}
            </li>
          ))}
        </ul>
      </ClubSection>
    </main>
  );
}

function SavedRow({ e, days }: { e: TigerEvent; days: number }) {
  const soon = days >= 0 && days <= 7;
  const href = e.partifulLink ?? e.link;
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
        {days >= 0 && href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-tiger-fill px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-tiger-deep"
          >
            RSVP
          </a>
        )}
      </div>
    </li>
  );
}
