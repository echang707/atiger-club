"use client";

import { motion } from "framer-motion";
import MediumWord from "./MediumWord";

const words: {
  word: string;
  variant: "eat" | "create" | "move" | "explore" | "serve" | "learn";
  href: string;
  align: "start" | "center" | "end";
  offset: string;
  rotate: number;
  num: string;
}[] = [
  { word: "EAT", variant: "eat", href: "/events?medium=Eat", align: "start", offset: "md:ml-2 lg:ml-6", rotate: -3, num: "01" },
  { word: "CREATE", variant: "create", href: "/events?medium=Create", align: "end", offset: "md:mr-10 lg:mr-24", rotate: 2, num: "02" },
  { word: "MOVE", variant: "move", href: "/events?medium=Move", align: "center", offset: "md:-ml-12 lg:-ml-20", rotate: -2, num: "03" },
  { word: "EXPLORE", variant: "explore", href: "/events?medium=Explore", align: "start", offset: "md:ml-20 lg:ml-36", rotate: 3, num: "04" },
  { word: "SERVE", variant: "serve", href: "/events?medium=Serve", align: "end", offset: "md:mr-4 lg:mr-10", rotate: -2, num: "05" },
  { word: "LEARN", variant: "learn", href: "/events?medium=Learn", align: "center", offset: "md:ml-14 lg:ml-24", rotate: 2, num: "06" },
];

export default function MediumsSpread() {
  return (
    <section className="relative max-w-content mx-auto px-6 md:px-10">
      <p className="text-center text-xs tracking-wideish text-ink/35 uppercase pb-8 md:pb-12">
        six ways to dive in
      </p>

      {words.map((w, i) => (
        <motion.div
          key={w.word}
          initial={{ opacity: 0, y: 24, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: w.rotate }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`flex items-center gap-4 md:gap-6 py-7 md:py-12 ${
            w.align === "start" ? "justify-start" : w.align === "end" ? "justify-end" : "justify-center"
          } ${w.offset} ${i % 2 === 1 ? "md:mt-2" : "md:-mt-2"}`}
          style={{ transformOrigin: w.align === "end" ? "right center" : "left center" }}
        >
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
