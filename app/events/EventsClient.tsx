"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { events, categories, Category } from "@/lib/events";
import EventFeature from "@/components/EventFeature";
import EventRow from "@/components/EventRow";

export default function EventsClient() {
  const [active, setActive] = useState<Category | "All">("All");

  const [featured, ...rest] = events;
  const filteredRest =
    active === "All" ? rest : rest.filter((e) => e.category === active);

  return (
    <main className="pt-28 md:pt-32 pb-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 md:mb-14"
        >
          <h1 className="font-display text-4xl md:text-6xl text-ink leading-tight">
            Gather. Connect. Belong.
          </h1>
          <p className="text-ink/60 mt-3 max-w-md">
            Real Tiger Club experiences happening around Atlanta — pulled straight from what&rsquo;s on the calendar.
          </p>
        </motion.div>

        <div className="mb-14 md:mb-20">
          <EventFeature event={featured} />
        </div>

        <div className="flex flex-wrap gap-2.5 mb-4">
          <button
            onClick={() => setActive("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              active === "All"
                ? "bg-ink text-ivory"
                : "bg-stone text-ink/70 hover:bg-stone-dark"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setActive(c.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                active === c.name
                  ? "bg-ink text-ivory"
                  : "bg-stone text-ink/70 hover:bg-stone-dark"
              }`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>

        <div>
          {filteredRest.map((event, i) => (
            <EventRow key={event.id} event={event} index={i} />
          ))}
        </div>

        {filteredRest.length === 0 && (
          <p className="text-ink/50 text-sm py-16 border-t border-stone-dark">
            Nothing on the calendar in this category yet — check back soon, or explore another category.
          </p>
        )}
      </div>
    </main>
  );
}
