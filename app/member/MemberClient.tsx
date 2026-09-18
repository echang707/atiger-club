"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "@/components/club/MemberProvider";
import {
  BODY,
  ClubMasthead,
  ClubSection,
  MARK,
} from "@/components/club/ClubUI";
import { membershipConfig } from "@/lib/membership";
import { memberSince } from "@/lib/member";
import { events } from "@/lib/events";
import { getSavedEventIds } from "@/lib/club/supabase";
import { useEffect, useState } from "react";

/* ---------------------------------------------------------------------
   Your Club.

   Everything here is either yours or about you. The public events
   calendar is deliberately absent: a dashboard that opens with the same
   list as /experiences is just /experiences with a greeting on top. The
   profile has its own page — a form hanging off the bottom is what made
   this read as a settings screen.

   Adding "Your Stripes" or "Referrals" later is one more <ClubSection>.
   --------------------------------------------------------------------- */

export default function MemberClient() {
  const router = useRouter();
  const { member, loading, available } = useMember();

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedEvents, setSavedEvents] = useState<typeof events>([]);

  useEffect(() => {
    if (!member) return;
    getSavedEventIds(member.id).then(ids => {
      setSavedIds(ids);
      setSavedEvents(events.filter(e => ids.includes(e.id)));
    });
  }, [member]);

  // No server-side guard by design (see lib/club/supabase.ts) — the
  // database enforces access; this is navigation courtesy.
  useEffect(() => {
    if (!loading && !member) router.replace("/login?next=/member");
  }, [loading, member, router]);

  if (loading || !member) {
    return (
      <main className="min-h-svh pt-[76px] md:pt-20">
        <div className="mx-auto max-w-content px-6 py-16 md:px-10">
          <p className={`${MARK} text-ink/45`}>
            {available ? "Opening your club" : "Membership is unavailable"}
          </p>
        </div>
      </main>
    );
  }

  const since = memberSince(member);

  return (
    <main className="min-h-svh pt-[76px] md:pt-20">
      <ClubMasthead
        member={member}
        mark="Your club"
        title={`Welcome back, ${member.firstName}.`}
        meta={since ? `Member since ${since}` : null}
      />

      {/* Only what this member signed up for. Nothing can appear yet:
          every event is still EXTERNAL, so registration happens on
          Partiful and never reports back. Rather than pad the space with
          the public calendar, the empty state points at the one useful
          next action. Real rows arrive with native registration — the
          Registration model and the bucketing in lib/member.ts are
          already built for them. */}
      <ClubSection mark="Your experiences">
        {savedEvents.length === 0 ? (
          <>
            <p className={BODY}>
              Nothing saved yet. Hit &ldquo;Save to your club&rdquo; on any
              experience and it&rsquo;ll show up here.
            </p>
            <Link
              href="/experiences"
              className={`organic-underline mt-6 inline-block ${MARK} text-ink transition-colors hover:text-tiger-text`}
            >
              see what&rsquo;s happening
            </Link>
          </>
        ) : (
          <ul className="space-y-5">
            {savedEvents.map((e) => (
              <li
                key={e.id}
                className="border-b border-ink/10 pb-5 last:border-b-0 last:pb-0"
              >
                <p className="font-display text-xl text-ink">{e.title}</p>
                <p className={`${MARK} mt-1 text-ink/45`}>
                  {e.month} {e.day}
                  {e.time ? ` · ${e.time}` : ""}
                  {e.location ? ` · ${e.location}` : ""}
                </p>
                {(e.partifulLink ?? e.link) && (
                  <a
                    href={e.partifulLink ?? e.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`organic-underline mt-3 inline-block ${MARK} text-ink transition-colors hover:text-tiger-text`}
                  >
                    {e.partifulLink ? "RSVP on Partiful" : (e.linkLabel ?? "Learn More")}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </ClubSection>

      <ClubSection mark="Member benefits">
        <p className="text-lg text-ink md:text-xl">
          {membershipConfig.benefitHeadline}
        </p>
        <ul className="mt-3 space-y-1">
          {membershipConfig.benefitLines.map((line) => (
            <li key={line} className={BODY}>
              {line}
            </li>
          ))}
        </ul>
      </ClubSection>

      <ClubSection mark="Your profile">
        <p className={BODY}>
          Your name, photo and the details that help us host you well.
        </p>
        <Link
          href="/member/profile"
          className={`organic-underline mt-6 inline-block ${MARK} text-ink transition-colors hover:text-tiger-text`}
        >
          view and edit
        </Link>
      </ClubSection>
    </main>
  );
}
