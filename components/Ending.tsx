"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/* ---------------------------------------------------------------------
   The closing moment: "Go mild." becomes "Go wild." because the tiger
   flicks its tail and the wind blows the m away.

   The whole gag depends on cause and effect being legible, so the beats
   are sequenced off one clock (T, below) rather than each animating
   whenever it feels like it:

     0.00  rest — a short beat to read "Go mild."
     0.50  tail winds up
     0.58  whip travels down the tail
     0.80  tip snaps; gust launches
     1.00  the gust reaches the m and tumbles it over
     1.35  the flip lands as a w and settles

   The tail is a raster asset we are not allowed to redraw, so the whip
   is done by slicing the image into vertical strips and translating each
   one on a delay: the base barely moves, the delay increases toward the
   tip, and the amplitude grows with it. That reads as a wave travelling
   out to the tip and snapping, rather than a rigid picture rotating.
   --------------------------------------------------------------------- */

const T = {
  whip: 0.22,
  // The tip reaches full extension at whip + 0.16 (slice delay) + 45% of
  // the 0.5s arc. The gust launches exactly there — one gust, at the top
  // of the swing.
  gust: 0.6,
  flip: 0.78,
}
const TAIL_W = 1200;
const TAIL_H = 363;
const SLICES = 26;

function TailWhip({ play }: { play: boolean }) {
  // The tail is ONE image, never cut up.
  //
  // The previous version sliced it into 26 vertical strips and translated
  // each on a delay. That produced the whip shape, but adjacent strips
  // stepped past one another and the seams showed as hard pixel edges
  // down the tail. There is no amount of overlap that fixes it — offset
  // strips of a raster simply cannot stay continuous.
  //
  // Instead the motion is built from nested rigid rotations. Each layer
  // pivots from a point further along the tail and starts fractionally
  // later, so the transforms compose into a travelling bend: the base
  // barely turns, the tip swings hard and arrives last. Because every
  // layer transforms the whole subtree, the artwork is never broken —
  // it stays perfectly continuous at any zoom.
  const layers = [
    { origin: "100% 50%", deg: 5, delay: 0 },
    { origin: "88% 50%", deg: 8, delay: 0.05 },
    { origin: "70% 52%", deg: 11, delay: 0.1 },
    { origin: "48% 54%", deg: 14, delay: 0.15 },
  ];

  // One arc, and it goes UP first.
  //
  // The pivots sit at the right (the base), so a POSITIVE rotation lifts
  // the tip. The previous keyframes were negative-first, which swung the
  // tip down before it came up — backwards. Now: a small load downward,
  // a hard swing up, then it falls back through and settles.
  const curve = (d: number) => [0, -0.18 * d, d, 0.3 * d, -0.07 * d, 0];
  const times = [0, 0.2, 0.45, 0.68, 0.86, 1];

  let node = (
    <img
      src="/images/tiger-tail.webp"
      alt=""
      width={1200}
      height={363}
      className="block h-auto w-full"
    />
  );

  // wrap from the tip layer outwards
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const l = layers[i];
    const inner = node;
    node = (
      <motion.div
        key={i}
        style={{ transformOrigin: l.origin, willChange: "transform" }}
        initial={{ rotate: 0 }}
        animate={play ? { rotate: curve(l.deg) } : { rotate: 0 }}
        transition={{
          duration: 0.5,
          delay: T.whip + l.delay,
          ease: "easeOut",
          times,
        }}
      >
        {inner}
      </motion.div>
    );
  }

  return <div className="relative w-full">{node}</div>;
}

/* Two or three thin, imperfect streaks leaving the tip and running left.
   Drawn, not puffed: no cloud, no sparkle, no swoosh. */
function Gust({ play }: { play: boolean }) {
  // One gust, three strokes reading as a single body of moving air —
  // launched together rather than staggered into separate puffs.
  const streaks = [
    { d: "M198 16 C148 6, 92 12, 2 4", w: 2.8, delay: 0, len: 215 },
    { d: "M198 34 C140 34, 74 28, 0 34", w: 2.0, delay: 0.02, len: 215 },
    { d: "M194 52 C152 60, 100 56, 24 62", w: 1.5, delay: 0.04, len: 190 },
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 72"
      fill="none"
      // Anchored just LEFT of the tail tip and running further left,
      // toward the word. Previously it sat to the right of the tip, so the
      // wind appeared to blow away from the text it was supposed to hit.
      className="absolute w-[46%] md:w-[38%] overflow-visible"
      style={{ left: "-30%", top: "6%" }}
    >
      {streaks.map((s, i) => (
        <motion.path
          key={i}
          d={s.d}
          stroke="currentColor"
          strokeWidth={s.w}
          strokeLinecap="round"
          className="text-ink/60"
          style={{ strokeDasharray: s.len }}
          initial={{ strokeDashoffset: s.len, opacity: 0, x: 26 }}
          animate={
            play
              ? {
                  strokeDashoffset: [s.len, 0, -s.len * 0.9],
                  opacity: [0, 0.9, 0.9, 0],
                  x: [30, -4, -58],
                }
              : { strokeDashoffset: s.len, opacity: 0, x: 26 }
          }
          transition={{
            duration: 0.5,
            delay: T.gust + s.delay,
            ease: "easeOut",
            times: [0, 0.45, 1],
            opacity: { duration: 0.46, times: [0, 0.2, 0.66, 1], delay: T.gust + s.delay },
          }}
        />
      ))}
    </svg>
  );
}

