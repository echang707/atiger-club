"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { memories } from "@/lib/events";

// The hero postcard is Bite Club #01 — the event that started it all.
const hero = memories[0];

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
    image: memories[3].image,
    alt: `${memories[3].title} — ${memories[3].location}`,
    caption: "somehow we became a running club",
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
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-40 md:py-56 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-block"
        >
          {/* Where the ball comes to rest — low and left of centre, on the
              table in the photograph. */}
          <span
            data-ball-end
            aria-hidden="true"
            className="pointer-events-none absolute left-[38%] top-[68%] h-px w-px"
          />
          <div className="photo-frame -rotate-2 inline-block relative">
            <div className="relative w-[78vw] max-w-md aspect-[4/5] overflow-hidden">
              <Image
                src={hero.image}
                alt={`${hero.title} — ${hero.location}`}
                fill
                sizes="80vw"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        <div className="relative">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="annotation relative z-10 text-3xl md:text-4xl mt-16 md:mt-20"
          >
            {/* "connected" is a stripe anchor: the line aims for that
                word specifically, then breaks cleanly behind it and picks
                up on the far side as a new mark. It never paints over the
                word — the word is the reason the line is there. */}
            <span>&ldquo;A meaningful life is a life</span>{" "}
            <span className="relative">
              connected
            </span>{" "}
            <span>to others.&rdquo;</span>
          </motion.p>
        </div>
      </div>

      <div className="h-[28vh] md:h-[36vh]" />

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
