"use client";

/* Profile on its own page rather than a panel on the dashboard.

   Your Club is somewhere you land; a profile is something you go and
   edit occasionally. Mixing them meant the dashboard opened with a form
   attached to the bottom, which is what made it feel like a settings
   screen instead of a membership. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMember } from "@/components/club/MemberProvider";
import ProfilePanel from "@/components/club/ProfilePanel";

export default function ProfileClient() {
  const router = useRouter();
  const { member, loading, available } = useMember();

  useEffect(() => {
    if (!loading && !member) router.replace("/login?next=/member/profile");
  }, [loading, member, router]);

  if (loading || !member) {
    return (
      <main className="min-h-svh px-5 pt-32 sm:px-6 md:px-10 md:pt-40">
        <div className="mx-auto max-w-content">
          <p className="font-mono text-[11px] uppercase tracking-wideish text-ink/40">
            {available ? "One moment…" : "Membership is unavailable."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh px-5 pb-28 pt-32 sm:px-6 md:px-10 md:pt-40">
      <div className="mx-auto w-full max-w-[34rem]">
        <Link
          href="/member"
          className="organic-underline font-mono text-[11px] uppercase tracking-wideish text-ink/50"
        >
          Back to your club
        </Link>
        <h1 className="mt-4 font-display text-[2rem] leading-[1.05] text-ink md:text-[2.75rem]">
          Your profile.
        </h1>
        <div className="mt-10">
          <ProfilePanel member={member} />
        </div>
      </div>
    </main>
  );
}
