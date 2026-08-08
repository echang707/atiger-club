"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { events, mediums, Medium } from "@/lib/events";
import EventRow from "@/components/EventRow";

export default function EventsClient() {
  const params = useSearchParams();
  const [active, setActive] = useState<Medium | "All">("All");

  useEffect(() => {
    const m = params.get("medium") as Medium | null;
    if (m && mediums.some((x) => x.name === m)) setActive(m);
  }, [params]);

  const filtered = active === "All" ? events : events.filter((e) => e.medium === active);

  return (
    <main className="pt-28 md:pt-36 pb-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl mb-10 md:mb-14"
        >
          <h1 className="font-display text-4xl md:text-6xl text-ink leading-tight">
            what are you doing this week?
          </h1>
          <p className="text-ink/55 mt-3 text-sm md:text-base">
            everything Tiger Club is hosting, sorted by how you want to leave the house.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-12 md:mb-16">
          <button
            onClick={() => setActive("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              active === "All" ? "bg-ink text-paper" : "bg-paper-dim text-ink/70 hover:bg-ink/10"
            }`}
          >
            All
          </button>
          {mediums.map((m) => (
            <button
              key={m.name}
              onClick={() => setActive(m.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                active === m.name ? "bg-ink text-paper" : "bg-paper-dim text-ink/70 hover:bg-ink/10"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div>
          {filtered.map((event, i) => (
            <EventRow key={event.id} event={event} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-ink/50 text-sm mt-10">Nothing in this category yet — check back soon.</p>
        )}
      </div>
    </main>
  );
}
