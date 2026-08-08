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
        className="font-display text-3xl md:text-5xl text-center leading-tight max-w-xl"
      >
        there&rsquo;s probably something happening.
      </motion.p>

      <motion.a
        href="/events"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="mt-8 text-tiger-soft text-lg md:text-xl font-medium underline-stripe"
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
        className="mt-4 text-paper/40 text-sm hover:text-paper/70 transition-colors"
      >
        join the community
      </motion.a>

      <div className="absolute bottom-0 left-0 right-0 h-14 overflow-hidden" aria-hidden="true">
        <div className="animate-walk absolute bottom-2 flex items-end gap-7">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="block"
              style={{
                transform: `rotate(${i % 2 === 0 ? -14 : 14}deg) translateY(${i % 2 === 0 ? 0 : 6}px) scaleX(${i % 2 === 0 ? 1 : -1})`,
                opacity: 0.3,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 26 26" fill="none">
                <ellipse cx="13" cy="17.5" rx="6.8" ry="5.6" fill="#F0A15F" />
                <ellipse cx="4.6" cy="9" rx="2.5" ry="3.3" fill="#F0A15F" transform="rotate(-20 4.6 9)" />
                <ellipse cx="10.3" cy="4.8" rx="2.5" ry="3.3" fill="#F0A15F" transform="rotate(-7 10.3 4.8)" />
                <ellipse cx="15.7" cy="4.8" rx="2.5" ry="3.3" fill="#F0A15F" transform="rotate(7 15.7 4.8)" />
                <ellipse cx="21.4" cy="9" rx="2.5" ry="3.3" fill="#F0A15F" transform="rotate(20 21.4 9)" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
