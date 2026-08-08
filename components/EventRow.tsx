"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TigerEvent, categories } from "@/lib/events";

const badgeLabel: Record<TigerEvent["badge"], string> = {
  Original: "🐯 Tiger Club Original",
  Partner: "🤝 Co-Hosted",
  Promoted: "⭐ We're Promoting",
};

export default function EventRow({
  event,
  index,
}: {
  event: TigerEvent;
  index: number;
}) {
  const meta = categories.find((c) => c.name === event.category);
  const wide = index % 3 === 0;

  return (
    <motion.a
      href={event.ctaUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex flex-col md:flex-row gap-6 md:gap-10 items-start py-10 border-t border-stone-dark ${
        wide ? "" : ""
      }`}
    >
      <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-1 md:w-24 shrink-0">
        <div className="font-display text-4xl md:text-5xl text-ink leading-none">
          {event.day}
        </div>
        <div className="text-xs uppercase tracking-[0.15em] text-ink/50">
          {event.weekday} · {event.month}
        </div>
      </div>

      <div
        className={`relative shrink-0 overflow-hidden rounded-2xl bg-stone w-full md:w-auto ${
          wide ? "md:w-[320px] aspect-[16/10]" : "md:w-[220px] aspect-[4/3]"
        }`}
      >
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 90vw, 320px"
          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
          <span className="text-xs font-medium bg-stone px-3 py-1 rounded-full text-ink/70">
            {meta?.emoji} {event.category}
          </span>
          <span className="text-xs text-ink/40">{badgeLabel[event.badge]}</span>
        </div>

        <h3 className="font-display text-2xl md:text-3xl text-ink leading-snug mb-2 group-hover:text-rust transition-colors duration-300">
          {event.title}
        </h3>

        <p className="text-sm text-ink/60 mb-3">
          {event.time} · {event.location}
        </p>

        <p className="text-sm text-ink/70 leading-relaxed max-w-xl mb-4">
          {event.description}
        </p>

        <span className="inline-flex items-center gap-1.5 text-sm font-medium underline-stripe text-ink">
          {event.ctaLabel} ↗
        </span>
      </div>
    </motion.a>
  );
}
