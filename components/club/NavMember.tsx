"use client";

/* The membership half of the nav's right-hand cluster.

   The Discord button stays exactly as it was and keeps its own label —
   these are two different doors ("join our community chat" vs "create a
   Tiger Club account") and collapsing them into one would quietly
   redirect an existing, working funnel.

   Signed out: a single "Join" pill next to Discord, with "Log in" as a
   quiet text link so the bar doesn't end up with three shouty buttons.
   Signed in: "Your Club" opening a small menu. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMember } from "./MemberProvider";
import { signOut } from "@/lib/club/supabase";

export default function NavMember() {
  const { member, loading, available } = useMember();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on outside click and on Escape — the two things people try.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

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
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/20 px-2.5 py-1.5 text-[11px] font-semibold leading-none text-ink transition-colors duration-300 hover:border-ink/40 md:border-2 md:px-4 md:py-2.5 md:text-[15px]"
      >
        <span
          aria-hidden="true"
          className="grid h-5 w-5 place-items-center rounded-full bg-tiger-fill text-[10px] font-bold text-white md:h-6 md:w-6 md:text-[11px]"
        >
          {member.firstName.trim().charAt(0).toUpperCase() || "T"}
        </span>
        <span className="hidden sm:inline">Your Club</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] w-48 overflow-hidden rounded-sm border border-ink/10 bg-paper shadow-sm"
          >
            <MenuLink href="/member">Your Club</MenuLink>
            <MenuLink href="/member#profile">Your Profile</MenuLink>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="block w-full border-t border-ink/10 px-4 py-3 text-left text-[15px] text-ink/70 transition-colors hover:bg-ink/[0.04]"
            >
              Log out
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="block px-4 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-ink/[0.04]"
    >
      {children}
    </Link>
  );
}
