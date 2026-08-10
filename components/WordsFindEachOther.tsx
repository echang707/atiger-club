"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

const words: { text: string; from: { x: number; y: number; rotate: number }; nudge: number }[] = [
  { text: "life", from: { x: -120, y: -60, rotate: -10 }, nudge: 7 },
  { text: "is", from: { x: 46, y: 88, rotate: 12 }, nudge: 3 },
  { text: "better", from: { x: 78, y: -74, rotate: -9 }, nudge: -3 },
];

function Word({
  w,
  i,
  closeness,
  hugLimit,
}: {
  w: { text: string; from: { x: number; y: number; rotate: number }; nudge: number };
  i: number;
  closeness: MotionValue<number>;
  hugLimit?: boolean;
}) {
  const nudgeX = useTransform(closeness, [0, 1], [0, w.nudge]);
  return (
    <motion.span
      initial={{ opacity: 0, x: w.from.x, y: w.from.y, rotate: w.from.rotate, scale: 0.82, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.9, delay: 0.15 + i * 0.11, ease: [0.11, 0.6, 0.15, 1] }}
      className="inline-block"
    >
      <motion.span
        className="inline-block text-shield"
        style={{ x: nudgeX }}
        // Marks "better" -- the word right before "together" on the same
        // line -- as the boundary the tail's hug can't swing past. See
        // the note in lib/tail.ts (heroHug) for why that boundary exists.
        data-stripe-hug-limit={hugLimit || undefined}
      >
        {w.text}
      </motion.span>
    </motion.span>
  );
}

export default function WordsFindEachOther({ closeness }: { closeness: MotionValue<number> }) {
  const nudgeX = useTransform(closeness, [0, 1], [0, -7]);

  return (
    // "life is better together." stays on one line, always -- on desktop
    // and down through mobile. The tail adapts to the type, never the
    // type to the tail: nowrap plus a clamp()'d font size (rather than
    // Tailwind's stepped text-4xl/5xl/6xl) means the line shrinks
    // continuously to fit any viewport instead of ever wrapping.
    <h1
      className="font-tagline italic font-normal tracking-tight text-ink text-center whitespace-nowrap"
      style={{ fontSize: "clamp(1rem, 5.5vw, 3.75rem)", lineHeight: 1.1 }}
    >
      <span className="inline-flex flex-nowrap items-baseline gap-x-[0.28em] whitespace-nowrap">
        {words.map((w, i) => (
          <Word key={w.text} w={w} i={i} closeness={closeness} hugLimit={i === words.length - 1} />
        ))}
        <motion.span
          initial={{ opacity: 0, x: 132, y: 92, rotate: 10, scale: 0.82, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.9, delay: 0.48, ease: [0.11, 0.6, 0.15, 1] }}
          className="inline-block"
        >
          <motion.span data-stripe-hug className="inline-block text-shield" style={{ x: nudgeX }}>
            together
          </motion.span>
        </motion.span>
        <motion.span
          data-stripe-start
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.7 }}
          className="inline-block text-shield"
        >
          .
        </motion.span>
      </span>
    </h1>
  );
}
