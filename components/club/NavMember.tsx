"use client";

import Link from "next/link";

/* Desktop nav right slot — simple Join CTA, no auth state. */
export default function NavMember() {
  return (
    <Link
      href="/join"
      className="whitespace-nowrap rounded-full border-2 border-tiger-fill bg-tiger-fill px-3 py-1.5 text-[11px] font-semibold leading-none text-white transition-colors duration-300 hover:border-tiger-deep hover:bg-tiger-deep md:px-5 md:py-2.5 md:text-[15px]"
    >
      Join the Club
    </Link>
  );
}
