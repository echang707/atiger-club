"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TigerEvent, categories } from "@/lib/events";

export default function EventFeature({ event }: { event: TigerEvent }) {
  const meta = categories.find((c) => c.name === event.category);

  return (
    <motion.a
      href={event.ctaUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block w-full h-[70vh] md:h-[85vh] rounded-3xl overflow-hidden"
    >
      <Image
        src={event.image}
        alt={event.title}
        fill
        priority
        sizes="100vw"
        className="object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />

      <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-3">
        <span className="text-xs font-medium bg-ivory/90 backdrop-blur px-3 py-1.5 rounded-full text-ink">
          {meta?.emoji} {event.category}
        </span>
        <span className="text-xs font-medium text-ivory/80 uppercase tracking-wide">
          Next up
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex items-end gap-5">
          <div className="text-ivory leading-none">
            <div className="font-display text-6xl md:text-8xl tracking-tightest">
              {event.day}
            </div>
            <div className="text-sm md:text-base uppercase tracking-[0.2em] mt-1 text-ivory/70">
              {event.weekday} · {event.month}
            </div>
          </div>
          <div className="max-w-lg">
            <h2 className="font-display text-2xl md:text-4xl text-ivory leading-tight mb-2">
              {event.title}
            </h2>
            <p className="text-ivory/70 text-sm md:text-base">{event.location}</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 bg-amber text-ink text-sm font-medium px-6 py-3 rounded-full self-start md:self-auto group-hover:bg-ivory transition-colors duration-300 shrink-0">
          {event.ctaLabel} ↗
        </span>
      </div>
    </motion.a>
  );
}
