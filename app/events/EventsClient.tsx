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

  // Group in chronological order (the source data is already ordered)
  // under month headers, labeling whichever group matches the current
  // real-world month as "This Month" so the page always opens on what's
  // happening now, then rolls into the months after it.
  const groups: { label: string; items: typeof filtered }[] = [];
  const thisMonthAbbr = new Date().toLocaleString("en-US", { month: "short" }).toUpperCase();
  for (const event of filtered) {
    const last = groups[groups.length - 1];
    if (last && last.items[0]?.month === event.month) {
      last.items.push(event);
    } else {
      const label =
        event.month === thisMonthAbbr
          ? "This Month"
          : new Date(`${event.month} 1, 2026`).toLocaleString("en-US", { month: "long" });
      groups.push({ label, items: [event] });
    }
  }

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
          {groups.map((group, gi) => (
            <div key={`${gi}-${group.label}`} className="mb-10 md:mb-14 last:mb-0">
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`font-mono text-xs tracking-wideish uppercase mb-2 ${
                  group.label === "This Month" ? "text-tiger" : "text-ink/40"
                }`}
              >
                {group.label}
              </motion.h2>
              {group.items.map((event, i) => (
                <EventRow key={event.id} event={event} index={gi * 10 + i} />
              ))}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-ink/50 text-sm mt-10">Nothing in this category yet — check back soon.</p>
        )}
      </div>
    </main>
  );
}
