"use client";

import Link from "next/link";

/* Desktop nav right slot — clean text link, no pill. */
export default function NavMember() {
  return (
    <Link
      href="/join"
      className="whitespace-nowrap text-[14px] font-semibold text-tiger-fill transition-colors duration-200 hover:text-tiger-deep"
    >
      Join →
    </Link>
  );
}
