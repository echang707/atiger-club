"use client";

import { useId, useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ---------------------------------------------------------------------
   The tail under "good relationships."

   Built as ONE continuous stroke. The earlier version animated the body,
   the stripes and the tip as three separate elements, which is why they
   came apart mid-animation: the stripes rendered at full length while
   the body was still drawing, so they read as loose black squares
   floating past the end of the orange, with a detached tip beyond them.

   How this one stays whole:

   • There is a single path shape, `D`. The orange body and the black
     stripes are the same geometry — the stripes are that identical path
     stroked in black with a dash pattern, so they sit ON the tail rather
     than being their own objects.

   • Both are wrapped in one clip path, and the *clip* is what animates:
     a rectangle whose right edge sweeps left → right. Nothing can ever
     appear beyond the drawn tip, because nothing outside the clip is
     rendered. Body and stripes are revealed by the same single
     animation, so they cannot drift apart.

   • The growth, the upward curl at the end and the flick are all done by
     morphing `d` itself through keyframes that share a command
     structure. The stroke is never split, so it stays one shape the
     whole way through.

   It settles to the last keyframe and stops. No loop.
   --------------------------------------------------------------------- */

// One shape, six states. Only the tail-end control points move: the body
// through the first three lifts the last ~18% upward as it finishes, then
// the flick raises the tip, overshoots slightly and settles.
const D = [
  "M6 18C70 24 142 23 206 19C234 17 262 15 292 13",
  "M6 18C70 24 142 23 206 18C234 16 262 12 292 8",
  "M6 18C70 24 142 23 206 17C234 14 262 8 292 0",
  "M6 18C70 24 142 23 206 16C234 12 262 2 292 -9",
  "M6 18C70 24 142 23 206 17C234 14 262 7 292 -1",
  "M6 18C70 24 142 23 206 17C234 13 262 3 292 -8",
];

const DELAY = 0.45;
const TOTAL = 2.05;
const REVEAL = 1.2;

export default function QuoteTail() {
  const id = useId().replace(/:/g, "");
  const clipId = `qt-${id}`;
  const ref = useRef<SVGSVGElement>(null);

  // The reveal rectangle lives inside <defs>, so it has no layout box and
  // an IntersectionObserver attached to it never fires — on mobile the
  // clip stayed at width 0 and the whole tail was invisible. The trigger
  // is therefore taken from the <svg> itself, which does have a box, and
  // every child animates from that one flag.
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // the whole shape morphs on one clock — draw, curl, flick, settle
  const morph = {
    initial: { d: D[0] },
    animate: inView ? { d: D } : { d: D[0] },
    transition: {
      duration: TOTAL,
      delay: DELAY,
      ease: "easeInOut" as const,
      times: [0, 0.34, 0.55, 0.72, 0.87, 1],
    },
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 34"
      preserveAspectRatio="none"
      ref={ref}
      className="absolute -bottom-[0.30em] sm:-bottom-[0.36em] left-0 h-[0.34em] sm:h-[0.28em] w-full overflow-visible"
      fill="none"
    >
      <defs>
        {/* the single reveal: one rectangle whose edge sweeps rightward.
            Everything inside is clipped to it, so the stripes can never
            outrun the body. */}
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <motion.rect
            x={-8}
            y={-40}
            height={120}
            initial={{ width: 0 }}
            animate={{ width: inView ? 320 : 0 }}
            transition={{ duration: REVEAL, delay: DELAY, ease: "easeOut" }}
          />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* body */}
        <motion.path
          {...morph}
          stroke="#D84A18"
          strokeWidth={4.2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* ONE black section, at the very end. A tiger tail's tip is the
            only solid black on it — the earlier dashed stripes read as
            several black sections, which is not what a tail looks like at
            this size. A single long dash sits at the far end of the same
            path, so the last stretch beside "relationships." is solid
            black and everything before it is clean orange. */}
        <motion.path
          {...morph}
          stroke="#15130E"
          strokeWidth={4.2}
          strokeLinecap="round"
          /* The gap must be LONGER than the whole path, or the pattern
             repeats and a second black section appears further back. The
             path is ~292 units, so a 40-unit dash placed at offset -252
             lands once, right at the tip. */
          /* NOTE: `vectorEffect: non-scaling-stroke` makes dash lengths
             SCREEN units, not viewBox units. The path is 290 user units
             but the svg is drawn ~1.92x wider, so it measures ~557px on
             screen — which is why an offset computed from 290 landed the
             black mid-tail. Gap is longer than the path so it cannot
             repeat. */
          strokeDasharray="44 2400"
          strokeDashoffset={-515}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}
