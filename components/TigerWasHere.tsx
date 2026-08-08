"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { memories } from "@/lib/events";

export default function TigerWasHere() {
  const [active, setActive] = useState<string | null>(null);
  const activeMemory = memories.find((m) => m.id === active);

  return (
    <section id="was-here" className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mb-12 md:mb-16 max-w-lg"
      >
        <h2 className="font-display text-4xl md:text-6xl text-ink leading-[0.95]">
          TIGER CLUB<br />WAS HERE
        </h2>
        <p className="text-ink/55 text-sm md:text-base mt-4">
          A living archive. Every dot is a real night, a real place, a real group of people who showed up.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-[1.4fr,1fr] gap-8 md:gap-14 items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[5/4] bg-paper-dim rounded-sm overflow-hidden border border-ink/10"
        >
          <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
            <path d="M0,20 L100,26" stroke="#15130E" strokeWidth="0.3" />
            <path d="M0,45 L100,40" stroke="#15130E" strokeWidth="0.3" />
            <path d="M20,0 L26,80" stroke="#15130E" strokeWidth="0.3" />
            <path d="M60,0 L54,80" stroke="#15130E" strokeWidth="0.3" />
            <path d="M0,60 L100,66" stroke="#15130E" strokeWidth="0.2" />
            <path d="M40,0 L44,80" stroke="#15130E" strokeWidth="0.2" />
          </svg>

          {memories.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              aria-label={m.title}
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  active === m.id ? "bg-tiger scale-150" : "bg-ink/50 group-hover:bg-tiger group-hover:scale-125"
                }`}
              />
              <span className="absolute inset-0 rounded-full bg-tiger/30 animate-ping" style={{ animationDuration: "2.4s" }} />
            </button>
          ))}

          <span className="absolute bottom-3 left-3 text-[10px] tracking-wideish uppercase text-ink/35">
            Atlanta, GA — abstracted
          </span>
        </motion.div>

        <div className="min-h-[260px]">
          <AnimatePresence mode="wait">
            {activeMemory ? (
              <motion.div
                key={activeMemory.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden mb-5">
                  <Image src={activeMemory.image} alt={activeMemory.title} fill sizes="(max-width: 768px) 90vw, 420px" className="object-cover" />
                </div>
                <p className="font-mono text-xs tracking-wideish text-tiger">{activeMemory.title}</p>
                <p className="font-display text-2xl text-ink mt-1">{activeMemory.location}</p>
                <p className="text-sm text-ink/50 mt-1">{activeMemory.date}</p>
                <p className="text-sm text-ink/50">{activeMemory.attendees}</p>
                <p className="annotation text-xl text-jungle mt-3">{activeMemory.note}</p>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-ink/40 text-sm mt-6"
              >
                click a dot on the map.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
