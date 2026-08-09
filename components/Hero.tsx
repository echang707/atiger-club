"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RotatingLine from "./RotatingLine";
import WordsFindEachOther from "./WordsFindEachOther";
import ClawMark from "./ClawMark";

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
      <div className="max-w-xl mx-auto w-full flex flex-col items-center relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-tiger mb-7"
        >
          <ClawMark className="h-7 w-9" />
        </motion.div>

        <WordsFindEachOther closeness={closeness} />

        <div className="mt-8 md:mt-10 w-full max-w-lg">
          <RotatingLine startDelayMs={2300} />
        </div>
      </div>
    </section>
  );
}
