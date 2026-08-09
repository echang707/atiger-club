"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

// One single, thin, irregular line runs the full height of the site —
// hugging the left margin, then the right, swinging fully across at a
// few points to read as a section divider before continuing down. It's
// drawn at z-index:-1 inside a `position: relative` wrapper, so it
// paints above the plain paper background but *underneath* every piece
// of normal content — meaning any photo, card, or opaque panel it
// passes behind will simply hide it for that stretch, with no per-image
// bookkeeping required. It only ever shows in the page's own negative
// space. A tiger stripe, mostly disguised as an editorial rule.
//
// The path is authored in a tall, fixed viewBox and stretched to fill
// the wrapper's real rendered height via preserveAspectRatio="none" —
// vector-effect="non-scaling-stroke" keeps the line's weight constant
// even though the vertical scale is arbitrary.
const D = `
  M6,0
  C3,25 8,45 5,60
  C2,80 8,110 7,140
  C9,155 10,165 10,175
  C25,180 55,188 92,200
  C91,225 94,255 90,262
  C92,290 95,315 93,330
  C91,360 87,385 89,400
  C89,412 90,422 90,430
  C70,435 40,442 8,455
  C6,470 7,495 6,520
  C4,550 11,575 9,600
  C7,630 3,655 5,680
  C5,690 6,698 6,705
  C30,712 60,720 92,730
  C91,750 89,765 90,780
  C92,805 94,825 93,840
  C92,848 91,855 90,860
  C65,865 35,872 10,882
  C8,895 9,908 8,920
  C7,935 11,948 10,960
  C8,975 6,988 7,1000
`;

export default function TheStripe() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.3 });

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: -1 }}
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Soft blur so the orange reads as a hue bleeding out from the
            stripe's edge, the way light catches the ginger base of a
            tiger's fur around a black guard-hair band — not a hard
            second color. */}
        <filter id="stripeGlow" x="-60%" y="-5%" width="220%" height="110%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>

      {/* Orange undercoat — wide, blurred, low-opacity. Sits behind the
          black line so only its edges peek out. */}
      <motion.path
        d={D}
        fill="none"
        stroke="#E2531C"
        strokeWidth="3.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        filter="url(#stripeGlow)"
        opacity={0.38}
        style={prefersReduced ? undefined : { pathLength }}
        initial={false}
      />

      {/* The black stripe itself — the actual tiger marking. */}
      <motion.path
        d={D}
        fill="none"
        stroke="#15130E"
        strokeWidth="1.3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.62}
        style={prefersReduced ? undefined : { pathLength }}
        initial={false}
      />

      {/* A hair-thin taper riding just off the black line's edge — like a
          single stray strand catching the orange underneath. */}
      <motion.path
        d={D}
        fill="none"
        stroke="#F0A15F"
        strokeWidth="0.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        transform="translate(0.9, 0)"
        opacity={0.3}
        style={prefersReduced ? undefined : { pathLength }}
        initial={false}
      />
    </svg>
  );
}
