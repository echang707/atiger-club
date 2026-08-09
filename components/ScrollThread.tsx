"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";

// A single hairline mark that lives at the edge of the viewport for the
// whole page. Near the top it reads as a few disconnected, faintly
// irregular strokes — separate. As the page is scrolled, those strokes
// fade out and one unbroken organic line settles in — together. It's
// tied to overall scroll progress, not any one section, so it's the
// quiet thread that runs behind everything else.
export default function ScrollThread() {
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.3 });

  const togetherness = useTransform(smooth, [0, 0.85], [0, 1]);
  const dashesOpacity = useTransform(togetherness, [0, 1], [0.22, 0]);
  const lineOpacity = useTransform(togetherness, [0, 1], [0, 0.32]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const dashOpacityStyle = prefersReduced ? 0.16 : dashesOpacity;
  const lineOpacityStyle = prefersReduced ? 0 : lineOpacity;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-[14px] md:right-[22px] top-0 h-screen w-[10px] z-40 hidden sm:block"
    >
      <svg viewBox="0 0 10 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        {/* Separate state: three short, faintly irregular dashes */}
        <motion.path
          d="M5 6 C 6 12, 4 16, 5 22"
          stroke="#15130E"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          style={{ opacity: dashOpacityStyle }}
        />
        <motion.path
          d="M5 34 C 4 42, 6 48, 5 56"
          stroke="#15130E"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          style={{ opacity: dashOpacityStyle }}
        />
        <motion.path
          d="M5 68 C 6 76, 4 82, 5 90"
          stroke="#15130E"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          style={{ opacity: dashOpacityStyle }}
        />

        {/* Together state: one continuous, softly organic line */}
        <motion.path
          d="M5 4 C 3 20, 7 34, 5 50 C 3 66, 7 80, 5 96"
          stroke="#E2531C"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          style={{ opacity: lineOpacityStyle }}
        />
      </svg>
    </div>
  );
}
