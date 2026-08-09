"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

// One jagged black stripe runs the full height of the site, revealing
// itself as you scroll — the same "editorial rule that's secretly a
// tiger marking" idea as before, but redrawn with sharp, angular turns
// (straight L segments, not smooth curves) so it actually reads as a
// tiger stripe rather than a wavy thread, with short pointed spikes
// jutting off it here and there, the way real stripe edges fray. A wide,
// blurred orange stroke sits behind the black so orange visibly glows
// around it, same as a tiger's coat.
//
// It's drawn at z-index:-1 inside a `position: relative` wrapper, so it
// paints above the page background but *underneath* every piece of
// normal content — text included. That's intentional (it's what makes
// the moving line feel like it's cutting through the page as you
// scroll), but it means running text needs its own opaque backdrop
// (the `.text-shield` utility in globals.css) wherever it might cross —
// that's handled at the text level, not here.
const D = `
  M35.6,0 L47.5,16.7 L49.7,32.9 L52.4,48.8 L55.3,59 L57.9,75.4 L60.4,87.9
  L65.1,105.7 L61,123 L64.8,133.9 L63.1,150.7 L65,164.2 L70,178.2
  L71.4,188.3 L72,204.5 L70.5,220.4 L74.3,237.9 L80,249.1 L77.7,260.5
  L77.2,276.7 L83.8,286.8 L83.8,298.1 L81.2,315.8 L78.6,331.1 L81.2,341.5
  L86.6,357.8 L85.2,370.8 L89,381.9 L84.7,396.8 L85.5,411.1 L85.7,427.6
  L89.4,443.8 L87.3,457.5 L86.3,469.9 L81.5,484.5 L77.8,498.4 L80.2,508.6
  L78.9,521.5 L75.7,539.4 L76.9,551.8 L78.2,565.8 L73.7,577.2 L77.3,591
  L74.6,603.2 L73.1,617.4 L75.2,634.2 L68.4,644.5 L68,656.8 L63.4,672.9
  L60.4,684 L61.5,700.8 L63.5,715.3 L60.4,732.7 L60.3,746.5 L53.6,761
  L56,776.3 L54.3,790.7 L52.5,801.5 L47.7,817.3 L47.3,830.5 L45.5,844.9
  L42.3,858.4 L35,871.1 L35.2,882.5 L35.2,893.8 L28.5,909.6 L27.7,922.7
  L30.8,934.2 L22.8,951.4 L24.6,965 L23.5,982.5 L19.3,993.3
`;

// Short pointed spikes jutting off the main line at a handful of points
// along its length — the "fraying edge" detail that makes it read as a
// tiger stripe rather than a single clean rule.
const SPIKES = [
  { x1: 55.3, y1: 59, x2: 43.5, y2: 51.7 },
  { x1: 71.4, y1: 188.3, x2: 63.3, y2: 181.3 },
  { x1: 72, y1: 204.5, x2: 86.2, y2: 199.9 },
  { x1: 70.5, y1: 220.4, x2: 55.2, y2: 216 },
  { x1: 86.6, y1: 357.8, x2: 78.1, y2: 351.1 },
  { x1: 89, y1: 381.9, x2: 96.7, y2: 377 },
  { x1: 84.7, y1: 396.8, x2: 71.7, y2: 389.9 },
  { x1: 85.5, y1: 411.1, x2: 69.8, y2: 406.2 },
  { x1: 85.7, y1: 427.6, x2: 95.6, y2: 421.5 },
  { x1: 86.3, y1: 469.9, x2: 95.5, y2: 464.9 },
  { x1: 81.5, y1: 484.5, x2: 72.7, y2: 479.8 },
  { x1: 77.8, y1: 498.4, x2: 88, y2: 494.2 },
  { x1: 76.9, y1: 551.8, x2: 70.2, y2: 546.3 },
  { x1: 78.2, y1: 565.8, x2: 69, y2: 562.8 },
  { x1: 73.7, y1: 577.2, x2: 87.7, y2: 569.4 },
  { x1: 74.6, y1: 603.2, x2: 66.1, y2: 598.2 },
  { x1: 68, y1: 656.8, x2: 61.3, y2: 651.9 },
  { x1: 60.4, y1: 684, x2: 68.3, y2: 680.1 },
  { x1: 61.5, y1: 700.8, x2: 68.2, y2: 694.3 },
  { x1: 52.5, y1: 801.5, x2: 43.7, y2: 793.8 },
  { x1: 47.7, y1: 817.3, x2: 36.6, y2: 811.9 },
  { x1: 47.3, y1: 830.5, x2: 38.6, y2: 825.8 },
  { x1: 42.3, y1: 858.4, x2: 33.6, y2: 855 },
  { x1: 35.2, y1: 893.8, x2: 23.2, y2: 887.3 },
  { x1: 28.5, y1: 909.6, x2: 41.4, y2: 903.7 },
  { x1: 22.8, y1: 951.4, x2: 14.9, y2: 948.1 },
];

export default function TheStripe() {
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useReducedMotion();

  // A little gentler than a raw scroll hookup (higher damping, lower
  // stiffness) so the reveal still tracks scroll closely but doesn't
  // feel jumpy or "too overboard" the way a stiffer spring did before.
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 45, damping: 26, mass: 0.3 });

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: -1 }}
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Soft blur so the orange reads as a glow bleeding out from the
            black stripe's edge, like light catching a tiger's ginger
            undercoat around a black guard-hair band. */}
        <filter id="stripeGlow" x="-80%" y="-5%" width="260%" height="110%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* Orange glow — wide, blurred, sits behind the black so it reads
          as an orange halo around the whole stripe. */}
      <motion.path
        d={D}
        fill="none"
        stroke="#E2531C"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        filter="url(#stripeGlow)"
        opacity={0.55}
        style={prefersReduced ? undefined : { pathLength }}
        initial={false}
      />

      {/* The black stripe itself — thick, with sharp miter joins at every
          turn so the angular path reads as jagged rather than smooth. */}
      <motion.path
        d={D}
        fill="none"
        stroke="#15130E"
        strokeWidth="3.4"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={3}
        vectorEffect="non-scaling-stroke"
        opacity={0.85}
        style={prefersReduced ? undefined : { pathLength }}
        initial={false}
      />

      {/* Fraying spikes — short jagged points off the main line. */}
      {SPIKES.map((s, i) => (
        <motion.line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke="#15130E"
          strokeWidth="2.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={0.75}
          style={prefersReduced ? undefined : { pathLength }}
          initial={false}
        />
      ))}
    </svg>
  );
}
