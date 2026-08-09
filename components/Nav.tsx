"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || open ? "bg-paper/85 backdrop-blur-md border-b border-ink/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 h-16 md:h-20 grid grid-cols-[1fr_auto_1fr] items-center">
        <Link href="/" className="flex items-center gap-2.5 text-ink justify-self-start" onClick={() => setOpen(false)}>
          <span className="stripe-mark text-tiger">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className="font-wordmark font-extrabold text-lg md:text-xl tracking-tight inline-flex items-center">
            TIGER
            <span className="inline-block h-[0.22em] w-[0.22em] rounded-full bg-tiger mx-[0.14em]" />
            CLUB
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-sm justify-self-center">
          <Link href="/events" className="organic-underline text-ink/80 hover:text-ink transition-colors">
            Experiences
          </Link>
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <a
            href="https://discord.gg/6u83g4P8Cb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-ink border border-ink/20 px-4 py-2 rounded-full hover:border-tiger hover:text-tiger transition-colors duration-300 whitespace-nowrap"
          >
            Join the Club
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="md:hidden relative h-9 w-9 flex items-center justify-center text-ink"
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
              <Link href="/events" className="font-display text-ink" onClick={() => setOpen(false)}>
                Experiences
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
