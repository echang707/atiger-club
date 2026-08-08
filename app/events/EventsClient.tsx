"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { events, categories, Category } from "@/lib/events";
import EventCard from "@/components/EventCard";

export default function EventsClient() {
  const [active, setActive] = useState<Category | "All">("All");

  const filtered =
    active === "All" ? events : events.filter((e) => e.category === active);

  return (
    <main className="pt-32 md:pt-40 pb-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl mb-12 md:mb-16"
        >
          <span className="stripe-mark text-amber-deep mb-4">
            <span></span><span></span><span></span>
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-ink mt-3 leading-tight">
            Experiences worth sharing.
          </h1>
          <p className="text-ink/60 mt-3">
            Browse what&rsquo;s happening around the city — pick what pulls you in.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2.5 mb-12 md:mb-16">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
          {filtered.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-ink/50 text-sm mt-10">
            Nothing in this category yet — check back soon.
          </p>
        )}
      </div>
    </main>
  );
}
