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

// The fade-in and the rotation interval are driven by the same clock so
// the first line is never cut short: the interval only starts counting
// once the line has actually finished appearing, not the moment the
// component mounts (which is what caused the old "first line barely
// shows before the second one jumps in" glitch).
export default function RotatingLine({
  intervalMs = 2600,
  startDelayMs = 0,
}: {
  intervalMs?: number;
  startDelayMs?: number;
}) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(startDelayMs === 0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      setVisible(true);
      interval = setInterval(() => setI((n) => (n + 1) % lines.length), intervalMs);
    }, startDelayMs);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [intervalMs, startDelayMs]);

  return (
    <div className="h-14 md:h-10 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 text-ink/60 font-medium text-sm md:text-base text-center px-6"
          >
            <span className="h-1 w-1 rounded-full bg-tiger shrink-0" />
            <span>{lines[i]}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
