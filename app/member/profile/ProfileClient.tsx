"use client";

/* Profile on its own page rather than a panel on the dashboard. Your
   Club is somewhere you land; a profile is somewhere you go to change
   something. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMember } from "@/components/club/MemberProvider";
import { ClubMasthead, MARK } from "@/components/club/ClubUI";
import ProfilePanel from "@/components/club/ProfilePanel";

export default function ProfileClient() {
  const router = useRouter();
  const { member, loading, available } = useMember();

  useEffect(() => {
    if (!loading && !member) router.replace("/login?next=/member/profile");
  }, [loading, member, router]);

  if (loading || !member) {
    return (
      <main className="min-h-svh pt-[76px] md:pt-20">
        <div className="mx-auto max-w-content px-6 py-16 md:px-10">
          <p className={`${MARK} text-ink/45`}>
            {available ? "One moment" : "Membership is unavailable"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh pt-[76px] md:pt-20">
      <ClubMasthead
        member={member}
        mark="Your profile"
        title={`${member.firstName} ${member.lastName}`}
        meta={member.email}
      />
      <ProfilePanel member={member} />
      <div className="mx-auto max-w-content px-6 py-10 md:px-10">
        <Link
          href="/member"
          className={`organic-underline ${MARK} text-ink transition-colors hover:text-tiger-text`}
        >
          back to your club
        </Link>
      </div>
    </main>
  );
}
