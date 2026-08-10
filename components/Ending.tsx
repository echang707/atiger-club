"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import MarbleField from "./MarbleField";

// The hand-drawn tiger, tail curled up over its own back. It replaces
// the old top-down SVG rump: this one already carries its own tail, so
// it doesn't need to be the literal spot the page-long tail line (see
// TheStripe) walks into — it just needs to sit small enough to read as
// "the tiger" inside this one section, nudged toward the right so the
// curl at the top of its own tail lands close under "Grab it by the
// tail." above it, which is the whole joke.
function TigerAtTheEnd() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: -10, rotate: 0.8 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none relative mx-auto mt-2 mb-8 sm:mt-3 sm:mb-10 md:mb-14 w-[160px] sm:w-[190px] md:w-[225px] md:ml-[9%] lg:ml-[11%] md:-mt-2"
    >
      {/* Sits just inside the top-left of the frame, which is where the
          drawing's own tail curls — close enough to where the page's
          drawn tail line (see TheStripe) arrives that the two read as
          one continuous stroke, and covered by the opaque artwork
          either way so the join never shows as a line stopping short. */}
      <span data-stripe-end className="absolute left-[18%] top-[10%] h-px w-px" />

      <div className="relative w-full aspect-[3/2]">
        <Image
          src="/images/tiger-drawn.png"
          alt="Illustrated tiger, tail curled, crouched and roaring"
          fill
          sizes="(min-width: 768px) 225px, 160px"
          className="object-contain"
          priority={false}
        />
      </div>
    </motion.div>
  );
}

export default function Ending() {
  return (
    <section
      data-stripe-invert
      className="relative text-paper min-h-[80vh] flex flex-col items-center justify-center overflow-visible px-6"
    >
      {/* The dark backdrop lives on its own layer, well below TheStripe's
          z-index (-1). Previously this was just `bg-ink` on the section
          itself, which paints at stacking level 0 — ABOVE the stripe —
          so the tail vanished the instant it entered the one section
          where it needs to be visible: connecting into the tiger. */}
      <div className="absolute inset-0 -z-20 bg-ink" />
      {/* A transition zone rather than a hard edge. The tail arrives from
          the cream page above and has to stay legible the whole way in,
          so the top of this section fades from paper to ink over ~220px
          instead of switching in one scanline — which is where the tail
          used to visually disappear for a beat. It sits at -z-20 with the
          ink, so it is still behind the tail at z-index -1. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-20 h-[220px]"
        style={{ background: "linear-gradient(to bottom, #F4F0E6 0%, rgba(22,20,15,0) 100%)" }}
      />
      <div className="absolute inset-0 -z-10 opacity-[0.04] paper-texture" />
      <MarbleField variant="dark" contain={1000} className="-z-10" />

      {/* A soft warm pool on the centre axis. It does no work on its own,
          but it puts the brightest point of the section exactly where the
          tail lands, so the eye follows the tail down into the animal
          instead of drifting to the two lines of copy. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%]"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 62%, rgba(217,119,33,0.13), rgba(217,119,33,0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl min-h-[64vh] flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid w-full grid-cols-1 md:grid-cols-[1fr_260px_1fr] items-baseline gap-3 md:gap-0 pt-16 md:pt-24"
        >
          {/* Split either side of a wide centre gutter. The gutter is not
              decoration — it is the lane the tail comes down, which is why
              it is sized against the tail's weight rather than by eye. */}
          <p className="font-display text-3xl md:text-5xl leading-tight text-center md:text-right text-shield-invert">
            Life is happening.
          </p>
          <div aria-hidden="true" />
          <p className="font-display text-3xl md:text-5xl leading-tight text-center md:text-left text-shield-invert">
            Grab it by the tail.
          </p>
        </motion.div>

        <TigerAtTheEnd />

        <motion.a
          href="/events"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-auto mb-14 self-center text-tiger-soft text-lg md:text-xl font-medium organic-underline organic-underline-invert"
        >
          see what&rsquo;s happening →
        </motion.a>
      </div>
    </section>
  );
}
