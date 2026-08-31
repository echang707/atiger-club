"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMember } from "@/components/club/MemberProvider";
import { membershipConfig } from "@/lib/membership";
import { memberSince } from "@/lib/member";

/* ---------------------------------------------------------------------
   Your Club.

   Two panels. Everything here is either yours or about you — nothing
   generic. The public events calendar is deliberately absent: a
   dashboard that opens with the same list as /experiences is just
   with a greeting on top. When an event appears here it will be because
   you are going to it.

   The profile is gone too, onto its own page. A form hanging off the
   bottom of a dashboard is what made this read as a settings screen
   rather than a membership.

   Adding "Your Stripes" or "Referrals" later is one more <Panel>.
   --------------------------------------------------------------------- */

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink/10 py-8 md:py-10">
      <h2 className="font-mono text-[11px] uppercase tracking-wideish text-ink/60">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function MemberClient() {
  const router = useRouter();
  const { member, loading, available } = useMember();

  // No server-side guard by design (see lib/club/supabase.ts) — the
  // database enforces access, this is just navigation courtesy.
  useEffect(() => {
    if (!loading && !member) router.replace("/login?next=/member");
  }, [loading, member, router]);

  if (loading || !member) {
    return (
      <main className="min-h-svh px-5 pt-32 sm:px-6 md:px-10 md:pt-40">
        <div className="mx-auto max-w-content">
          <p className="font-mono text-[11px] uppercase tracking-wideish text-ink/40">
            {available ? "Opening your club…" : "Membership is unavailable."}
          </p>
        </div>
      </main>
    );
  }

  const since = memberSince(member);

  return (
    <main className="min-h-svh px-5 pb-28 pt-32 sm:px-6 md:px-10 md:pt-40">
      <div className="mx-auto w-full max-w-[46rem]">
        <p className="font-mono text-[11px] uppercase tracking-wideish text-tiger-text">
          Your Club
        </p>
        <h1 className="mt-3 font-display text-[2.25rem] leading-[1.05] text-ink md:text-[3.25rem]">
          Welcome back, {member.firstName}.
        </h1>
        {since ? (
          <p className="mt-3 text-[15px] text-ink/60">Member since {since}</p>
        ) : null}

        <div className="mt-12">
          {/* Only events this member has signed up for. Nothing can
              appear yet: every event is still EXTERNAL, so registration
              happens on Partiful and never reports back. Rather than pad
              the space with the public calendar, this says plainly what
              will fill it. Real rows arrive with native registration —
              the Registration model and the bucketing in lib/member.ts
              are already built for them. */}
          <Panel title="Your experiences">
            <p className="text-[15px] leading-relaxed text-ink/60">
              You haven't signed up for anything yet. When you do, it'll live
              here — what's coming, then everywhere you've been.
            </p>
            <Link
              href="/experiences"
              className="organic-underline mt-4 inline-block text-[14px] font-semibold text-ink"
            >
              See what's on
            </Link>
          </Panel>

          <Panel title="Member benefits">
            <p className="text-[15px] text-ink">
              {membershipConfig.benefitHeadline}
            </p>
            <ul className="mt-3 space-y-1.5">
              {membershipConfig.benefitLines.map((line) => (
                <li key={line} className="text-[15px] text-ink/60">
                  {line}
                </li>
              ))}
            </ul>
          </Panel>

          {/* A quiet link rather than a panel — findable without taking
              up the page. */}
          <div className="border-t border-ink/10 py-8">
            <Link
              href="/member/profile"
              className="organic-underline text-[14px] font-semibold text-ink"
            >
              Your profile
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
