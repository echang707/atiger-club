"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

const words: { text: string; from: { x: number; y: number; rotate: number }; nudge: number }[] = [
  { text: "life", from: { x: -120, y: -60, rotate: -10 }, nudge: 7 },
  { text: "is", from: { x: 46, y: 88, rotate: 12 }, nudge: 3 },
  { text: "better", from: { x: 78, y: -74, rotate: -9 }, nudge: -3 },
  { text: "together", from: { x: 132, y: 92, rotate: 10 }, nudge: -7 },
];

function Word({ w, i, closeness }: { w: (typeof words)[number]; i: number; closeness: MotionValue<number> }) {
  const nudgeX = useTransform(closeness, [0, 1], [0, w.nudge]);
  return (
    <motion.span
      initial={{ opacity: 0, x: w.from.x, y: w.from.y, rotate: w.from.rotate, scale: 0.82, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.9, delay: 0.15 + i * 0.11, ease: [0.11, 0.6, 0.15, 1] }}
      className="inline-block"
    >
      <motion.span className="inline-block" style={{ x: nudgeX }}>{w.text}</motion.span>
    </motion.span>
  );
}

export default function WordsFindEachOther({ closeness }: { closeness: MotionValue<number> }) {
  return (
    // container-type lets the tagline's font-size be sized as a fraction
    // of its own box (cqw) rather than the viewport, so "together" never
    // has anywhere to wrap to regardless of how the surrounding layout
    // constrains this element's width.
    <div className="hero-tagline-wrap w-full">
      <h1 className="hero-tagline font-tagline italic font-normal tracking-tight text-ink text-center leading-[1.06] flex flex-nowrap items-baseline justify-center whitespace-nowrap gap-x-[0.26em]">
        {words.map((w, i) => <Word key={w.text} w={w} i={i} closeness={closeness} />)}
        <motion.span
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.7 }}
          className="inline-block -ml-[0.25em]"
        >.</motion.span>
      </h1>
    </div>
  );
}
