"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMember } from "@/components/club/MemberProvider";
import { ClubHero, ClubSection, MARK } from "@/components/club/ClubUI";
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
          <p className={`${MARK} text-ink/40`}>
            {available ? "One moment…" : "Membership is unavailable."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-paper pt-[76px] md:pt-20">
      <ClubHero
        member={member}
        eyebrow="Your Profile"
        title={`${member.firstName} ${member.lastName}`}
        subtitle={member.email}
        actions={
          <Link
            href="/member"
            className={`${MARK} text-ink/50 transition-colors hover:text-ink`}
          >
            ← Your Club
          </Link>
        }
      />
      <ProfilePanel member={member} />
    </main>
  );
}
