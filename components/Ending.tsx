"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Ending() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative bg-ink text-paper min-h-[80vh] flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 opacity-[0.04] paper-texture" />

      {/* Two lines that started apart back in the hero finish the thought
          here — drawing in from opposite corners and meeting behind the
          closing line. Plays once, softly, and never fights the text. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 240"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M20,20 C90,40 140,70 198,118"
          stroke="#F0A15F"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          initial={prefersReduced ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.5 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M380,220 C310,200 260,170 202,122"
          stroke="#F0A15F"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          initial={prefersReduced ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.5 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative font-display text-3xl md:text-5xl text-center leading-tight max-w-xl"
      >
        life&rsquo;s happening. come join it.
      </motion.p>

      <motion.a
        href="/events"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative mt-8 text-tiger-soft text-lg md:text-xl font-medium organic-underline organic-underline-invert"
      >
        see what&rsquo;s next →
      </motion.a>

      <motion.a
        href="https://discord.gg/6u83g4P8Cb"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative mt-4 text-paper/40 text-sm hover:text-paper/70 transition-colors"
      >
        join the community
      </motion.a>
    </section>
  );
}
