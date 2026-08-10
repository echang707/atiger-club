"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

// The one tail moment on the site. It's the actual drawn tiger — tail,
// body and all one illustration — so the tail is physically part of the
// animal at every viewport size by construction, not a separate shape
// that has to be lined up against it. It sits off the right edge of the
// section and sweeps in once as the section enters view, then settles.
function TigerAtTheEnd() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      initial={prefersReduced ? false : { opacity: 0, x: 90, rotate: -2 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute bottom-0 right-[-14%] top-auto z-0 w-[68vw] max-w-[300px] sm:right-[-8%] sm:w-[52vw] sm:max-w-[380px] md:right-[-6%] md:w-[38vw] md:max-w-[520px] lg:right-[-3%]"
    >
      <Image
        src="/images/tiger-illustration.png"
        alt=""
        width={989}
        height={1467}
        priority={false}
        className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
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
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-[70%]"
        style={{
          background:
            "radial-gradient(55% 60% at 78% 60%, rgba(217,119,33,0.16), rgba(217,119,33,0) 70%)",
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
        </motion.div>
      </div>

      {/* Reserves room below the copy on mobile, where the tiger stacks
          under the text instead of sitting beside it. */}
      <div className="relative z-0 mt-14 h-[46vh] w-full sm:h-[50vh] md:absolute md:inset-0 md:mt-0 md:h-auto">
        <TigerAtTheEnd />
      </div>
    </section>
  );
}
