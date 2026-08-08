"use client";

import { motion } from "framer-motion";
import MediumWord from "./MediumWord";

const words: { word: string; variant: "eat" | "create" | "move" | "explore" | "serve" | "learn"; href: string }[] = [
  { word: "EAT", variant: "eat", href: "/events?medium=Eat" },
  { word: "CREATE", variant: "create", href: "/events?medium=Create" },
  { word: "MOVE", variant: "move", href: "/events?medium=Move" },
  { word: "EXPLORE", variant: "explore", href: "/events?medium=Explore" },
  { word: "SERVE", variant: "serve", href: "/events?medium=Serve" },
  { word: "LEARN", variant: "learn", href: "/events?medium=Learn" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center px-6 md:px-10 pt-24 pb-16">
      <div className="max-w-content mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h1 className="font-display text-[15vw] sm:text-7xl md:text-8xl lg:text-9xl tracking-tightest leading-[0.9] text-ink">
            TIGER CLUB
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-4 md:mt-6"
        >
          <p className="annotation text-3xl md:text-4xl">go do something.</p>
          <p className="mt-4 text-ink/55 text-sm md:text-base max-w-md mx-auto">
            dinners, walks, creative nights, adventures, and other reasons to leave the house.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 md:mt-24"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 md:gap-x-10">
            {words.map((w) => (
              <MediumWord key={w.word} word={w.word} variant={w.variant} href={w.href} />
            ))}
          </div>
          <p className="text-center text-xs tracking-wideish text-ink/35 mt-10 uppercase">
            six ways in — hover, then click
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink/30"
      >
        <span className="text-[11px] tracking-wideish uppercase">scroll</span>
        <span className="block w-px h-8 bg-ink/25" />
      </motion.div>
    </section>
  );
}
