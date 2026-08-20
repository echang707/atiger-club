"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewsletterForm from "./NewsletterForm";
import { isSubscribed, isDismissedRecently, markDismissed } from "@/lib/newsletterStorage";

/* Shows once per visit at most, after 15s on the site OR 40% scroll,
   whichever happens first. Skipped entirely if the person already
   subscribed, or dismissed it within the last 10 days. Both checks are
   read once on mount (not on every render), and the timers/listener are
   torn down the moment either condition fires or the component decides
   not to show at all. */
export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [eligible, setEligible] = useState(false);
  const shownRef = useRef(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isSubscribed() || isDismissedRecently()) return;
    setEligible(true);
  }, []);

  useEffect(() => {
    if (!eligible) return;

    const show = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      setOpen(true);
    };

    const timer = window.setTimeout(show, 15000);

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = window.scrollY / scrollable;
      if (pct >= 0.4) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [eligible]);

  // Focus the close button on open, and let Escape dismiss — the two
  // pieces of keyboard support a modal-ish card like this needs without
  // building a full focus trap for a two-field form.
  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleDismiss = () => {
    setOpen(false);
    markDismissed();
  };

  const handleSuccess = () => {
    // Leave it on screen a moment so "You're in" registers, then close.
    window.setTimeout(() => setOpen(false), 2200);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="newsletter-popup-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[70] bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[380px]"
        >
          <div className="relative rounded-2xl border border-ink/10 bg-paper shadow-[0_12px_40px_-8px_rgba(21,19,14,0.35)] px-6 py-6">
            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleDismiss}
              aria-label="Close"
              className="absolute top-3.5 right-3.5 h-7 w-7 grid place-items-center rounded-full text-ink/50 hover:text-ink hover:bg-ink/5 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M1 1L12 12M12 1L1 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>

            <p
              id="newsletter-popup-heading"
              className="font-display text-2xl text-ink leading-tight pr-6"
            >
              Stay in the loop.
            </p>
            <p className="mt-2 text-sm text-ink/70 leading-snug pr-2">
              The best Tiger Club experiences, gatherings, and things worth
              doing, straight to your inbox.
            </p>

            <div className="mt-4">
              <NewsletterForm
                variant="popup"
                note="No spam. Just good reasons to leave the house."
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
