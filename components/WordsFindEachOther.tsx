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
}: {
  w: { text: string; from: { x: number; y: number; rotate: number }; nudge: number };
  i: number;
  closeness: MotionValue<number>;
}) {
  const nudgeX = useTransform(closeness, [0, 1], [0, w.nudge]);
  return (
    <motion.span
      initial={{ opacity: 0, x: w.from.x, y: w.from.y, rotate: w.from.rotate, scale: 0.82, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.9, delay: 0.15 + i * 0.11, ease: [0.11, 0.6, 0.15, 1] }}
      className="inline-block"
    >
      <motion.span className="inline-block text-shield" style={{ x: nudgeX }}>
        {w.text}
      </motion.span>
    </motion.span>
  );
}

export default function WordsFindEachOther({ closeness }: { closeness: MotionValue<number> }) {
  const nudgeX = useTransform(closeness, [0, 1], [0, -7]);

  return (
    // "together." is set on its own line, and this is the one structural
    // change to the hero. The tail's flourish has to pass around the LEFT
    // side of that word, and on a single line there is only the width of
    // a word space between "better" and "together" — nowhere near enough
    // for the curve to turn through without running over the letters. The
    // break buys the clearance, and it puts the word the whole page is
    // about on a line of its own.
    <h1 className="font-tagline italic font-normal text-4xl sm:text-5xl md:text-6xl tracking-tight text-ink text-center leading-[1.1] flex flex-col items-center">
      <span className="flex flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-1">
        {words.map((w, i) => (
          <Word key={w.text} w={w} i={i} closeness={closeness} />
        ))}
      </span>

      {/* The gap below is clearance for the top of the flourish, not
          decoration — keep it if you retune the loop's padding. */}
      <span className="mt-[1.1em] inline-flex items-baseline">
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
