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
          {/* No margin here: the gap is owned solely by `.hero-subline`'s
              own margin-top, so there is one place to tune it. This
              wrapper used to add mt-9/mt-8 on top of that, which is why
              the two lines drifted so far apart. */}
          <div className="w-full max-w-2xl">
            <RotatingLine />
          </div>
        </div>
      </div>
    </section>
  );
}
