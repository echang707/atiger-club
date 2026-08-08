"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { memories } from "@/lib/events";

// The hero postcard is Bite Club #01 — the event that started it all.
const hero = memories[0];

// The scatter of postcards pulls real Tiger Club gatherings — each caption
// is the same note that goes with that specific photo, so they always match.
const scatter = [
  { rotate: -5, x: 4, y: 4, w: 24, memory: memories[1], caption: "traded sketchbooks for phone numbers" },
  { rotate: 3, x: 34, y: 0, w: 26, memory: memories[2], caption: "screamed at one shared screen, way too loud" },
  { rotate: -4, x: 66, y: 6, w: 26, memory: memories[3], caption: "ran badly together, finished together" },
  { rotate: 6, x: 14, y: 44, w: 24, memory: memories[4], caption: "gloves on, trash bags full, pizza after" },
  { rotate: -6, x: 46, y: 48, w: 26, memory: memories[5], caption: "raced badly, cheered loudly, stayed anyway" },
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
          <div className="photo-frame -rotate-2 inline-block">
            <div className="relative w-[78vw] max-w-md aspect-[4/5]">
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

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="annotation text-3xl md:text-4xl mt-10"
        >
          &ldquo;We sat down as strangers. Nobody wanted to be the first to leave.&rdquo;
        </motion.p>
      </div>

      <div className="h-[24vh] md:h-[32vh]" />

      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="font-display italic text-3xl md:text-5xl text-ink/85 leading-tight"
        >
          some of them aren&rsquo;t strangers anymore.
        </motion.p>
      </div>

      <div className="h-[10vh] md:h-[14vh]" />

      <div className="relative max-w-content mx-auto px-6 md:px-10">
        <div className="relative w-full" style={{ paddingBottom: "78%" }}>
          {scatter.map((p, i) => (
            <motion.div
              key={p.memory.id}
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: p.rotate }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="absolute photo-frame"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%` }}
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={p.memory.image}
                  alt={`${p.memory.title} — ${p.memory.location}`}
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>
              <span className="annotation absolute bottom-1 left-3 text-lg text-jungle/80">
                {p.caption}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
