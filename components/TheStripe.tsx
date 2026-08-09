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
  C1,9 14,16 3,26
  C-2,33 13,40 2,50
  C-3,58 12,66 4,76
  C-2,84 13,92 3,102
  C-3,110 11,118 5,128
  C-1,136 12,144 3,152
  C-2,160 10,167 10,175
  C25,180 55,188 92,200
  C86,207 97,214 88,224
  C93,232 84,240 92,250
  C97,258 85,266 90,276
  C95,284 83,292 91,302
  C96,310 84,318 90,328
  C95,336 83,344 91,354
  C96,362 84,370 89,380
  C93,388 85,396 90,406
  C93,414 87,423 90,430
  C70,435 40,442 8,455
  C3,462 13,469 4,478
  C-2,486 12,493 3,502
  C-3,510 11,518 5,527
  C-1,535 12,543 3,551
  C-2,559 10,566 4,575
  C-2,583 12,590 3,598
  C-3,606 10,614 5,623
  C-1,631 11,639 3,647
  C-2,655 10,663 4,672
  C-1,680 9,688 5,696
  C3,701 6,703 6,705
  C30,712 60,720 92,730
  C86,738 97,745 88,755
  C93,763 84,771 92,781
  C97,789 85,797 90,807
  C95,815 83,823 91,833
  C93,838 89,839 90,840
  C93,847 87,854 90,860
  C65,865 35,872 10,882
  C4,889 14,896 5,905
  C-1,913 12,920 4,929
  C-2,937 11,945 5,954
  C-1,962 10,969 4,978
  C0,986 9,993 6,1000
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
