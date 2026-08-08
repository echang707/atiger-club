"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const lines = [
  "eat dinner with strangers who become your group chat.",
  "text back the friend you keep meaning to.",
  "run somewhere, just for the donut at the end.",
  "make something you're objectively terrible at.",
  "leave your phone in your bag for once.",
  "say yes before you talk yourself out of it.",
  "see a part of your city you've never posted.",
  "invite the person you keep almost inviting.",
  "hear someone's whole story over one meal.",
  "do the thing you saved for later. do it now.",
];

export default function RotatingLine({ intervalMs = 2600 }: { intervalMs?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % lines.length), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <div className="h-14 md:h-10 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 text-ink/60 font-medium text-sm md:text-base text-center px-6"
        >
          <span className="h-1 w-1 rounded-full bg-tiger shrink-0" />
          {lines[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
