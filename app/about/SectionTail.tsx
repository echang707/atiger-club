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
const PATH =
  "M192 -30C168 54 104 96 92 190c-12 94 78 128 84 226 6 98-72 118-78 206-6 88 46 128 58 210 12 82-40 118-52 198";

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
          {/* body */}
          <motion.path
            d={PATH}
            stroke="#D84A18"
            strokeWidth={3.4}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.8 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* a few sparse stripes, faded in once the body has drawn */}
          <motion.path
            d={PATH}
            stroke="#15130E"
            strokeWidth={3.4}
            strokeLinecap="butt"
            strokeDasharray="7 104"
            strokeDashoffset={-40}
            vectorEffect="non-scaling-stroke"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, delay: 1.5, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
