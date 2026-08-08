"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TigerEvent, categories } from "@/lib/events";

export default function EventCard({ event, index }: { event: TigerEvent; index: number }) {
  const meta = categories.find((c) => c.name === event.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-stone">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
          className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute top-4 left-4 text-xs font-medium bg-ivory/90 backdrop-blur px-3 py-1.5 rounded-full text-ink">
          {meta?.emoji} {event.category}
        </span>
      </div>

      <div className="pt-5 flex flex-col gap-1.5">
        <h3 className="font-display text-xl text-ink leading-snug">{event.title}</h3>
        <p className="text-sm text-ink/60">
          {event.date} · {event.time} · {event.location}
        </p>
        <p className="text-sm text-ink/70 mt-1 leading-relaxed">{event.description}</p>

        <button className="mt-4 self-start text-sm font-medium underline-stripe text-ink">
          RSVP
        </button>
      </div>
    </motion.article>
  );
}
