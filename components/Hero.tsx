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
        <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-5 sm:px-6 md:px-10 -translate-y-6 sm:translate-y-0">
          <WordsFindEachOther />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="mt-8 md:mt-10"
          >
            {/* Tail-shaped button — wide orange base with black tiger stripes
                tapering to a narrow tip. Text sits on the clean base,
                stripes occupy the taper. */}
            <Link
              href="/experiences"
              aria-label="Explore experiences"
              className="inline-block transition-[filter,transform] duration-200 hover:brightness-110 hover:-translate-y-px active:translate-y-0 active:brightness-95"
            >
              <svg
                viewBox="0 0 294 56"
                width="294"
                height="56"
                aria-hidden="true"
                style={{ display: "block", overflow: "visible",
                         filter: "drop-shadow(0 4px 18px rgba(210,71,15,0.42))" }}
              >
                <defs>
                  <linearGradient id="tail-tg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#E0500E" />
                    <stop offset="60%"  stopColor="#C84010" />
                    <stop offset="100%" stopColor="#A03208" />
                  </linearGradient>
                  <clipPath id="tail-clip">
                    <path d="M 36,5 C 92,2 160,4 210,10 C 244,14 268,20 274,28 C 268,36 244,42 210,46 C 160,52 92,54 36,51 C 17,51 4,41 4,28 C 4,15 17,5 36,5 Z" />
                  </clipPath>
                </defs>
                {/* Orange body */}
                <path
                  d="M 36,5 C 92,2 160,4 210,10 C 244,14 268,20 274,28 C 268,36 244,42 210,46 C 160,52 92,54 36,51 C 17,51 4,41 4,28 C 4,15 17,5 36,5 Z"
                  fill="url(#tail-tg)"
                />
                {/* Black stripes — taper only, so text base stays clean */}
                <g clipPath="url(#tail-clip)">
                  <line x1="158" y1="-4" x2="152" y2="60" stroke="#0E0A06" strokeWidth="11" />
                  <line x1="186" y1="-4" x2="181" y2="60" stroke="#0E0A06" strokeWidth="9"  />
                  <line x1="211" y1="-4" x2="207" y2="60" stroke="#0E0A06" strokeWidth="7"  />
                  <line x1="233" y1="-4" x2="230" y2="60" stroke="#0E0A06" strokeWidth="5"  />
                  <line x1="251" y1="-4" x2="249" y2="60" stroke="#0E0A06" strokeWidth="4"  />
                  <line x1="264" y1="-4" x2="263" y2="60" stroke="#0E0A06" strokeWidth="3"  />
                  <line x1="272" y1="-4" x2="271" y2="60" stroke="#0E0A06" strokeWidth="2"  />
                </g>
                {/* Soft top-edge highlight */}
                <path
                  d="M 36,5 C 92,2 160,4 210,10 C 244,14 268,20 274,28"
                  stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"
                  fill="none" strokeLinecap="round"
                />
                {/* Label — centred in the clean wide base */}
                <text
                  x="100" y="28"
                  dominantBaseline="central" textAnchor="middle"
                  fontFamily="var(--font-bricolage), sans-serif"
                  fontSize="15" fontWeight="600" letterSpacing="0.01em"
                  fill="white"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.45)" }}
                >
                  Explore experiences
                </text>
              </svg>
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
