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
      // ARCHITECTURE: two independent layers.
      //
      // The section is sized by the VIEWPORT (100svh), never by the
      // artwork. The background sits behind it, absolutely positioned and
      // free to crop however it likes at any aspect ratio. The content
      // layer centres itself in the viewport, so the headline stays
      // visually centred no matter how the picture crops.
      //
      // The previous version derived the hero's height from the artwork's
      // aspect ratio, which meant every change of window shape moved the
      // copy. Nothing here reads a dimension off the image.
      className="relative w-full overflow-hidden hero-shell"
    >
      {/* The stripes are people now. They walk in from the outer edges and
          assemble; the centre stays clear so the copy always sits on cream. */}
      <HumanStripes />


      <div
        // Sized by the viewport, never by the artwork. Height and the nav
        // offset are mobile-specific (see .hero-content in globals.css).
        className="hero-content relative z-10 flex w-full flex-col items-center justify-center px-5 sm:px-6 md:px-10"
      >
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center relative z-10">
        <WordsFindEachOther closeness={closeness} />

        <div className="mt-9 md:mt-8 w-full max-w-2xl">
          <RotatingLine startDelayMs={2300} />
        </div>
      </div>
      </div>
    </section>
  );
}
