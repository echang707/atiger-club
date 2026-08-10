"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { events } from "@/lib/events";
import EventRow from "./EventRow";

export default function UpcomingRows() {
  const preview = events.slice(0, 5);

  return (
    <section className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-4xl md:text-6xl text-ink mb-12 md:mb-16 text-shield"
      >
        what are you doing this week?
      </motion.h2>

      {/* The bottom edge of this list is the rule under the last event
          row — and it's where The Stripe finishes. Marking it here (as
          opposed to letting the line trail off into whitespace) means
          the stripe lands flush on an existing horizontal line in the
          layout instead of stopping in mid-air. Move the attribute to
          a different element to move the finish. */}
      <div data-stripe-end>
        {preview.map((event, i) => (
          <EventRow key={event.id} event={event} index={i} />
        ))}
      </div>

      <Link
        href="/events"
        className="inline-block mt-10 text-sm font-medium organic-underline text-ink/70 hover:text-ink"
      >
        see everything coming up →
      </Link>
    </section>
  );
}
