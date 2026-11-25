"use client";

/* The membership half of the nav's right-hand cluster.

   The Discord button stays exactly as it was and keeps its own label —
   these are two different doors ("join our community chat" vs "create a
   Tiger Club account") and collapsing them into one would quietly
   redirect an existing, working funnel.

   Signed out: a single "Join" pill next to Discord, with "Log in" as a
   quiet text link so the bar doesn't end up with three shouty buttons.
   Signed in: "Your Club", a link straight to the member page. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMember } from "./MemberProvider";
import { getSavedEventIds } from "@/lib/club/supabase";
import { events } from "@/lib/events";
import { upcomingAlerts, type Alert } from "@/lib/club/alerts";

export default function NavMember() {
  const { member, loading, available } = useMember();
  const pathname = usePathname();

  /* Alerts = saved events happening in the next 7 days. Re-checked on
     every navigation so saving an event updates the dot right away. */
  const [alerts, setAlerts] = useState<Alert[]>([]);
  useEffect(() => {
    if (!member) {
      setAlerts([]);
      return;
    }
    let live = true;
    getSavedEventIds(member.id).then((ids) => {
      if (!live) return;
      setAlerts(upcomingAlerts(events.filter((e) => ids.includes(e.id))));
    });
    return () => {
      live = false;
    };
  }, [member, pathname]);

  // Membership not configured (missing env vars) — show nothing rather
  // than links that lead to a broken signup.
  if (!available) return null;

  // Render nothing until the session resolves. Flashing "Join" at a
  // signed-in member on every navigation is the classic tell of a
  // bolted-on auth system.
  if (loading) return <span className="hidden md:block md:w-[68px]" />;

  if (!member) {
    // One button, not two. It opens a panel that does both signing up
    // and logging in, so a visitor never has to know in advance which
    // one they need — which is the thing two separate links get wrong.
    return (
      <Link
        href="/join"
        className="whitespace-nowrap rounded-full border-2 border-tiger-fill bg-tiger-fill px-3 py-1.5 text-[11px] font-semibold leading-none text-white transition-colors duration-300 hover:border-tiger-deep hover:bg-tiger-deep md:px-5 md:py-2.5 md:text-[15px]"
      >
        Join the Club
      </Link>
    );
  }

  return (
    <Link
      href="/member"
      aria-label="Your Club"
      className="relative flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/20 px-2.5 py-1.5 text-[11px] font-semibold leading-none text-ink transition-colors duration-300 hover:border-ink/40 md:border-2 md:px-4 md:py-2.5 md:text-[15px]"
    >
      <span
        aria-hidden="true"
        className="grid h-5 w-5 place-items-center rounded-full bg-tiger-fill text-[10px] font-bold text-white md:h-6 md:w-6 md:text-[11px]"
      >
        {member.firstName.trim().charAt(0).toUpperCase() || "T"}
      </span>
      <span className="hidden sm:inline">Your Club</span>
      {alerts.length > 0 && (
        <span
          className="absolute -top-1 -right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-tiger-fill px-1 text-[10px] font-bold leading-none text-white ring-2 ring-paper"
          aria-label={`${alerts.length} saved event${alerts.length === 1 ? "" : "s"} coming up`}
        >
          {alerts.length}
        </span>
      )}
    </Link>
  );
}
