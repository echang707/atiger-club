"use client";

import { motion } from "framer-motion";

/* ---------------------------------------------------------------------
   A single thin line living in the right-hand whitespace of each
   principle row.

   These replaced a set of oversized graphics (arrow, circles, numeral,
   star) that read as icons. These are deliberately almost nothing: one
   hairline stroke each, low contrast, no fill, no shape, no text. The
   whitespace is the point — the line is a gesture inside it, not a
   thing filling it.

   Each one behaves in a way that answers its principle:

     01  a line extends inward, toward the claim
     02  two lines approach from opposite sides and meet
     03  a line travels straight, then takes one small unexpected kink
     04  a line travels across and arrives at a small orange dot

   All draw once when the row enters view, and again on hover of the row
   (the parent carries `group`). Nothing loops.
   --------------------------------------------------------------------- */

const STROKE = "currentColor";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function PrincipleLine({
  kind,
}: {
  kind: "01" | "02" | "03" | "04";
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] select-none text-ink/30 md:block"
    >
      <svg
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
        className="absolute left-0 top-1/2 h-[60px] w-full -translate-y-1/2 overflow-visible"
        fill="none"
      >
        {kind === "01" && <ExtendIn />}
        {kind === "02" && <Meet />}
        {kind === "03" && <Kink />}
        {kind === "04" && <Arrive />}
      </svg>
    </div>
  );
}

const draw = (delay = 0, duration = 1.1) => ({
  initial: { pathLength: 0 },
  whileInView: { pathLength: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration, delay, ease: EASE },
});

/* 01 — extends inward, so it grows from the right edge back toward the text. */
function ExtendIn() {
  return (
    <motion.path
      d="M396 30 L40 30"
      stroke={STROKE}
      strokeWidth={1.25}
      strokeLinecap="round"
      {...draw(0.05)}
    />
  );
}

/* 02 — two lines close the gap between them and meet in the middle. */
function Meet() {
  return (
    <>
      <motion.path
        d="M10 30 L199.4 30"
        stroke={STROKE}
        strokeWidth={1.25}
        strokeLinecap="round"
        {...draw(0.05, 1)}
      />
      <motion.path
        d="M390 30 L200.6 30"
        stroke={STROKE}
        strokeWidth={1.25}
        strokeLinecap="round"
        {...draw(0.05, 1)}
      />
    </>
  );
}

/* 03 — travels straight, then one small kink it didn't need to make. */
function Kink() {
  return (
    <motion.path
      d="M10 34 L212 34 L246 14 L268 40 L390 34"
      stroke={STROKE}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...draw(0.05, 1.25)}
    />
  );
}

/* 04 — travels across and arrives at a small orange dot. */
function Arrive() {
  return (
    <>
      <motion.path
        d="M10 30 L372 30"
        stroke={STROKE}
        strokeWidth={1.25}
        strokeLinecap="round"
        {...draw(0.05, 1.05)}
      />
      <motion.circle
        cx={382}
        cy={30}
        r={3.2}
        className="fill-tiger"
        initial={{ opacity: 0, scale: 0.4 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.35, delay: 1.05, ease: "easeOut" }}
        style={{ transformOrigin: "382px 30px" }}
      />
    </>
  );
}
