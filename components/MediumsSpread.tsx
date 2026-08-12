"use client";

import { motion } from "framer-motion";
import MediumWord from "./MediumWord";

// `weave` is the side of the row the tail is told to pass on — always
// the side the word ISN'T. Without these the tail had no reason to
// leave the middle of the page and simply fell straight through CREATE.
// They're waypoints, not hard constraints: the tail still bends around
// the measured type on its way between them.
const words: {
  word: string;
  variant: "eat" | "create" | "move" | "explore" | "serve" | "learn" | "play";
  href: string;
  align: "start" | "center" | "end";
  offset: string;
  rotate: number;
  num: string;
  weave: "left" | "right";
}[] = [
  // Ordered so the traveling period zig-zags cleanly left → right → left
  // down the page rather than doubling back on itself.
  // Laid out as a staircase so the ball always has somewhere to roll: each
  // word starts near where the previous one ended and sits lower, so the
  // ball rolls the length of the type, runs off the edge, and drops onto
  // the next word's leading edge. The small rotations give each word a
  // real slope to roll down.
  { word: "EAT", variant: "eat", href: "/events?medium=Eat", align: "start", offset: "ml-0 md:ml-2 lg:ml-4", rotate: 2.5, num: "01", weave: "right" },
  { word: "CREATE", variant: "create", href: "/events?medium=Create", align: "start", offset: "ml-6 md:ml-24 lg:ml-40", rotate: 2, num: "02", weave: "right" },
  { word: "MOVE", variant: "move", href: "/events?medium=Move", align: "end", offset: "mr-0 md:mr-6 lg:mr-10", rotate: 2.5, num: "03", weave: "left" },
  { word: "SERVE", variant: "serve", href: "/events?medium=Serve", align: "end", offset: "mr-4 md:mr-24 lg:mr-40", rotate: -2.5, num: "04", weave: "left" },
  { word: "LEARN", variant: "learn", href: "/events?medium=Learn", align: "start", offset: "ml-4 md:ml-16 lg:ml-28", rotate: -2, num: "05", weave: "right" },
  { word: "EXPLORE", variant: "explore", href: "/events?medium=Explore", align: "start", offset: "ml-0 md:ml-2 lg:ml-6", rotate: 2, num: "06", weave: "right" },
  { word: "PLAY", variant: "play", href: "/events?medium=Play", align: "end", offset: "mr-2 md:mr-16 lg:mr-28", rotate: 2.5, num: "07", weave: "left" },
];

export default function MediumsSpread() {
  return (
    <section className="relative max-w-content mx-auto px-6 md:px-10">
      <div className="relative flex flex-col items-center pb-8 md:pb-12">
        <motion.p
          initial={{ opacity: 0, y: -26, rotate: -3 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative z-10 text-center text-xs tracking-wideish text-ink/70 font-semibold uppercase"
        >
          seven ways to dive in
          {/* This full stop leaves the headline and becomes the ball. */}
          <span data-ball-start className="text-tiger transition-opacity duration-200">
            .
          </span>
        </motion.p>
        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 0.5 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-2 h-px w-10 bg-tiger origin-center"
        />
      </div>

      {words.map((w, i) => (
        <motion.div
          key={w.word}
          initial={{ opacity: 0, y: 24, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: w.rotate }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`relative flex items-center gap-4 md:gap-6 py-4 md:py-7 ${
            w.align === "start" ? "justify-start" : w.align === "end" ? "justify-end" : "justify-center"
          } ${w.offset} ${i % 2 === 1 ? "md:mt-2" : "md:-mt-2"}`}
          style={{ transformOrigin: w.align === "end" ? "right center" : "left center" }}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute top-1/2 h-px w-px ${
              w.weave === "right" ? "right-[8%]" : "left-[8%]"
            }`}
          />

          {w.align !== "end" && (
            <span className="font-mono text-xs text-ink/30 hidden sm:block">{w.num}</span>
          )}
          <MediumWord word={w.word} variant={w.variant} href={w.href} />
          {w.align === "end" && (
            <span className="font-mono text-xs text-ink/30 hidden sm:block">{w.num}</span>
          )}
        </motion.div>
      ))}
    </section>
  );
}
