"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RotatingLine from "./RotatingLine";
import WordsFindEachOther from "./WordsFindEachOther";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // 0 at the top of the hero, 1 by the time it's scrolled mostly out of
  // view — nudges the words in "life is better together" a few px
  // closer together as the page begins to move. Smooth, subconscious.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const closeness = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] w-full flex flex-col items-center justify-center px-6 md:px-10 py-28 overflow-hidden"
    >
      {/* Quiet zone: keeps the marble calm behind the tagline + rotating
          line (and the transparent nav sitting on top of this section)
          without ever touching the section's own edges, so the pattern
          stays rich right up to the corners. */}
      <div
        aria-hidden="true"
        className="quiet-zone absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[130%] sm:w-[105%] md:w-[92%] h-[85%] md:h-[78%]"
      />

      <div className="max-w-xl mx-auto w-full flex flex-col items-center relative z-10">
        <WordsFindEachOther closeness={closeness} />

        <div className="mt-8 md:mt-10 w-full max-w-lg">
          <RotatingLine startDelayMs={2300} />
        </div>
      </div>
    </section>
  );
}
