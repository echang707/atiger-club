"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMember } from "@/components/club/MemberProvider";
import { membershipConfig } from "@/lib/membership";
import { memberSince } from "@/lib/member";
import ProfilePanel from "@/components/club/ProfilePanel";
import { events, upcomingEvents } from "@/lib/events";
import EventRow from "@/components/EventRow";

/* ---------------------------------------------------------------------
   Your Club.

   Deliberately four panels and no more. The brief lists a long future
   for this page — tickets, stripes, referrals, recommendations — and the
   temptation is to lay out placeholder cards for all of it. Empty
   scaffolding makes a new club look abandoned, so each panel is added
   when it has something true to say.

   What IS built for the future is the shape: Panel is a plain wrapper
   taking a title and children, so adding "Your Stripes" later is one
   more <Panel>, not a layout rewrite.
   --------------------------------------------------------------------- */

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink/10 py-8 md:py-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-wideish text-ink/60">
          {title}
        </h2>
        {action}
      </div>
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
  const upcoming = upcomingEvents(events).slice(0, 3);

  return (
    <main className="min-h-svh px-5 pb-28 pt-32 sm:px-6 md:px-10 md:pt-40">
      <div className="mx-auto max-w-content">
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
          <Panel
            title="Upcoming Tiger Club experiences"
            action={
              <Link
                href="/events"
                className="organic-underline text-[14px] font-semibold text-ink"
              >
                See all
              </Link>
            }
          >
            {upcoming.length ? (
              <div>
                {upcoming.map((e, i) => (
                  <EventRow key={e.id} event={e} index={i} />
                ))}
              </div>
            ) : (
              <p className="text-[15px] text-ink/60">
                Nothing on the calendar just yet. Check back soon.
              </p>
            )}
          </Panel>

          {/* Events you've signed up for. Nothing can appear here yet:
              every event is still EXTERNAL, so registration happens on
              Partiful and never reports back. Rather than an empty list
              or a demoralising "0 experiences", this says what will fill
              it. Real rows arrive the moment native registration ships —
              the Registration model and lib/member.ts bucketing are
              already built for them. */}
          <Panel title="Where you've been">
            <p className="text-[15px] leading-relaxed text-ink/60">
              When you sign up for a Tiger Club experience here, it'll show up
              in this spot — what's coming, then everywhere you've been.
            </p>
          </Panel>

          <Panel title="Member Benefits">
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

          <div id="profile" className="scroll-mt-28">
            <Panel title="Your Profile">
              <ProfilePanel member={member} />
            </Panel>
          </div>
        </div>
      </div>
    </main>
  );
}
