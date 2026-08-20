"use client";

import { motion } from "framer-motion";

const words: { text: string; from: { x: number; y: number; rotate: number }; nudge: string }[] = [
  { text: "life", from: { x: -120, y: -60, rotate: -10 }, nudge: "0.045em" },
  { text: "is", from: { x: 46, y: 88, rotate: 12 }, nudge: "0.02em" },
  { text: "better", from: { x: 78, y: -74, rotate: -9 }, nudge: "-0.02em" },
  { text: "together", from: { x: 132, y: 92, rotate: 10 }, nudge: "-0.045em" },
];

function Word({ w, i }: { w: (typeof words)[number]; i: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: w.from.x, y: w.from.y, rotate: w.from.rotate, scale: 0.82, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.9, delay: 0.15 + i * 0.11, ease: [0.11, 0.6, 0.15, 1] }}
      className="inline-block"
    >
      {/* The words settle a few px closer together once, right after they
          land — a single time-based "find each other" nudge on mount.
          Nothing here reads scroll position, so once settled the text
          never moves again while the page scrolls.

          Nudge is in em, not px: a fixed-px nudge closes a bigger share
          of the (em-based) word gap at small font sizes than at large
          ones, and on the mobile clamp it was eating almost the whole
          gap and letting "is/better/together" touch. In em it scales
          with the same font-size as the gap, so the closure is always
          the same fraction of it — at most 0.045em vs a 0.26em gap,
          leaving a safe minimum space between every pair of words at
          any screen size. */}
      <motion.span
        className="inline-block"
        initial={{ x: 0 }}
        animate={{ x: w.nudge }}
        transition={{ duration: 1.1, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {w.text}
      </motion.span>
    </motion.span>
  );
}

export default function WordsFindEachOther() {
  return (
    // container-type lets the tagline's font-size be sized as a fraction
    // of its own box (cqw) rather than the viewport, so "together" never
    // has anywhere to wrap to regardless of how the surrounding layout
    // constrains this element's width.
    <div className="hero-tagline-wrap w-full">
      <h1 className="hero-tagline font-tagline italic font-normal tracking-tight text-ink text-center leading-[1.06] flex flex-nowrap items-baseline justify-center whitespace-nowrap gap-x-[0.26em]">
        {words.map((w, i) => <Word key={w.text} w={w} i={i} />)}
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
