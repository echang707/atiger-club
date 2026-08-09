"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

// A handful of thin, organic, slightly irregular strokes placed around
// the hero. On their own they read as editorial line marks — nothing
// tiger about them. Tied to `progress` (hero scroll progress, 0→1),
// they drift a small, unhurried amount toward the center as the page
// begins to move, echoing the words above pulling together. Never more
// than a few px of motion — this should feel almost subliminal.
type Stroke = {
  d: string;
  top: string;
  left: string;
  width: number;
  rotate: number;
  opacity: number;
  driftX: number;
  driftY: number;
  color: string;
};

const strokes: Stroke[] = [
  {
    d: "M2,30 C10,18 14,10 4,0",
    top: "8%",
    left: "6%",
    width: 34,
    rotate: -8,
    opacity: 0.22,
    driftX: 10,
    driftY: 4,
    color: "#15130E",
  },
  {
    d: "M2,0 C-6,14 -2,24 8,34",
    top: "14%",
    left: "88%",
    width: 30,
    rotate: 6,
    opacity: 0.2,
    driftX: -12,
    driftY: 6,
    color: "#E2531C",
  },
  {
    d: "M0,4 C12,0 22,8 34,2",
    top: "78%",
    left: "10%",
    width: 40,
    rotate: 4,
    opacity: 0.16,
    driftX: 8,
    driftY: -6,
    color: "#15130E",
  },
  {
    d: "M0,2 C14,8 24,0 36,6",
    top: "82%",
    left: "82%",
    width: 42,
    rotate: -5,
    opacity: 0.18,
    driftX: -9,
    driftY: -5,
    color: "#E2531C",
  },
  {
    d: "M0,20 C8,8 6,30 16,18",
    top: "45%",
    left: "3%",
    width: 20,
    rotate: 2,
    opacity: 0.14,
    driftX: 6,
    driftY: 2,
    color: "#15130E",
  },
];

function StrokeMark({ s, progress }: { s: Stroke; progress: MotionValue<number> }) {
  const x = useTransform(progress, [0, 1], [0, s.driftX]);
  const y = useTransform(progress, [0, 1], [0, s.driftY]);
  const opacity = useTransform(progress, [0, 1], [s.opacity, s.opacity * 1.6]);

  return (
    <motion.svg
      viewBox="0 0 40 40"
      style={{
        position: "absolute",
        top: s.top,
        left: s.left,
        width: s.width,
        height: s.width,
        rotate: s.rotate,
        x,
        y,
        opacity,
      }}
      aria-hidden="true"
    >
      <path d={s.d} stroke={s.color} strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </motion.svg>
  );
}

export default function StripeField({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {strokes.map((s, i) => (
        <StrokeMark key={i} s={s} progress={progress} />
      ))}
    </div>
  );
}
