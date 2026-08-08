"use client";

import { motion } from "framer-motion";
import RotatingLine from "./RotatingLine";
import WordsFindEachOther from "./WordsFindEachOther";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full flex flex-col items-center justify-center px-6 md:px-10 py-28">
      <div className="max-w-xl mx-auto w-full flex flex-col items-center">
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

        <WordsFindEachOther />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-8 md:mt-10 w-full max-w-lg"
        >
          <RotatingLine />
        </motion.div>
      </div>
    </section>
  );
}
