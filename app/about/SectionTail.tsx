"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ---------------------------------------------------------------------
   One tail for the whole principles section.

   The four per-row hairlines are gone. This is a single continuous line
   that wanders down the right-hand side across all four rows — as if a
   tail had drifted into the layout from off-screen rather than a graphic
   being assigned to each principle.

   Deliberately NOT aligned to the rows: the curve changes direction on
   its own rhythm and crosses the gaps between rows wherever it happens
   to. It lives inside the right ~30% of the section and never reaches
   the text column.

   `vector-effect="non-scaling-stroke"` keeps the line the same weight
   however the viewBox is stretched to the section's height, so it stays
   thin and elegant on a short viewport and a tall one alike.

   Motion is a slight parallax drift as you scroll past — no loop, no wag.
   --------------------------------------------------------------------- */

// enters top-right off-screen, wanders down, leaves bottom-right
// Uneven on purpose — the swings differ in width and length so it reads
// as something that wandered in, not a repeating wave or a chart axis.
/* Spans the full viewBox height with an even rhythm. The old path packed
   five swings into the same space; once the section got shorter the
   `preserveAspectRatio="none"` squeeze bunched them together and the line
   read as a scribble that stopped mid-page. */
const PATH =
  "M186 -40C150 90 96 150 96 280c0 130 84 170 84 300 0 130-84 170-84 300 0 120 60 170 84 200";

export default function SectionTail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // a few px of drift and a degree of sway across the whole scroll — enough
  // to feel loose, not enough to read as an animation
  const y = useTransform(scrollYProgress, [0, 1], [26, -26]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-1.2, 1.2]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[30%] select-none md:block"
    >
      <motion.div style={{ y, rotate }} className="h-full w-full">
        <svg
          viewBox="0 0 220 1000"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
          fill="none"
        >
          <defs>
            {/* one sweep for both layers: the stripes are revealed by the
                same rectangle that reveals the body, so they can never
                float ahead of it as detached dashes */}
            <clipPath id="tc-tail-sweep" clipPathUnits="objectBoundingBox">
              <motion.rect
                x={-0.5}
                y={-0.2}
                width={2}
                initial={{ height: 0 }}
                whileInView={{ height: 1.6 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 1.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </clipPath>
          </defs>

          <g clipPath="url(#tc-tail-sweep)">
            {/* body */}
            <path
              d={PATH}
              stroke="#D84A18"
              strokeWidth={3.4}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.8}
            />
            {/* sparse stripes, painted onto the same line */}
            <path
              d={PATH}
              stroke="#15130E"
              strokeWidth={3.4}
              strokeLinecap="butt"
              strokeDasharray="7 104"
              strokeDashoffset={-40}
              vectorEffect="non-scaling-stroke"
              opacity={0.8}
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
