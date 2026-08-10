"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

// On first load each word sits off its resting spot — scattered, tiny,
// and soft-focus, like it's drifting in from somewhere else — then
// quickly drifts and comes into focus until they all settle into
// "life is better together." Once settled, `closeness` (driven by
// scroll, passed down from Hero) nudges each word a few px toward the
// center of the line — separate things finishing the job of becoming
// one line as the page begins to move. The entrance animation and the
// scroll nudge live on separate nested elements so their transforms
// don't fight over the same "x" channel.
const words: { text: string; from: { x: number; y: number; rotate: number }; nudge: number }[] = [
  { text: "life", from: { x: -120, y: -60, rotate: -10 }, nudge: 7 },
  { text: "is", from: { x: 46, y: 88, rotate: 12 }, nudge: 3 },
  { text: "better", from: { x: 78, y: -74, rotate: -9 }, nudge: -3 },
  { text: "together.", from: { x: 132, y: 92, rotate: 10 }, nudge: -7 },
];

function Word({
  w,
  i,
  closeness,
}: {
  w: (typeof words)[number];
  i: number;
  closeness: MotionValue<number>;
}) {
  const nudgeX = useTransform(closeness, [0, 1], [0, w.nudge]);

  return (
    <motion.span
      initial={{ opacity: 0, x: w.from.x, y: w.from.y, rotate: w.from.rotate, scale: 0.82, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
      transition={{
        duration: 1.9,
        delay: 0.15 + i * 0.11,
        ease: [0.11, 0.6, 0.15, 1],
      }}
      className="inline-block"
    >
      <motion.span className="inline-block text-shield" style={{ x: nudgeX }}>
        {w.text}
      </motion.span>
    </motion.span>
  );
}

export default function WordsFindEachOther({ closeness }: { closeness: MotionValue<number> }) {
  return (
    <h1 className="font-tagline italic font-normal text-4xl sm:text-5xl md:text-6xl tracking-tight text-ink text-center leading-[1.1] flex flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-1">
      {words.map((w, i) => (
        <Word key={w.text} w={w} i={i} closeness={closeness} />
      ))}
    </h1>
  );
}
