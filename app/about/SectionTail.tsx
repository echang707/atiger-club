"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ---------------------------------------------------------------------
   The tiger tail that runs down the right of the principles.

   A tiger tail coiled as a DNA helix, with bonds running between the
   turns. This is the supplied artwork, keyed out to a transparent
   background. Every drawn version was a compromise: strokes and rungs can
   suggest a coil, but never the fur, the taper or the black tip.

   It still reveals with a downward sweep and drifts gently on scroll,
   which is what tied it to the rest of the page.

   It is aligned to the principles' own column rather than to the section,
   which is full-bleed — see the note on the wrapper below.
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
      className="pointer-events-none absolute inset-0 hidden select-none md:block"
    >
      {/* The section is full-bleed but the principles are not: they sit in
          a `max-w-content` (1400px) column with the same px-6/md:px-10
          gutter as the rest of the page. Anchoring the tail to the SECTION
          pinned it to the viewport's right edge, so on anything wider than
          1400px it drifted away from the text entirely. Repeating the
          column here — same max-width, same centring, same gutter — puts
          the tail's right edge exactly on the principles' right edge, so
          the two share an alignment however wide the window gets.

          --tail-inset is the manual knob, 0 by default. At 0 the tail's
          right gutter matches the text's left gutter exactly — the page
          reads symmetrically. Set it (on this element, or on any ancestor)
          to push the tail further in from the right if it wants more air:
          `style={{ "--tail-inset": "48px" }}`. */}
      <div className="mx-auto h-full max-w-content px-6 md:px-10">
        <motion.div
          style={{ y, marginRight: "var(--tail-inset, 0px)" }}
          initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
          whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
          className="ml-auto h-full w-[26%]"
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
    </div>
  );
}
