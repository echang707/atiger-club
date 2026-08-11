"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
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
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center px-6 md:px-10 pt-28 pb-20 md:pt-32 md:pb-24 overflow-hidden"
    >
      {/* The marble at full strength, and only here (plus the closing
          section). The crop is measured, not eyeballed: the artwork was
          gridded for ink coverage, and at this size/position the tagline
          sits on the image's own cream negative space — under 1% ink —
          while the heavy markings stay parked in the top-left corner,
          down the right edge and along the bottom. That is why there is
          no cream blob behind the type any more. It was never needed;
          the image just wasn't positioned. */}
      <div aria-hidden="true" className="marble-field" />

      {/* Pattern thins into the cream page below. The image's cream is
          colour-matched to #F4E9D6, so this reads as the material running
          out rather than as a seam between two panels. */}
      {/* Keeps the black wordmark legible where it overlaps the artwork's
          densest corner. Anchored to that corner and dissolved before the
          centre, so the nav still reads as part of the hero. */}
      <div aria-hidden="true" className="hero-nav-readability" />

      <div aria-hidden="true" className="marble-fade-bottom" />

      <div className="max-w-4xl mx-auto w-full flex flex-col items-center relative z-10">
        <WordsFindEachOther closeness={closeness} />

        <div className="mt-6 md:mt-8 w-full max-w-2xl">
          <RotatingLine startDelayMs={2300} />
        </div>
      </div>
    </section>
  );
}
