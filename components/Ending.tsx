"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import GoWild from "./GoWild";

/* ---------------------------------------------------------------------
   The closing moment: "Go mild." becomes "Go wild." The two tiger
   friends walk in under the m, gold boosts orange onto its shoulders,
   they hoist the letter up, flip it over in the air and set it back
   down as a w, exactly in its place (components/GoWild.tsx).
   --------------------------------------------------------------------- */

export default function Ending() {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // once:false — the hoist replays every time you scroll back to it.
  const inView = useInView(ref, { once: false, amount: 0.35 });
  // Bumping a run counter and keying the animating nodes off it restarts
  // the keyframes cleanly on each re-entry.
  const [runs, setRuns] = useState(0);
  useEffect(() => {
    if (inView) setRuns((r) => r + 1);
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden flex items-center min-h-[64vh] md:min-h-[74vh] pt-6 md:pt-8 pb-16 sm:pb-16"
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
                     pb-[1.02em]
                     text-[12.5vw] leading-[0.94]
                     sm:text-[10vw]
                     md:text-[8vw] md:leading-[0.88]
                     lg:text-[7.3vw]"
        >
          {/* the visible line is animated (the tigers turn the m of "mild"
              into a w), so the plain sentence is given here for crawlers
              and screen readers */}
          <span className="sr-only">Life&rsquo;s happening. Go wild.</span>
          <span aria-hidden="true">
            Life&rsquo;s happening.
            <br />
            <GoWild run={runs} reduced={reduced} />
          </span>
        </motion.h2>

        <motion.a
          href="/experiences"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="organic-underline relative z-10 mt-2 md:mt-4 inline-block
                     font-mono text-[11px] md:text-xs tracking-wideish uppercase
                     text-ink hover:text-tiger-text transition-colors"
        >
          see what&rsquo;s happening →
        </motion.a>
      </div>
    </section>
  );
}
