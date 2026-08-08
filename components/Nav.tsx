"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { discordUrl } from "@/lib/events";

export default function Nav() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-content mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <Link
            href="/"
            className="text-[11px] md:text-xs font-medium tracking-[0.18em] uppercase text-ink flex items-center gap-2"
          >
            <span className="stripe-mark text-amber-deep">
              <span></span><span></span><span></span>
            </span>
            Tiger Club
          </Link>

          <nav className="flex items-center gap-5 md:gap-8 text-[11px] md:text-xs font-medium tracking-[0.14em] uppercase text-ink/70">
            <Link href="/events" className="hover:text-ink transition-colors">
              Experiences
            </Link>
            <button
              onClick={() => setAboutOpen(true)}
              className="hover:text-ink transition-colors"
            >
              About
            </button>
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-rust transition-colors"
            >
              Join ↗
            </a>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {aboutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setAboutOpen(false)}
              className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-[70] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[88vw] max-w-sm bg-ivory rounded-2xl paper-shadow p-8 text-center"
            >
              <span className="stripe-mark text-amber-deep justify-center mb-4">
                <span></span><span></span><span></span>
              </span>
              <p className="font-display text-xl text-ink leading-snug mb-2">
                A social club for Atlanta people who do things.
              </p>
              <p className="text-sm text-ink/60 mb-6">
                Dinners, run clubs, festivals, coffee meetups — real gatherings, real people.
              </p>
              <div className="flex items-center justify-center gap-5 text-sm font-medium">
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline-stripe"
                >
                  Join ↗
                </a>
                <button
                  onClick={() => setAboutOpen(false)}
                  className="text-ink/40 hover:text-ink/70 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
