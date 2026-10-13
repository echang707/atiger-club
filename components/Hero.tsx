"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import WordsFindEachOther from "./WordsFindEachOther";
import HeroBackdrop from "./HeroBackdrop";

export default function Hero() {
  return (
    <section className="hero-shell relative overflow-hidden">

      {/* Character illustration backdrop — sets CSS vars for centering */}
      <HeroBackdrop />

      {/* Content centred via --hero-copy-fix system from HeroBackdrop */}
      <div className="hero-content absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-5 sm:px-6 md:px-10">
          <WordsFindEachOther />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="mt-8 md:mt-10"
          >
            <Link
              href="/experiences"
              className="inline-flex items-center gap-2 rounded-full bg-tiger-fill px-7 py-3.5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-tiger-deep"
            >
              Explore experiences →
            </Link>
          </motion.div>
        </div>
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
