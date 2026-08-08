"use client";

import { motion } from "framer-motion";

// On first load each word sits slightly off its resting spot — a little
// separated, a little misaligned — then over ~1.5s they drift toward each
// other and lock into the line "life is better together."
const words: { text: string; from: { x: number; y: number; rotate: number } }[] = [
  { text: "life", from: { x: -22, y: -12, rotate: -4 } },
  { text: "is", from: { x: 10, y: 20, rotate: 5 } },
  { text: "better", from: { x: 16, y: -16, rotate: -3 } },
  { text: "together.", from: { x: 30, y: 22, rotate: 4 } },
];

export default function WordsFindEachOther() {
  return (
    <h1 className="font-tagline italic font-normal text-4xl sm:text-5xl md:text-6xl tracking-tight text-ink text-center leading-[1.1] flex flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-1">
      {words.map((w, i) => (
        <motion.span
          key={w.text}
          initial={{ opacity: 0, x: w.from.x, y: w.from.y, rotate: w.from.rotate }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{
            duration: 1.5,
            delay: 0.15 + i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {w.text}
        </motion.span>
      ))}
    </h1>
  );
}
