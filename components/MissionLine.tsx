"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MissionLine() {
  return (
    <section className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-36 text-center">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-2xl md:text-4xl text-ink leading-snug max-w-2xl mx-auto"
      >
        Meaningful experiences, real people, and a reason to leave the house — one gathering at a time.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8"
      >
        <Link
          href="/events"
          className="text-sm font-medium underline-stripe text-ink/70 hover:text-ink"
        >
          See what&rsquo;s coming up
        </Link>
      </motion.div>
    </section>
  );
}
