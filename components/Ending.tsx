"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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
  { amp: 0.82, spin: 1.35, delay: 0.018 },
  { amp: 0.94, spin: 0.75, delay: 0.032 },
  { amp: 1.12, spin: 1.15, delay: 0.048 },
  { amp: 0.45, spin: 1.6, delay: 0.062 },
];

function WildWord({ play }: { play: boolean }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {LETTERS.map((ch, i) => {
        const f = LETTER_FEEL[i];
        return (
          <motion.span
            key={i}
            className="inline-block"
            initial={false}
            animate={
              play
                ? {
                    x: [0, -13 * f.amp, 8 * f.amp, -4.5 * f.amp, 2 * f.amp, 0],
                    y: [0, 2.5 * f.amp, -1.5 * f.amp, 1 * f.amp, 0, 0],
                    rotate: [0, -6 * f.spin, 3.4 * f.spin, -1.7 * f.spin, 0.7 * f.spin, 0],
                  }
                : { x: 0, y: 0, rotate: 0 }
            }
            transition={{
              duration: 0.42,
              delay: IMPACT + f.delay,
              ease: "easeOut",
              times: [0, 0.12, 0.32, 0.56, 0.78, 1],
            }}
          >
            {ch}
          </motion.span>
        );
      })}
    </span>
  );
}

function Tail({ play, settled }: { play: boolean; settled: boolean }) {
  const reduced = useReducedMotion();

  // rest -> wind back -> WHIP -> overshoot past the word -> rebound -> settle
  const whip = {
    x: ["6%", "9.5%", "-7%", "-2.5%", "0.6%", "0%"],
    rotate: [1.6, 3.2, -5.4, -1.2, 0.5, 0],
  };

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 z-0
                 bottom-[3%] w-[124%] max-w-none
                 sm:bottom-[5%] sm:w-[96%]
                 md:bottom-[8%] md:w-[66%]
                 lg:bottom-[8%] lg:w-[59%]
                 origin-right"
      initial={reduced ? false : { x: "16%", opacity: 0, rotate: 2.4 }}
      animate={
        reduced || settled
          ? { x: "0%", opacity: 1, rotate: 0 }
          : play
          ? { x: whip.x, rotate: whip.rotate, opacity: 1 }
          : { x: "16%", opacity: 0, rotate: 2.4 }
      }
      transition={
        reduced
          ? { duration: 0 }
          : {
              opacity: { duration: 0.45, ease: "easeOut" },
              // Slow wind-up, violent snap, soft settle — the `times`
              // array is where the physics lives.
              x: { duration: 1.35, times: [0, 0.42, 0.53, 0.68, 0.84, 1], ease: "easeOut" },
              rotate: { duration: 1.35, times: [0, 0.42, 0.53, 0.68, 0.84, 1], ease: "easeOut" },
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
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // One trigger for both the word and the tail, so the smack and the shake
  // can never drift apart. Once only — a loop would wear out fast.
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const play = inView && !reduced;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden flex items-center min-h-[78vh] md:min-h-[88vh] py-24 md:py-28"
    >
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
          Go{" "}
          <WildWord play={play} />
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

      <Tail play={play} settled={!!reduced && inView} />
    </section>
  );
}
