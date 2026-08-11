"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

// The closing section is the payoff for the whole page: the visual
// language of the hero coming back after being withheld for four quiet
// cream sections.
//
// Three things happen here, in this order:
//
//   1. The marble returns — masked to the outer frame only, its opacity
//      driven by scroll position so the texture builds as you approach
//      instead of snapping on. The middle stays clean cream.
//   2. The headline sits in that clean cream, at full ink contrast.
//   3. The tiger arrives from the right as its own transparent asset —
//      not baked into a background image — and its real tail extends
//      leftward into the negative space toward "grab it by the tail."
//
// The tail reveal is a single clip-path wipe running right to left, so
// the body lands first and the tail draws out behind it. It runs once
// and settles. Nothing loops, floats or detaches.

function useEdgeReveal() {
  const ref = useRef<HTMLElement>(null);
  const [edge, setEdge] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setEdge(1);
      return;
    }
    let ticking = false;
    const frame = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 while the section is still a screen away, 1 once it's properly
      // in view. Clamped so it never overshoots at either end.
      const p = (vh - r.top) / (vh * 0.85);
      setEdge(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    frame();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [prefersReduced]);

  return { ref, edge };
}

function TigerAtTheEnd() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none relative z-0 mt-10 md:mt-0"
      // A clip-path wipe was used here to "draw" the tail outward, but the
      // inset interpolation reliably stalled around 18%, permanently
      // chopping the tail tip off. A fade plus a short slide is less
      // clever and always renders the whole animal.
      initial={prefersReduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.9, ease: [0.22, 0.75, 0.24, 1] }}
    >
      <motion.div
        initial={prefersReduced ? false : { x: 54 }}
        whileInView={{ x: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.15, ease: [0.22, 0.75, 0.24, 1] }}
        // Desktop: sized so the whole animal fits inside the section —
        // no cropped head, no rear cut off by the right edge — while still
        // overflowing left far enough that the tail tip lands just past
        // the end of "tail." The copy is layered above this (z-10 vs z-0),
        // so the tail may pass behind type but can never sit on top of it.
        // Mobile: recomposed rather than shrunk — see the section below.
        className="w-[122%] -ml-[20%] md:w-[112%] md:-ml-[23%]"
      >
        <Image
          src="/images/tiger-cutout.webp"
          alt=""
          width={1400}
          height={921}
          priority={false}
          className="h-auto w-full"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Ending() {
  const { ref, edge } = useEdgeReveal();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-[80vh] flex items-center pt-32 pb-20 md:pt-36 md:pb-24"
      style={{ ["--edge" as string]: edge.toFixed(3) }}
    >
      {/* The hero's material, returning. Masked to the frame so the centre
          stays clean cream for the headline. */}
      <div aria-hidden="true" className="marble-frame" />

      <div className="relative z-10 w-full max-w-content mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-6 md:gap-5 items-center md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center md:text-left md:pb-16"
          >
            <p className="font-display text-ink text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.98] tracking-tight">
              Life is happening.
              <br />
              Grab it by the{" "}
              <span className="relative inline-block whitespace-nowrap">
                tail.
                {/* The mark under "tail." draws itself after the tiger has
                    settled, so the tail arrives and then the line lands —
                    two beats, not one. */}
                <motion.svg
                  aria-hidden="true"
                  viewBox="0 0 200 16"
                  preserveAspectRatio="none"
                  className="absolute -left-[2%] -bottom-[0.1em] h-[0.18em] w-[104%] overflow-visible text-tiger"
                >
                  <motion.path
                    d="M4 11.5C36 5.4 76 3.2 108 5.4c25 1.7 54 5.1 88 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={4}
                    strokeLinecap="round"
                    // Explicit dash values rather than framer's pathLength:
                    // pathLength needs a measured path and was collapsing to
                    // a dot on first paint. 210 comfortably exceeds this
                    // path's real length, so 210 -> 0 draws it left to right.
                    strokeDasharray={210}
                    initial={{ strokeDashoffset: 210 }}
                    whileInView={{ strokeDashoffset: 0 }}
                    viewport={{ once: true, margin: "-120px" }}
                    transition={{ duration: 0.7, delay: 0.95, ease: "easeOut" }}
                  />
                </motion.svg>
              </span>
            </p>

            <p className="mt-6 md:mt-8 text-lg md:text-xl text-ink/75 max-w-[34ch] mx-auto md:mx-0">
              Something is on almost every week, and there is always room for
              one more.
            </p>

            <motion.a
              href="/events"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-8 inline-block rounded-full bg-tiger-fill px-7 py-3.5 text-[15px] md:text-base font-semibold text-[#FFF7EF] transition-colors duration-300 hover:bg-tiger-deep"
            >
              see what&rsquo;s happening →
            </motion.a>
          </motion.div>

          <TigerAtTheEnd />
        </div>
      </div>
    </section>
  );
}
