"use client";

import { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ClawMark from "./ClawMark";
import PawPrint from "./PawPrint";

// The small claw mark beside the wordmark is a hint, not the whole
// animal. Click it and the full paw shows itself — stamps down with a
// little weight, holds a beat, then fades like ink on paper.
export default function PawClickMark({
  clawClassName = "h-6 w-8",
  pawClassName = "h-14 w-14",
  colorClassName = "text-tiger",
}: {
  clawClassName?: string;
  pawClassName?: string;
  colorClassName?: string;
}) {
  const [stampKey, setStampKey] = useState<number | null>(null);
  const counter = useRef(0);

  const onClick = useCallback(() => {
    counter.current += 1;
    setStampKey(counter.current);
    window.setTimeout(() => {
      setStampKey((k) => (k === counter.current ? null : k));
    }, 900);
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Tiger paw"
      className={`relative inline-flex items-center justify-center ${colorClassName} cursor-pointer`}
    >
      <ClawMark className={clawClassName} />
      <AnimatePresence>
        {stampKey !== null && (
          <motion.span
            key={stampKey}
            initial={{ opacity: 0, scale: 0.4, rotate: -14 }}
            animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
            className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${colorClassName}`}
          >
            <PawPrint className={pawClassName} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