/* The letter swap. Only the first character animates; "Go " and "ild."
   never move. The container is measured from real rendered glyphs and
   animates between the m-width and the w-width, so "ild." glides across
   the difference instead of jumping, and the finished "wild" keeps its
   natural kerning. */
function MildToWild({ play, reduced }: { play: boolean; reduced: boolean }) {
  const mRef = useRef<HTMLSpanElement>(null);
  const wRef = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState<{ m: number; w: number } | null>(null);
  const [swapped, setSwapped] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      if (mRef.current && wRef.current) {
        setW({
          m: mRef.current.getBoundingClientRect().width,
          w: wRef.current.getBoundingClientRect().width,
        });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    // fonts land after first paint; re-measure once they do
    if (typeof document !== "undefined" && (document as any).fonts?.ready) {
      (document as any).fonts.ready.then(measure).catch(() => {});
    }
    return () => window.removeEventListener("resize", measure);
  }, []);

  // The width transition is timed to the middle of the flip, when the
  // glyph is edge-on, so "ild." slides across the m/w width difference
  // exactly when nothing is legible — you never see it jump.
  useEffect(() => {
    if (reduced) {
      setSwapped(true);
      return;
    }
    if (!play) return;
    const id = window.setTimeout(() => setSwapped(true), (T.flip + 0.16) * 1000);
    return () => window.clearTimeout(id);
  }, [play, reduced]);

  const showW = reduced || swapped;

  return (
    <>
      {/* hidden rulers, same type styles as the headline */}
      <span
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none -z-10"
        style={{ left: -9999, top: 0 }}
      >
        <span ref={mRef}>m</span>
        <span ref={wRef}>w</span>
      </span>

      <motion.span
        aria-hidden="true"
        className="relative inline-block align-baseline"
        animate={{ width: w ? (showW ? w.w : w.m) : undefined }}
        transition={{ duration: 0.3, delay: T.flip + 0.16, ease: "easeOut" }}
        style={{ width: w ? (showW ? w.w : w.m) : undefined, perspective: 620 }}
      >
        {/* An in-flow glyph gives this box its height and, crucially, its
            baseline. Without it the container collapses and the letter
            renders below the line. Invisible; the animated width above is
            what actually drives layout. */}
        <span className="invisible">w</span>

        {/* ONE character that physically flips.

            A lowercase m turned over on its horizontal axis is a w — so
            this is a real 180° flip with two faces rather than a swap.
            The m is the front, the w is the back pre-rotated 180° so it
            lands upright. Halfway through, the glyph is edge-on and you
            genuinely see the same letter tumble through. It lifts, rides
            the gust, overshoots a few degrees and settles. */}
        <motion.span
          className="absolute left-0 top-0 inline-block"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ rotateX: 0, x: 0, y: 0, rotate: 0 }}
          animate={
            reduced
              ? { rotateX: 180, x: 0, y: 0, rotate: 0 }
              : play
              ? {
                  // caught, lifted, tumbled, dropped back into place
                  rotateX: [0, 62, 150, 196, 174, 180],
                  y: [0, -30, -38, -8, 3, 0],
                  x: [0, -13, -16, -5, 1, 0],
                  rotate: [0, -9, -13, -4, 1.5, 0],
                }
              : { rotateX: 0, x: 0, y: 0, rotate: 0 }
          }
          transition={{
            duration: 0.62,
            delay: T.flip,
            ease: [0.3, 0.9, 0.3, 1],
            times: [0, 0.2, 0.44, 0.7, 0.87, 1],
          }}
        >
          <span
            className="absolute left-0 top-0 inline-block"
            style={{ backfaceVisibility: "hidden" }}
          >
            m
          </span>
          <span
            className="inline-block"
            style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
          >
            w
          </span>
        </motion.span>
      </motion.span>
    </>
  );
}

export default function Ending() {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // once:false — the whole moment replays every time you scroll back to it.
  const inView = useInView(ref, { once: false, amount: 0.35 });
  // Bumping a run counter and keying the animating nodes off it restarts
  // the keyframes cleanly on each re-entry.
  const [runs, setRuns] = useState(0);
  useEffect(() => {
    if (inView) setRuns((r) => r + 1);
  }, [inView]);
  const play = runs > 0 && !reduced;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden flex items-center min-h-[70vh] md:min-h-[82vh] pt-6 md:pt-8 pb-20 md:pb-24"
    >
      {/* Tiger texture across the whole closing section rather than a strip
          sitting above it. Masked to the outer edges so the headline still
          sits on clean cream. */}
      <div aria-hidden="true" className="ending-wash" />
      <div className="relative z-10 w-full max-w-content mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Life's happening. Go wild."
          className="relative z-10 font-display text-ink tracking-tight
                     text-[12.5vw] leading-[0.94]
                     sm:text-[10vw]
                     md:text-[8vw] md:leading-[0.88]
                     lg:text-[7.3vw]"
        >
          <span aria-hidden="true">
            Life&rsquo;s happening.
            <br />
            Go <MildToWild key={`m${runs}`} play={play} reduced={reduced} />
            ild.
          </span>
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

      {/* Tail sits where it always has. It no longer travels to reach the
          text — the wind does that job. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 z-0
                   bottom-[3%] w-[124%] max-w-none
                   sm:bottom-[5%] sm:w-[96%]
                   md:bottom-[8%] md:w-[66%]
                   lg:bottom-[8%] lg:w-[59%]"
        initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: "10%" }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative translate-x-[12%] md:translate-x-[9%]">
          <TailWhip key={`t${runs}`} play={play} />
          <Gust key={`g${runs}`} play={play} />
        </div>
      </motion.div>
    </section>
  );
}
