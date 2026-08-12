"use client";

import { motion } from "framer-motion";

/* ---------------------------------------------------------------------
   The tail under "good relationships."

   The previous version revealed a fixed path, which is why it still read
   as a striped underline. Three things change that here:

   1. The path `d` itself is animated through four shapes while it draws,
      so the curve keeps shifting as it grows instead of a static shape
      being uncovered. The last two shapes lift the far end, so the
      upward curl only appears near the end of the draw.
   2. The tip is a separate, thinner stroke that continues past the body
      and ends with a round cap — a stepped taper, since SVG strokes
      cannot taper on their own.
   3. Once fully extended the tip group makes one small flick: up,
      slight overshoot, then settles. It pivots from where the tip meets
      the body, so the body stays put and only the end moves.

   After that it is completely still. Nothing loops.
   --------------------------------------------------------------------- */

// four states of the same curve — identical command structure so they can
// be interpolated. The end lifts progressively in the last two.
const BODY = [
  "M6 17C70 23 142 22 206 17c28-2.2 54-4.6 78-7.4",
  "M6 17C70 23 142 22 206 16c28-2.6 54-5.6 78-9.6",
  "M6 17C70 23 142 22 206 15c28-3.4 54-8 78-15",
  "M6 17C70 23 142 22 206 14.6c28-3.8 54-9.6 78-18.5",
];

const TIP = [
  "M278 10.4c6-1 11-2.2 16-3.6",
  "M278 8.6c6-1.4 11-3 16-5.2",
  "M278 4.2c6-2.2 11-4.8 16-8.2",
  "M278 2.4c6-2.6 11-6 16-10.4",
];

const DRAW = 1.25;
const START = 0.45;

export default function QuoteTail() {
  const inView = { once: true, margin: "-90px" } as const;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 30"
      preserveAspectRatio="none"
      className="absolute -bottom-[0.34em] left-0 h-[0.26em] w-full overflow-visible"
      fill="none"
    >
      {/* body — draws left to right, curve shifting as it goes */}
      <motion.path
        stroke="#D84A18"
        strokeWidth={4.2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, d: BODY[0] }}
        whileInView={{ pathLength: 1, d: BODY }}
        viewport={inView}
        transition={{
          pathLength: { duration: DRAW, delay: START, ease: "easeOut" },
          d: { duration: DRAW, delay: START, ease: "easeInOut", times: [0, 0.5, 0.82, 1] },
        }}
      />

      {/* sparse stripes — faded in after the body lands, never animated with
          pathLength (framer writes its own dasharray for that and would
          overwrite the pattern) */}
      <motion.path
        d={BODY[3]}
        stroke="#15130E"
        strokeWidth={4.2}
        strokeLinecap="butt"
        strokeDasharray="4 52"
        strokeDashoffset={-64}
        vectorEffect="non-scaling-stroke"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={inView}
        transition={{ duration: 0.4, delay: START + DRAW * 0.8, ease: "easeOut" }}
      />

      {/* tip — thinner, so the silhouette tapers, and it flicks once */}
      <motion.g
        style={{ transformOrigin: "278px 6px" }}
        initial={{ rotate: 0 }}
        whileInView={{ rotate: [0, 0, -13, 4.5, -1.4, 0] }}
        viewport={inView}
        transition={{
          duration: 1.5,
          delay: START + DRAW - 0.1,
          times: [0, 0.18, 0.42, 0.66, 0.85, 1],
          ease: "easeOut",
        }}
      >
        <motion.path
          stroke="#15130E"
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, d: TIP[0] }}
          whileInView={{ pathLength: 1, d: TIP }}
          viewport={inView}
          transition={{
            pathLength: { duration: DRAW * 0.34, delay: START + DRAW * 0.7, ease: "easeOut" },
            d: { duration: DRAW, delay: START, ease: "easeInOut", times: [0, 0.5, 0.82, 1] },
          }}
        />
      </motion.g>
    </svg>
  );
}
