"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { upcomingEvents } from "@/lib/events";
import EventRow from "./EventRow";

export default function UpcomingRows() {
  // Only events still ahead of today, soonest first. This block used to
  // slice the first five entries in the file regardless of date.
  const preview = upcomingEvents().slice(0, 5);

  return (
    <section className="relative max-w-content mx-auto px-6 md:px-10 pt-24 md:pt-32 pb-10 md:pb-12">
      {/* No quiet zone here any more. This is the most text-heavy block
          on the page, so it now sits on plain cream — the marble simply
          isn't behind it. Readability by absence rather than by scrim. */}

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
        className="relative z-10 inline-block mt-10 text-[15px] font-semibold organic-underline text-ink hover:text-tiger-text"
      >
        see everything coming up →
      </Link>
    </section>
  );
}
