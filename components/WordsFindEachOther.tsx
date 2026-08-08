"use client";

import { motion } from "framer-motion";

// On first load each word sits far off its resting spot — scattered,
// tiny, and soft-focus, like it's drifting in from somewhere else —
// then slowly, gently drifts and comes into focus, arriving late and
// unhurried until they all settle into "life is better together."
const words: { text: string; from: { x: number; y: number; rotate: number } }[] = [
  { text: "life", from: { x: -120, y: -60, rotate: -10 } },
  { text: "is", from: { x: 46, y: 88, rotate: 12 } },
  { text: "better", from: { x: 78, y: -74, rotate: -9 } },
  { text: "together.", from: { x: 132, y: 92, rotate: 10 } },
];

export default function WordsFindEachOther() {
  return (
    <h1 className="font-tagline italic font-normal text-4xl sm:text-5xl md:text-6xl tracking-tight text-ink text-center leading-[1.1] flex flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-1">
      {words.map((w, i) => (
        <motion.span
          key={w.text}
          initial={{ opacity: 0, x: w.from.x, y: w.from.y, rotate: w.from.rotate, scale: 0.82, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: 3.0,
            delay: 0.25 + i * 0.16,
            ease: [0.11, 0.6, 0.15, 1],
          }}
          className="inline-block"
        >
          {w.text}
        </motion.span>
      ))}
    </h1>
  );
}
