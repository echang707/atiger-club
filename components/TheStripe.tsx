"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

// One black stripe runs the full height of the site, revealing itself as
// you scroll — an editorial rule that's secretly a tiger marking. It's a
// single smooth, continuous curve (no forked "fraying" spikes — those
// animated on their own pathLength tied to the *same* global scroll
// value, so dozens of short segments all partially drew at once and
// read as scattered dots rather than a line). The orange is a crisp,
// tightly-fitted outline traced along the exact same path — not a
// blurred halo — so it reads as a thin rind of color hugging the black,
// the way a tiger's black guard-stripe sits right against its coat.
//
// It's drawn at z-index:-1 inside a `position: relative` wrapper, so it
// paints above the page background but *underneath* every piece of
// normal content — text included. That's intentional (it's what makes
// the moving line feel like it's cutting through the page as you
// scroll), but it means running text needs its own opaque backdrop
// (the `.text-shield` utility in globals.css) wherever it might cross —
// that's handled at the text level, not here.
const D = `
  M35.6,0 C42,20 46,32 47.5,48 C49,64 50.5,78 55.3,95
  C60,112 63.5,120 61,138 C58.5,156 63,168 65,182
  C67,196 71.4,204 72,220 C72.6,236 70.5,246 74.3,262
  C78,278 80,286 77.2,302 C74.4,318 82,308 83.8,324
  C85.6,340 80,332 78.6,347 C77.2,362 84,354 86.6,369
  C89.2,384 87,392 84.7,408 C82.4,424 87,420 85.7,436
  C84.4,452 89,448 87.3,463 C85.6,478 79,472 81.5,488
  C84,504 82,500 78.9,517 C75.8,534 79,540 78.2,557
  C77.4,574 71,568 74.6,585 C78.2,602 71,600 68.4,616
  C65.8,632 66,644 60.4,660 C54.8,676 65,684 63.5,701
  C62,718 58,724 56,741 C54,758 58,766 52.5,783
  C47,800 49,812 45.5,829 C42,846 38,852 35.2,868
  C32.4,884 32,890 28.5,906 C25,922 32,928 30.8,942
  C29.6,956 21,960 19.3,976
`;

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
      {/* Orange outline — a slightly wider crisp stroke sitting directly
          behind the black, same path, no blur. It peeks out as a thin,
          tightly-fitted rind of color rather than a diffuse glow. */}
      <motion.path
        d={D}
        fill="none"
        stroke="#E2531C"
        strokeWidth="6.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={prefersReduced ? undefined : { pathLength }}
        initial={false}
      />

      {/* The black stripe itself — smooth, continuous, sits on top of
          the orange outline. */}
      <motion.path
        d={D}
        fill="none"
        stroke="#15130E"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={prefersReduced ? undefined : { pathLength }}
        initial={false}
      />
    </svg>
  );
}
