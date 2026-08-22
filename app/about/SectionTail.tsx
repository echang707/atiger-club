"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ---------------------------------------------------------------------
   The tiger tail that runs down the right of the principles.

   This replaces the drawn double helix. Every version of that was a
   compromise: strokes and rungs can suggest a coil, but they never
   carried the fur, the taper or the black tip that make it read as an
   actual tail. This is the supplied artwork, cut out with a transparent
   background, so it needs none of that faking.

   It still reveals with a downward sweep and drifts gently on scroll,
   which is what tied it to the rest of the page.
   --------------------------------------------------------------------- */

export default function SectionTail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [26, -26]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[26%] select-none md:block"
    >
      <motion.div
        style={{ y }}
        initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
        whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full"
      >
        {/* `contain` + right alignment: the tail keeps its own proportions
            whatever height the section ends up, instead of being squashed
            like the old preserveAspectRatio="none" svg. */}
        <div
          className="h-full w-full"
          style={{
            backgroundImage: 'url("/images/tiger-tail-strand.webp")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "right center",
          }}
        />
      </motion.div>
    </div>
  );
}
