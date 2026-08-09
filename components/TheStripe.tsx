"use client";

import { motion, useReducedMotion } from "framer-motion";

// A single tiger-stripe mark: a tapered, curved black shape (pointed at
// both ends, bulging in the middle — the actual silhouette of one stripe
// on a tiger's coat) with a narrower orange shape nested inside it, so
// the orange reads as the warm undercoat glowing through the middle of
// the black marking. Both paths share the same bend, just offset inward,
// so the black always reads as an even rim around the orange core.
const OUTER =
  "M6,22 C8,14 22,6 55,5 C95,4 140,8 175,16 C185,18 190,20 192,22 C189,25 178,28 160,30 C130,34 85,36 45,32 C22,30 8,29 6,22 Z";
const INNER =
  "M15,22 C17,16 28,10 56,9 C90,8 130,11 160,17 C167,19 171,20 173,22 C170,24 161,26 147,28 C121,31 84,32 50,29 C31,27 16,27 15,22 Z";

function StripeMark({ delay = 0 }: { delay?: number }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 200 40"
      aria-hidden="true"
      className="h-full w-full"
      initial={prefersReduced ? undefined : { opacity: 0, scale: 0.82, x: -10 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <path d={OUTER} fill="#15130E" opacity={0.68} />
      <path d={INNER} fill="#E2531C" opacity={0.55} />
    </motion.svg>
  );
}

// Where each mark sits down the page (percentage of total document
// height, so it works the same on a short page and a long one), which
// margin it hugs, and how big/rotated/mirrored it is. Kept close to the
// left/right edges of the content column on purpose — these are meant to
// live in the page's negative space, not run through paragraphs of text.
// A couple of larger, more central ones stand in for the old "swings
// fully across" section dividers, but far smaller than before.
const MARKS: {
  top: string;
  side: "left" | "right";
  inset: string;
  width: string;
  rotate: number;
  flip?: boolean;
  big?: boolean;
}[] = [
  { top: "4%", side: "left", inset: "-2%", width: "min(15vw, 150px)", rotate: -8 },
  { top: "13%", side: "right", inset: "-3%", width: "min(13vw, 130px)", rotate: 6, flip: true },
  { top: "24%", side: "left", inset: "0%", width: "min(11vw, 110px)", rotate: -3 },
  { top: "34%", side: "right", inset: "10%", width: "min(20vw, 210px)", rotate: 10, big: true },
  { top: "45%", side: "left", inset: "-2%", width: "min(14vw, 140px)", rotate: -12, flip: true },
  { top: "55%", side: "right", inset: "-2%", width: "min(12vw, 120px)", rotate: 4 },
  { top: "65%", side: "left", inset: "8%", width: "min(19vw, 200px)", rotate: -9, big: true, flip: true },
  { top: "76%", side: "right", inset: "-3%", width: "min(13vw, 130px)", rotate: 7 },
  { top: "86%", side: "left", inset: "-2%", width: "min(15vw, 150px)", rotate: -5, flip: true },
  { top: "95%", side: "right", inset: "0%", width: "min(11vw, 110px)", rotate: 8 },
];

// A handful of individual tiger-stripe marks scattered down the site —
// hugging the left margin, then the right, the way the old single line
// did, but now each one is its own tapered stripe shape rather than a
// continuous thread. They fade/settle into place once as they scroll
// into view (no more continuous scroll-scrubbed motion), so nothing is
// sweeping across the page while someone's mid-sentence reading an
// event listing. It's drawn at z-index:-1 inside the layout's `relative`
// wrapper, so it paints above the paper background but underneath every
// normal-flow piece of content — any photo, card, or text block simply
// sits in front of it.
export default function TheStripe() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ zIndex: -1 }}>
      {MARKS.map((m, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: m.top,
            width: m.width,
            aspectRatio: "5 / 1",
            [m.side]: m.inset,
            transform: `rotate(${m.rotate}deg)${m.flip ? " scaleX(-1)" : ""}`,
            opacity: m.big ? 1 : 0.9,
          } as React.CSSProperties}
        >
          <StripeMark delay={(i % 5) * 0.08} />
        </div>
      ))}
    </div>
  );
}
