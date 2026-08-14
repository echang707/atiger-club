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
    <section className="hero-shell relative w-full">
      {/* FULL artwork. The hero's height is the artwork's own height at
          100% width, so nothing is cropped on any side. */}
      <HumanStripes />

      {/* Viewport-sized overlay, exactly one screen tall, in normal flow
          (not sticky) — it scrolls away with the hero instead of staying
          pinned/recentring. Its position is derived from the viewport,
          never from the image's own dimensions. */}
      <div className="hero-content relative z-10 flex w-full flex-col items-center justify-center px-5 sm:px-6 md:px-10">
        <div className="hero-tagline-wrap mx-auto w-full max-w-4xl flex flex-col items-center">
          <WordsFindEachOther closeness={closeness} />
          <div className="mt-9 md:mt-8 w-full max-w-2xl">
            <RotatingLine startDelayMs={2300} />
          </div>
        </div>
      </div>
    </section>
  );
}
