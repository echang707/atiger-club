"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const lines = [
  "eat dinner with someone you just met.",
  "write a letter to someone you miss.",
  "run somewhere just for the donut at the end.",
  "learn your neighbor's language.",
  "make something you're terrible at.",
  "spend a Saturday helping someone else.",
  "see a part of your city you've never seen.",
  "invite someone you want to know better.",
  "hear someone's story over a meal.",
  "try something you've always been scared to try.",
];

export default function RotatingLine({ intervalMs = 2600 }: { intervalMs?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % lines.length), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <div className="h-12 md:h-8 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-ink/55 text-sm md:text-base text-center px-6"
        >
          {lines[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
