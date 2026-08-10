"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { events } from "@/lib/events";
import EventRow from "./EventRow";

export default function UpcomingRows() {
  const preview = events.slice(0, 5);

  return (
    <section className="relative max-w-content mx-auto px-6 md:px-10 py-24 md:py-32">
      {/* One large quiet zone under the whole heading + list, rather than
          one per row — this reads as a text-heavy block, so it gets a
          calm surface throughout while the marble stays rich in the
          section's own margins outside max-content. */}
      <div
        aria-hidden="true"
        className="quiet-zone absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[112%] sm:w-[106%] h-[130%]"
      />

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 font-display text-4xl md:text-6xl text-ink mb-12 md:mb-16"
      >
        what are you doing this week?
      </motion.h2>

      <div className="relative z-10">
        {preview.map((event, i) => (
          <EventRow key={event.id} event={event} index={i} />
        ))}
      </div>

      <Link
        href="/events"
        className="relative z-10 inline-block mt-10 text-sm font-medium organic-underline text-ink/70 hover:text-ink"
      >
        see everything coming up →
      </Link>
    </section>
  );
}
