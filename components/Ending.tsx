"use client";

import { motion } from "framer-motion";

function TigerAtTheEnd() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-[5%] md:right-[10%] top-0 -translate-y-[46%] w-[132px] md:w-[178px]"
    >
      {/* The tiny marker is where the scrolling tail physically finishes. */}
      <span
        data-stripe-end
        className="absolute left-[53%] top-[8%] h-px w-px"
      />
      <svg viewBox="0 0 180 230" className="block h-auto w-full overflow-visible">
        {/* back-view silhouette: intentionally graphic, not mascot-like */}
        <path
          d="M57 61 C56 39 67 25 90 25 C113 25 124 39 123 61 L132 86 C140 113 137 161 129 218 L51 218 C43 161 40 113 48 86 Z"
          fill="#E2531C"
        />
        <path d="M59 43 L45 30 L49 57 Z" fill="#E2531C" />
        <path d="M121 43 L135 30 L131 57 Z" fill="#E2531C" />
        <path d="M54 66 C67 57 77 56 90 56 C103 56 113 57 126 66" fill="none" stroke="#15130E" strokeWidth="7" strokeLinecap="round" />
        <path d="M49 91 C65 82 76 81 90 82 C105 81 116 82 131 91" fill="none" stroke="#15130E" strokeWidth="8" strokeLinecap="round" />
        <path d="M46 119 C61 109 75 108 90 109 C106 108 120 109 134 119" fill="none" stroke="#15130E" strokeWidth="9" strokeLinecap="round" />
        <path d="M45 151 C61 141 76 140 90 141 C105 140 120 141 135 151" fill="none" stroke="#15130E" strokeWidth="9" strokeLinecap="round" />
        <path d="M47 183 C63 174 77 173 90 174 C104 173 118 174 133 183" fill="none" stroke="#15130E" strokeWidth="9" strokeLinecap="round" />
        <path d="M61 218 C58 190 59 168 64 148" fill="none" stroke="#15130E" strokeWidth="7" strokeLinecap="round" />
        <path d="M119 218 C122 190 121 168 116 148" fill="none" stroke="#15130E" strokeWidth="7" strokeLinecap="round" />
        {/* a small paper gap at the tail base makes it look unfinished until the page-tail reaches it */}
        <path d="M84 30 C87 25 93 25 96 30" fill="none" stroke="#F5F0E3" strokeWidth="8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Ending() {
  return (
    <section
      data-stripe-invert
      className="relative bg-ink text-paper min-h-[80vh] flex flex-col items-center justify-center overflow-visible px-6"
    >
      <TigerAtTheEnd />
      <div className="absolute inset-0 opacity-[0.04] paper-texture" />

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative font-display text-3xl md:text-5xl text-center leading-tight max-w-xl"
      >
        Life&rsquo;s calling. Pick up.
      </motion.p>

      <motion.a
        href="/events"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative mt-8 text-tiger-soft text-lg md:text-xl font-medium organic-underline organic-underline-invert"
      >
        see what&rsquo;s happening →
      </motion.a>
    </section>
  );
}
