"use client";

import { motion } from "framer-motion";
import RotatingLine from "./RotatingLine";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full flex flex-col items-center justify-center px-6 md:px-10 py-28">
      <div className="max-w-content mx-auto w-full flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="stripe-mark text-tiger mb-6"
        >
          <span></span>
          <span></span>
          <span></span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display italic font-medium text-4xl sm:text-5xl md:text-6xl tracking-tight text-ink text-center"
        >
          Tiger Club
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display text-2xl md:text-3xl text-ink/85 text-center"
        >
          life is better together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mt-3 w-full max-w-lg"
        >
          <RotatingLine />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink/30"
      >
        <span className="text-[11px] tracking-wideish uppercase">scroll</span>
        <span className="block w-px h-8 bg-ink/25" />
      </motion.div>
    </section>
  );
}
