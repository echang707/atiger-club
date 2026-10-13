"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import WordsFindEachOther from "./WordsFindEachOther";
import RotatingLine from "./RotatingLine";
import CursorThread from "./CursorThread";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-[72px]">

      {/* Interactive cursor thread — fixed canvas, pointer-events none */}
      <CursorThread />

      {/* Copy — centered in the space below the fixed nav */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-5 sm:px-6 md:px-10">
        <WordsFindEachOther />

        {/* hero-subline margin-top is owned by the CSS class */}
        <div className="w-full max-w-2xl">
          <RotatingLine />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-10 md:mt-12"
        >
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 rounded-full bg-tiger-fill px-7 py-3.5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-tiger-deep"
          >
            Explore experiences →
          </Link>
        </motion.div>
      </div>

      {/* Cream fade at the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 md:h-36"
        style={{ background: "linear-gradient(to bottom, transparent, #F4E9D6)" }}
      />
    </section>
  );
}
