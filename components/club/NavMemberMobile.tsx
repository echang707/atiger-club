"use client";

/* Membership section inside the mobile drawer.

   Since the avatar button is now hidden from the mobile nav bar (to keep
   it symmetric — logo left, hamburger right), this is the only place on
   mobile where membership is surfaced. It goes at the BOTTOM of the
   drawer, below a divider, keeping the main nav links together at top. */

import Link from "next/link";
import { Avatar } from "./ClubUI";
import { useMember } from "./MemberProvider";
import { signOut } from "@/lib/club/supabase";

export default function NavMemberMobile({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const { member, loading, available } = useMember();

  if (!available || loading) return null;

  const link = "font-display font-semibold text-ink";

  if (!member) {
    return (
      <div className="mt-1 border-t border-ink/10 pt-5">
        <Link href="/join" className={link} onClick={onNavigate}>
          Join the Club
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-1 border-t border-ink/10 pt-5">
      {/* Mini identity card at the top of the signed-in drawer */}
      <div className="flex items-center gap-3 mb-5">
        <Avatar member={member} size={36} />
        <div className="min-w-0">
          <p className="font-semibold text-ink leading-tight truncate">
            {member.firstName} {member.lastName}
          </p>
          <p className="text-[12px] text-ink/50 truncate">{member.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Link href="/member" className={link} onClick={onNavigate}>
          Your Club
        </Link>
        <Link href="/member/profile" className={link} onClick={onNavigate}>
          Your Profile
        </Link>
        <button
          type="button"
          onClick={() => { onNavigate(); void signOut(); }}
          className="text-left font-display font-semibold text-ink/50"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
