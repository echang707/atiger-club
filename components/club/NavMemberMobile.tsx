"use client";

import Link from "next/link";

/* Join link in the mobile drawer — below the page nav links. */
export default function NavMemberMobile({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  return (
    <div className="mt-1 border-t border-ink/10 pt-5">
      <Link
        href="/join"
        className="font-display font-semibold text-ink"
        onClick={onNavigate}
      >
        Join the Club
      </Link>
    </div>
  );
}
