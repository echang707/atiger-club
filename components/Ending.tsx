"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

// The one tail moment on the site — the hand-drawn tiger, tail and body
// all one illustration. Its own tail sits at the top-left corner of the
// artwork, so sitting it directly under the copy puts the tail right
// where "grab it by the tail" ends, with the body sweeping down and
// away from it. Sized to stay fully inside the section (no off-canvas
// crop this time) and kept modest since the drawing itself reads wide.
function TigerAtTheEnd() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      initial={prefersReduced ? false : { opacity: 0, y: 26, rotate: -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none mt-10 w-[78vw] max-w-[300px] sm:mt-8 sm:w-[60vw] sm:max-w-[360px] md:mt-6 md:w-[34vw] md:max-w-[420px] mx-auto md:mx-0"
    >
      <Image
        src="/images/tiger-illustration-drawn.png"
        alt=""
        width={1304}
        height={796}
        priority={false}
        className="h-auto w-full drop-shadow-[0_24px_50px_rgba(0,0,0,0.45)]"
      />
    </motion.div>
  );
}

export default function Ending() {
  return (
    <section className="relative overflow-x-hidden text-paper min-h-[85vh] flex flex-col justify-center py-24 md:py-32">
      {/* The dark backdrop lives on its own layer beneath everything else
          in the section, including the tiger. */}
      <div className="absolute inset-0 -z-20 bg-ink" />
      <div className="absolute inset-0 -z-10 opacity-[0.04] paper-texture" />

      {/* A soft warm pool behind where the tiger lands, so the eye is
          drawn there rather than drifting. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-[70%]"
        style={{
          background:
            "radial-gradient(55% 60% at 30% 55%, rgba(217,119,33,0.16), rgba(217,119,33,0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-content mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-md md:max-w-lg text-center md:text-left mx-auto md:mx-0"
        >
          <p className="font-display text-3xl md:text-5xl leading-tight">
            Life is happening.
            <br />
            Grab it by the tail.
          </p>

          <motion.a
            href="/events"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-8 inline-block text-tiger-soft text-lg md:text-xl font-medium organic-underline organic-underline-invert"
          >
            see what&rsquo;s happening →
          </motion.a>

          {/* The tail lands right here, directly under "the tail." —
              the drawing's own tail tip is its top-left corner, so this
              placement in normal flow (not floated off to the side) is
              what lines the two up. */}
          <TigerAtTheEnd />
        </motion.div>
      </div>
    </section>
  );
}
