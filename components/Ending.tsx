"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

// The closing statement, art-directed as an editorial spread rather than a
// call-to-action banner.
//
// Everything that made it read like an ad is gone: the full tiger, the
// supporting paragraph, the filled orange button, the drawn underline. What
// is left is very large type, a lot of cream, one small text link, and a
// single tail entering from off-screen right — the tiger is implied to be
// standing outside the frame.
//
// The tail is a CROP of the locked tiger artwork (public/images/tiger-tail.webp),
// cut at a clean cross-section before the haunches. Nothing was redrawn: it
// is the same painting, same brush texture, same orange and near-black, just
// framed so only the tail is in view. Its thick end bleeds off the right
// edge, which is what sells "the animal is out there."
//
// It is positioned so its tapered tip rises toward the word "tail." without
// ever touching the text — the joke lands on proximity, not collision.

function Tail() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      // Sits low and to the right so its tapered tip approaches "tail."
      // from underneath without ever touching the letterforms.
      className="pointer-events-none absolute right-0 z-0
                 bottom-[4%] w-[118%] max-w-none
                 sm:bottom-[6%] sm:w-[92%]
                 md:bottom-[9%] md:w-[64%]
                 lg:bottom-[9%] lg:w-[57%]"
      initial={prefersReduced ? false : { x: "22%", opacity: 0 }}
      whileInView={{ x: "0%", opacity: 1 }}
      viewport={{ once: true, margin: "-140px" }}
      transition={{ duration: 1.25, ease: [0.22, 0.75, 0.24, 1] }}
    >
      {/* Pushed past the right edge so the cut end is never visible. */}
      <div className="translate-x-[14%] md:translate-x-[10%]">
        <Image
          src="/images/tiger-tail.webp"
          alt=""
          width={1200}
          height={363}
          priority={false}
          className="h-auto w-full"
        />
      </div>
    </motion.div>
  );
}

export default function Ending() {
  return (
    <section className="relative overflow-hidden flex items-center min-h-[78vh] md:min-h-[88vh] py-24 md:py-28">
      {/* Mostly cream by design — no heavy pattern competes with the type
          here. The page surface texture is doing all the work. */}
      <div className="relative z-10 w-full max-w-content mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          // No max-width: the <br /> controls the break, so the line
          // reads as two deliberate lines rather than four ragged ones.
          className="relative z-10 font-display text-ink tracking-tight
                     text-[12.5vw] leading-[0.94]
                     sm:text-[10vw]
                     md:text-[8vw] md:leading-[0.88]
                     lg:text-[7.3vw]"
        >
          Life is happening.
          <br />
          Grab it by the tail.
        </motion.h2>

        <motion.a
          href="/events"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="organic-underline relative z-10 mt-10 md:mt-14 inline-block
                     font-mono text-[11px] md:text-xs tracking-wideish uppercase
                     text-ink hover:text-tiger-text transition-colors"
        >
          see what&rsquo;s happening →
        </motion.a>
      </div>

      <Tail />
    </section>
  );
}
