"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import QuoteTail from "./QuoteTail";

// The scatter of postcards pulls real Tiger Club gatherings — each caption
// stays true to that specific photo's own note, so the words and the
// image always describe the same moment. Only the running shot is a
// holdover from the old set; the rest are the new photography.
const scatter = [
  {
    rotate: -5, x: 4, y: 4, w: 24,
    image: "/images/create-mural.jpg",
    alt: "Tiger Club members painting a mural together",
    caption: "left our mark",
  },
  {
    rotate: 3, x: 34, y: 0, w: 26,
    image: "/images/eat-dinner.jpg",
    alt: "Tiger Club dinner with wine and shared plates",
    caption: "we needed a bigger table",
  },
  {
    rotate: -4, x: 66, y: 6, w: 26,
    // Was memories[3], whose image is a remote Unsplash URL that returns
    // 403 — it rendered as an empty frame. This is the Bite Club photo,
    // local and reliable, freed up when the hero postcard was removed.
    image: "/images/bite-club-01.jpeg",
    alt: "Tiger Club members around a long dinner table",
    caption: "one table was never going to be enough",
  },
  {
    rotate: 6, x: 14, y: 44, w: 24,
    image: "/images/serve-treeplanting.jpg",
    alt: "Tiger Club members planting a tree together",
    caption: "good day to get lost",
  },
  {
    rotate: -6, x: 46, y: 48, w: 26,
    image: "/images/explore-festival.jpg",
    alt: "Tiger Club exploring a cultural festival crowd",
    caption: "right place, right time",
  },
];

export default function ScrollStory() {
  return (
    <section className="relative">
      {/* ---------------------------------------------------------------
          The quiet beat.

          This used to be a photograph with a line underneath it, which
          put two photo-heavy sections back to back. It is now a pure
          typographic spread: no images, a lot of cream, and the quote
          carrying the whole viewport.

          Deliberately not a centred inspirational card — the lines are
          left-hung and stepped, the quote mark hangs out into the margin,
          and the attribution sits far right on its own rule. The page
          rhythm this creates is: what we do → why it matters → what it
          feels like.
          --------------------------------------------------------------- */}
      <div className="max-w-content mx-auto px-6 md:px-10 pt-32 md:pt-48 pb-28 md:pb-40">
        <figure className="relative">
          {/* the mark hangs into the left margin, cropped by the gutter */}
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1 }}
            className="pointer-events-none absolute -left-2 md:-left-10 -top-10 md:-top-20 select-none font-display leading-none text-tiger/20 text-[26vw] md:text-[13vw]"
          >
            &ldquo;
          </motion.span>

          <blockquote className="relative">
            {[
              { text: "The good life", indent: "md:ml-0" },
              { text: "is built with", indent: "md:ml-[12%]" },
              { text: "good relationships.", indent: "md:ml-[6%]", mark: true },
            ].map((line, i) => (
              <motion.p
                key={line.text}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                transition={{
                  duration: 0.85,
                  delay: i * 0.13,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`font-display text-ink tracking-tight leading-[0.98] text-[11vw] md:text-[6.4vw] lg:text-[5.6vw] ${line.indent}`}
              >
                {line.mark ? (
                  <span className="relative inline-block">
                    {line.text}
                    {/* one restrained hand-drawn mark, drawn after the
                        last line lands */}
                    <QuoteTail />
                  </span>
                ) : (
                  line.text
                )}
              </motion.p>
            ))}
          </blockquote>

          {/* attribution: small, far right, on its own hairline */}
          <motion.figcaption
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-14 md:mt-20 flex justify-end"
          >
            <span className="border-t border-ink/25 pt-3 text-right">
              <span className="block font-mono text-[11px] tracking-wideish uppercase text-ink">
                Robert Waldinger
              </span>
              <span className="mt-1 block font-mono text-[10px] tracking-wideish uppercase text-ink/55">
                Harvard Study of Adult Development
              </span>
            </span>
          </motion.figcaption>
        </figure>
      </div>

      <div className="h-[10vh] md:h-[16vh]" />

      <div className="max-w-2xl mx-auto px-6 text-center relative">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="font-display italic text-3xl md:text-5xl text-ink/85 leading-tight relative z-10"
        >
          made for the moments that become something more.
        </motion.p>
      </div>

      <div className="h-[10vh] md:h-[14vh]" />

      <div className="relative max-w-content mx-auto px-6 md:px-10">
        <div className="relative w-full" style={{ paddingBottom: "78%" }}>
          {scatter.map((p, i) => (
            <motion.div
              key={p.image}
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: p.rotate }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="absolute photo-frame"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%` }}
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>
              {/* On phones each polaroid is ~95px wide, so a caption can only wrap
                  into an unreadable column — the scatter reads as a collage
                  there instead. Captions return from sm up. */}
              <span className="annotation hidden sm:block px-3 pt-2 text-sm md:text-base leading-tight text-jungle/80 truncate">
                {p.caption}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
