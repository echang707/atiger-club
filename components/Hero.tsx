"use client";

import HeroBackdrop from "./HeroBackdrop";
import RotatingLine from "./RotatingLine";
import WordsFindEachOther from "./WordsFindEachOther";

export default function Hero() {
  return (
    <section className="hero-shell relative w-full">
      {/* One static illustration, sized to cover the hero. */}
      <HeroBackdrop />

      {/* Centred in the viewport AND in the artwork's clear middle — the
          hero is exactly one screen and both illustrations leave their
          open cream in the centre, so one position satisfies both. */}
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
