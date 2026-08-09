"use client";

import { motion } from "framer-motion";

export default function Ending() {
  return (
    <section className="relative bg-ink text-paper min-h-[80vh] flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 opacity-[0.04] paper-texture" />

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
