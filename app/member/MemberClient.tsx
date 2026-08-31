"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMember } from "@/components/club/MemberProvider";
import {
  BODY,
  ClubMasthead,
  ClubSection,
  MARK,
} from "@/components/club/ClubUI";
import { membershipConfig } from "@/lib/membership";
import { memberSince } from "@/lib/member";

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
        <p className={BODY}>
          Nothing booked yet. When you sign up for a Tiger Club experience,
          it&rsquo;ll live here &mdash; what&rsquo;s coming, then everywhere
          you&rsquo;ve been.
        </p>
        <Link
          href="/experiences"
          className={`organic-underline mt-6 inline-block ${MARK} text-ink transition-colors hover:text-tiger-text`}
        >
          see what&rsquo;s happening
        </Link>
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
