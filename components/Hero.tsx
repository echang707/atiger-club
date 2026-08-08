"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop"
          alt="A group of friends laughing together outdoors at golden hour"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/20" />
      </div>

      <div className="relative z-10 max-w-content mx-auto w-full px-6 md:px-10 pb-16 md:pb-24 pt-40">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-amber-soft text-sm font-medium tracking-wide mb-5 flex items-center gap-2.5"
        >
          <span className="stripe-mark">
            <span></span><span></span><span></span>
          </span>
          Atlanta&rsquo;s social club
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl md:text-7xl lg:text-8xl text-ivory leading-[0.98] tracking-tightest max-w-3xl"
        >
          Find your people.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-ivory/85 text-lg max-w-md"
        >
          Tiger Club creates meaningful experiences that bring people together — around the city, one gathering at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-amber text-ink font-medium px-7 py-3.5 rounded-full hover:bg-ivory transition-colors duration-300"
          >
            Join the Community
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
