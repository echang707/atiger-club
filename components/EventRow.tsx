"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { TigerEvent } from "@/lib/events";

/* The three kinds of Tiger Club event, and how each is labelled. */
const KIND = {
  original: {
    label: "Tiger Original",
    tone: "text-tiger-text",
    by: "with",
    blurb: "Created and hosted by Tiger Club.",
  },
  pick: {
    label: "Tiger Pick",
    tone: "text-tiger-text",
    by: "presented by",
    blurb: "Not hosted or organised by Tiger Club — we just think it\u2019s worth showing up for.",
  },
  collab: {
    label: "Tiger Collab",
    tone: "text-tiger-text",
    by: "with",
    blurb: "Co-created by Tiger Club and a partner.",
  },
} as const;

export default function EventRow({ event, index }: { event: TigerEvent; index: number }) {
  const kind = event.kind ?? "original";
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-ink/10 group"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-full flex items-center gap-5 md:gap-10 py-6 md:py-7 text-left"
      >
        <span className="font-mono text-xs md:text-sm text-ink/60 w-14 md:w-16 shrink-0">
          {event.month} {event.day}
        </span>

        <span className="flex-1 min-w-0">
          <span className="font-display text-xl md:text-3xl text-ink leading-snug block truncate group-hover:italic transition-all">
            {event.title}
          </span>
          <span className="text-xs md:text-sm text-ink/65">
            {event.location} · {event.medium}
          </span>
          {/* Every event carries its kind, so it is always clear whether
              Tiger Club made it, curated it, or built it with someone. */}
          <span className={`mt-1 block font-mono text-[10px] tracking-wideish uppercase ${KIND[kind].tone}`}>
            {KIND[kind].label}
          </span>
          {/* Full description stays in the DOM (visually hidden, not
              display:none) so it's readable by search engines and screen
              readers without needing the accordion to be opened. */}
          <span className="sr-only">{event.description}</span>
        </span>

        <span className="hidden sm:block relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500 ease-smooth">
          <Image src={event.image} alt={event.title} fill sizes="80px" className="object-cover" />
        </span>

        <span
          className={`shrink-0 text-ink/40 text-xl transition-transform duration-400 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 md:pb-10 flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="relative w-full md:w-64 aspect-[4/3] rounded-sm overflow-hidden shrink-0">
                <Image src={event.image} alt={event.title} fill sizes="(max-width: 768px) 90vw, 256px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="mb-3 font-mono text-[10px] tracking-wideish uppercase text-ink/55">
                  <span className={KIND[kind].tone}>{KIND[kind].label}</span>
                  {event.presentedBy && ` · ${KIND[kind].by} ${event.presentedBy}`}
                  <span className="block mt-1 normal-case tracking-normal text-[11px] text-ink/50">
                    {KIND[kind].blurb}
                  </span>
                </p>
                <p className="text-ink/70 leading-relaxed max-w-md">{event.description}</p>
                {event.link ? (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block text-sm font-medium organic-underline text-ink"
                  >
                    {event.linkLabel ?? "Learn More"}
                  </a>
                ) : (
                  <a
                    href="https://discord.gg/6u83g4P8Cb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block text-sm font-medium organic-underline text-ink"
                  >
                    RSVP on Discord
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
