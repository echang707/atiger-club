"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMember } from "@/components/club/MemberProvider";
import { ClubHero, ClubSection, ClubLink, BODY, MARK } from "@/components/club/ClubUI";
import { membershipConfig } from "@/lib/membership";
import { memberSince } from "@/lib/member";
import { events } from "@/lib/events";
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
          <ul className="divide-y divide-ink/8">
            {savedEvents.map((e) => (
              <li key={e.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[1.15rem] leading-snug text-ink">
                      {e.title}
                    </p>
                    <p className={`${MARK} mt-1.5 text-ink/45`}>
                      {e.month} {e.day}
                      {e.time ? ` · ${e.time}` : ""}
                    </p>
                    {e.location && (
                      <p className="mt-0.5 text-[14px] text-ink/50">{e.location}</p>
                    )}
                  </div>
                  {(e.partifulLink ?? e.link) && (
                    <a
                      href={e.partifulLink ?? e.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-full bg-tiger-fill px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-tiger-deep"
                    >
                      RSVP
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
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
