"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RotatingLine from "./RotatingLine";
import WordsFindEachOther from "./WordsFindEachOther";
import StripeField from "./StripeField";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // 0 at the top of the hero, 1 by the time it's scrolled mostly out of
  // view. Drives both the surrounding stroke marks and the small
  // word-closeness nudge — smooth, subconscious, tied to the same
  // number so everything moves together.
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
      <StripeField progress={closeness} />

      <div className="max-w-xl mx-auto w-full flex flex-col items-center relative">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="stripe-mark text-tiger mb-7"
        >
          <span></span>
          <span></span>
          <span></span>
        </motion.p>

        <WordsFindEachOther closeness={closeness} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 2.3 }}
          className="mt-8 md:mt-10 w-full max-w-lg"
        >
          <RotatingLine />
        </motion.div>
      </div>
    </section>
  );
}
