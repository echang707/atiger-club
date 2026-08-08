"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { discordUrl } from "@/lib/events";

export default function Hero() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400&auto=format&fit=crop"
          alt="Friends gathered together at golden hour"
          fill
          priority
          className="object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/25 to-ink/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-70" />
      </div>

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-amber-soft text-xs md:text-sm font-medium tracking-[0.25em] uppercase mb-5 flex items-center gap-2.5"
        >
          <span className="stripe-mark">
            <span></span><span></span><span></span>
          </span>
          Atlanta
          <span className="stripe-mark rotate-180">
            <span></span><span></span><span></span>
          </span>
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-wordmark text-ivory tracking-tightest"
        >
          Tiger Club
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-ivory/85 text-base md:text-lg max-w-sm font-medium"
        >
          The social club for people who actually do things.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9"
        >
          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber text-ink font-medium text-sm px-7 py-3.5 rounded-full hover:bg-ivory transition-colors duration-300"
          >
            Join the Community
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-ivory/60"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-6 bg-ivory/50"
        />
      </motion.div>
    </section>
  );
}
