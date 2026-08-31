"use client";

/* Membership links inside the mobile drawer. Separate component from
   NavMember because the shapes genuinely differ — the bar needs a
   compact pill and a popover, the drawer needs plain stacked links in
   the same type as the rest of the menu. Sharing one component would
   mean a pile of conditional classes for no gain. */

import Link from "next/link";
import { useMember } from "./MemberProvider";
import { signOut } from "@/lib/club/supabase";

export default function NavMemberMobile({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const { member, loading, available } = useMember();

  if (!available || loading) return null;

  const item = "font-display font-semibold text-ink";

  if (!member) {
    return (
      <div className="mt-1 flex flex-col gap-5 border-t border-ink/10 pt-5">
        <Link href="/join" className={item} onClick={onNavigate}>
          Join the Club
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-1 flex flex-col gap-5 border-t border-ink/10 pt-5">
      <Link href="/member" className={item} onClick={onNavigate}>
        Your Club
      </Link>
      <Link href="/member/profile" className={item} onClick={onNavigate}>
        Your Profile
      </Link>
      <button
        type="button"
        onClick={() => {
          onNavigate();
          void signOut();
        }}
        className="text-left font-display font-semibold text-ink/60"
      >
        Log out
      </button>
    </div>
  );
}
