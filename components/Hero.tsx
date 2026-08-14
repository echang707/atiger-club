"use client";

import HumanStripes from "./HumanStripes";
import RotatingLine from "./RotatingLine";
import WordsFindEachOther from "./WordsFindEachOther";

export default function Hero() {
  return (
    <section className="hero-shell relative w-full">
      {/* FULL artwork. The hero's height is the artwork's own height at
          100% width, so nothing is cropped on any side. */}
      <HumanStripes />

      {/* Positioned ONCE within the hero, at a fixed spot chosen to sit in
          the artwork's own clean cream gap. Not sticky, not tied to the
          viewport, no scroll listener of any kind — it scrolls with the
          page exactly like the artwork behind it, at a fixed distance
          from the top of the hero. */}
      <div className="hero-content absolute left-1/2 top-[var(--hero-content-top)] z-10 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center px-5 sm:px-6 md:px-10">
        <div className="hero-tagline-wrap mx-auto w-full max-w-4xl flex flex-col items-center">
          <WordsFindEachOther />
          <div className="mt-9 md:mt-8 w-full max-w-2xl">
            <RotatingLine startDelayMs={2300} />
          </div>
        </div>
      </div>
    </section>
  );
}
