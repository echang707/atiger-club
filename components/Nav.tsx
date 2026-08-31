"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import TigerWordmark from "./TigerWordmark";
import NavMember from "./club/NavMember";
import NavMemberMobile from "./club/NavMemberMobile";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Nav and hero are one canvas. At the top of the page the bar is fully
  // transparent and the tiger artwork runs behind it, so there is no
  // horizontal seam between "navigation" and "hero" — you see a single
  // composition. Readability is bought by the hero crop: the artwork's
  // own cream negative space is positioned to fall across the nav band,
  // not by laying a cream plate over the painting.
  //
  // Once you scroll off the hero the bar earns a frosted warm-cream
  // surface, because past that point it sits over ordinary content.
  // Understated on purpose: no shadow, hairline rule only.
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? "bg-paper/85 backdrop-blur-md border-b border-ink/10"
          : // At rest the bar keeps a light frosted cream. The hero artwork
            // carries brush strokes in both top corners at every crop, so a
            // fully transparent bar put the black logo on a black stroke and
            // the orange button on an orange one. Carving the artwork was
            // tried and left visible patches; backing the bar keeps the
            // illustration whole and the nav legible.
            "nav-veil border-b border-transparent"
      }`}
    >
      <div className="max-w-content mx-auto px-5 sm:px-6 md:px-10 h-[76px] md:h-20 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Link href="/" className="justify-self-start" onClick={() => setOpen(false)}>
          <TigerWordmark className="text-[10.5px] sm:text-base md:text-xl" />
        </Link>

        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[15px] justify-self-center">
          <Link
            href="/experiences"
            className="organic-underline font-semibold text-ink hover:text-tiger-text transition-colors"
          >
            Experiences
          </Link>
          <Link
            href="/work-with-us"
            className="organic-underline font-semibold text-ink hover:text-tiger-text transition-colors"
          >
            Work With Us
          </Link>
          <Link
            href="/about"
            className="organic-underline font-semibold text-ink hover:text-tiger-text transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 justify-self-end">
          <NavMember />

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="md:hidden relative -mr-1 h-8 w-8 flex items-center justify-center text-ink"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className="absolute left-0 top-0 h-[1.5px] w-full bg-current transition-all duration-300"
                style={{ transform: open ? "translateY(6px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 bottom-0 h-[1.5px] w-full bg-current transition-all duration-300"
                style={{ transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-ink/10 bg-paper/95 backdrop-blur-md"
          >
            <div className="max-w-content mx-auto px-6 py-6 flex flex-col gap-5 text-lg">
              <Link href="/experiences" className="font-display font-semibold text-ink" onClick={() => setOpen(false)}>
                Experiences
              </Link>
              <Link href="/work-with-us" className="font-display font-semibold text-ink" onClick={() => setOpen(false)}>
                Work With Us
              </Link>
              <Link href="/about" className="font-display font-semibold text-ink" onClick={() => setOpen(false)}>
                About
              </Link>
              {/* Membership lives below a rule in the drawer so the three
                  site sections stay one visual group. "Log in" is a real
                  link on mobile because there is no room in the bar for
                  it up top. */}
              <NavMemberMobile onNavigate={() => setOpen(false)} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
