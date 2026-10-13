"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import WordsFindEachOther from "./WordsFindEachOther";
import RotatingLine from "./RotatingLine";

export default function Hero() {
  return (
    <section className="relative w-full h-[100svh] overflow-hidden">

      {/* Background thread SVG */}
      <Thread />

      {/* Absolutely centered — no flex/padding math that can drift. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-5 sm:px-6 md:px-10">
          <WordsFindEachOther />

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

/* Two threads drawn on as the page loads — one from each diagonal,
   crossing somewhere near the center. */
function Thread() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 820"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      {/* Tiger orange: upper-right → lower-left */}
      <motion.path
        d="M 1380 -10 C 1200 110, 960 60, 780 230 C 600 400, 720 480, 520 570 C 320 660, 100 610, -30 850"
        stroke="#D2470F"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity={0.20}
        pathLength={1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Brass-gold: upper-left → lower-right */}
      <motion.path
        d="M 60 -10 C 240 110, 480 60, 650 210 C 820 360, 640 480, 820 570 C 1000 660, 1260 600, 1460 840"
        stroke="#B98A34"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
        opacity={0.15}
        pathLength={1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
