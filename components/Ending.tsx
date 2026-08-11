"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

// The closing statement, and the one joke on the page.
//
// The tail rests near the type, winds back, whips across, and the tip
// catches the word "wild" — which jolts sideways and shakes for about
// 350ms while every other word stays perfectly still. That stillness is
// the whole gag: "Life's happening. Go —" [SMACK] "wild."
//
// Physics, not cartoon. No stars, no impact lines, no big bounce. The
// letters wobble at slightly different rates and amplitudes because they
// each absorbed the hit a little differently, and the tail rebounds off
// the collision rather than snapping straight back.
//
// Fires once, when the section enters view. A loop would get old fast.

const IMPACT = 0.62;      // seconds — when the tip reaches the word
const LETTERS = ["w", "i", "l", "d", "."];

// Per-letter character, so the shake reads as physical rather than as one
// object being translated. The full stop barely moves — it's tiny.
const LETTER_FEEL = [
  { amp: 1.0, spin: 1.0, delay: 0.0 },
  { amp: 0.78, spin: 1.45, delay: 0.026 },
  { amp: 1.06, spin: 0.68, delay: 0.045 },
  { amp: 1.24, spin: 1.2, delay: 0.066 },
  { amp: 0.4, spin: 1.8, delay: 0.086 },
];

function WildWord() {
  return (
    <span className="inline-block whitespace-nowrap">
      {LETTERS.map((ch, i) => {
        const f = LETTER_FEEL[i];
        return (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
            whileInView={{
              x: [0, -46 * f.amp, 28 * f.amp, -17 * f.amp, 9 * f.amp, -4 * f.amp, 0],
              y: [0, 9 * f.amp, -6 * f.amp, 4 * f.amp, -2 * f.amp, 1 * f.amp, 0],
              rotate: [
                0,
                -19 * f.spin,
                12 * f.spin,
                -7 * f.spin,
                3.5 * f.spin,
                -1.5 * f.spin,
                0,
              ],
              scale: [1, 1.06, 0.97, 1.02, 0.995, 1.005, 1],
            }}
            // once:false — the hit lands every time you scroll onto it.
            viewport={{ once: false, amount: 0.6 }}
            transition={{
              duration: 0.72,
              delay: IMPACT + f.delay,
              ease: "easeOut",
              times: [0, 0.08, 0.22, 0.4, 0.58, 0.76, 1],
            }}
          >
            {ch}
          </motion.span>
        );
      })}
    </span>
  );
}

function Tail() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 z-0
                 bottom-[3%] w-[124%] max-w-none
                 sm:bottom-[5%] sm:w-[96%]
                 md:bottom-[8%] md:w-[66%]
                 lg:bottom-[8%] lg:w-[59%]
                 origin-right"
      initial={reduced ? { x: "0%", opacity: 1, rotate: 0 } : { x: "16%", opacity: 0, rotate: 2.4 }}
      whileInView={
        reduced
          ? { x: "0%", opacity: 1, rotate: 0 }
          : {
              // swing in -> wind back -> WHIP -> overshoot -> rebound -> settle
              x: ["16%", "6%", "13%", "-14%", "-4%", "1.5%", "0%"],
              rotate: [2.4, 1.6, 6.5, -11, -2.6, 1, 0],
              opacity: 1,
            }
      }
      viewport={{ once: false, amount: 0.35 }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              opacity: { duration: 0.35, ease: "easeOut" },
              // The physics lives in `times`: slow wind-up, violent snap,
              // soft settle — not in the easing curve.
              x: { duration: 1.7, times: [0, 0.22, 0.42, 0.55, 0.7, 0.85, 1], ease: "easeOut" },
              rotate: { duration: 1.7, times: [0, 0.22, 0.42, 0.55, 0.7, 0.85, 1], ease: "easeOut" },
            }
      }
    >
      <div className="translate-x-[12%] md:translate-x-[9%]">
        <Image
          src="/images/tiger-tail.webp"
          alt=""
          width={1200}
          height={363}
          className="h-auto w-full"
        />
      </div>
    </motion.div>
  );
}

export default function Ending() {
  return (
    <section className="relative overflow-hidden flex items-center min-h-[78vh] md:min-h-[88vh] py-24 md:py-28">
      <div className="relative z-10 w-full max-w-content mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 font-display text-ink tracking-tight
                     text-[12.5vw] leading-[0.94]
                     sm:text-[10vw]
                     md:text-[8vw] md:leading-[0.88]
                     lg:text-[7.3vw]"
        >
          Life&rsquo;s happening.
          <br />
          Go <WildWord />
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
