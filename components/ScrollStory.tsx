"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const scatter = [
  { rotate: -6, x: "2%", y: 0, w: "42%", tag: "07.16.26 · Tucker" },
  { rotate: 4, x: "34%", y: 60, w: "30%", tag: "korean bbq, 52 ppl" },
  { rotate: -3, x: "60%", y: -20, w: "34%", tag: "we ran out of tables" },
  { rotate: 7, x: "14%", y: 190, w: "26%", tag: "still talk to 3 of them" },
  { rotate: -8, x: "52%", y: 220, w: "32%", tag: "05.02.26" },
];

const photoUrls = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=900&auto=format&fit=crop",
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
                src={photoUrls[0]}
                alt="A crowded dinner table full of strangers"
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
          &ldquo;47 strangers had dinner here.&rdquo;
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

      <div className="h-[18vh] md:h-[22vh]" />

      <div className="relative max-w-content mx-auto px-6 md:px-10 h-[560px] md:h-[620px]">
        {scatter.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, rotate: 0 }}
            whileInView={{ opacity: 1, y: p.y, rotate: p.rotate }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="absolute photo-frame"
            style={{ left: p.x, width: p.w, top: 0 }}
          >
            <div className="relative w-full aspect-[4/5]">
              <Image
                src={photoUrls[(i + 1) % photoUrls.length]}
                alt="Candid Tiger Club moment"
                fill
                sizes="30vw"
                className="object-cover"
              />
            </div>
            <span className="annotation absolute -bottom-1 left-3 text-lg text-jungle/80">
              {p.tag}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
