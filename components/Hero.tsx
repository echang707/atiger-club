"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import HumanStripes from "./HumanStripes";
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
      className="relative min-h-[100svh] md:min-h-[100svh] w-full flex flex-col items-center justify-center px-5 sm:px-6 md:px-10 pt-24 pb-20 md:pt-32 md:pb-24 overflow-hidden"
    >
      {/* The stripes are people now. They walk in from the outer edges and
          assemble; the centre stays clear so the copy always sits on cream. */}
      <HumanStripes />


      <div className="max-w-4xl mx-auto w-full flex flex-col items-center relative z-10">
        <WordsFindEachOther closeness={closeness} />

        <div className="mt-6 md:mt-8 w-full max-w-2xl">
          <RotatingLine startDelayMs={2300} />
        </div>
      </div>
    </section>
  );
}
