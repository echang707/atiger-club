"use client";

import { motion } from "framer-motion";
import MediumWord from "./MediumWord";

const words: {
  word: string;
  variant: "eat" | "create" | "move" | "explore" | "serve" | "learn";
  href: string;
  align: "left" | "center" | "right";
  num: string;
}[] = [
  { word: "EAT", variant: "eat", href: "/events?medium=Eat", align: "left", num: "01" },
  { word: "CREATE", variant: "create", href: "/events?medium=Create", align: "right", num: "02" },
  { word: "MOVE", variant: "move", href: "/events?medium=Move", align: "left", num: "03" },
  { word: "EXPLORE", variant: "explore", href: "/events?medium=Explore", align: "right", num: "04" },
  { word: "SERVE", variant: "serve", href: "/events?medium=Serve", align: "left", num: "05" },
  { word: "LEARN", variant: "learn", href: "/events?medium=Learn", align: "right", num: "06" },
];

export default function MediumsSpread() {
  return (
    <section className="relative max-w-content mx-auto px-6 md:px-10">
      <p className="text-center text-xs tracking-wideish text-ink/35 uppercase pb-6 md:pb-10">
        six ways in — hover, then click
      </p>

      {words.map((w) => (
        <motion.div
          key={w.word}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`py-10 md:py-16 flex items-center gap-4 md:gap-6 ${
            w.align === "left"
              ? "justify-start"
              : w.align === "right"
              ? "justify-end"
              : "justify-center"
          }`}
        >
          {w.align !== "right" && (
            <span className="font-mono text-xs text-ink/30 hidden sm:block">{w.num}</span>
          )}
          <MediumWord word={w.word} variant={w.variant} href={w.href} />
          {w.align === "right" && (
            <span className="font-mono text-xs text-ink/30 hidden sm:block">{w.num}</span>
          )}
        </motion.div>
      ))}
    </section>
  );
}
