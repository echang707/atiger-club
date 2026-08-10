"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { events, mediums, cities, Medium } from "@/lib/events";
import EventRow from "@/components/EventRow";

export default function EventsClient() {
  const params = useSearchParams();
  const [active, setActive] = useState<Medium | "All">("All");
  const [activeCity, setActiveCity] = useState<string>(cities[0]);
  // Description only appears for whichever medium the visitor is currently
  // hovering — and stays pinned open for the one that's actively selected,
  // so at rest the grid is just icon + name.
  const [hoveredMedium, setHoveredMedium] = useState<Medium | null>(null);

  useEffect(() => {
    const m = params.get("medium") as Medium | null;
    if (m && mediums.some((x) => x.name === m)) setActive(m);
    const c = params.get("city");
    if (c && cities.includes(c)) setActiveCity(c);
  }, [params]);

  const filtered = events.filter(
    (e) => (active === "All" || e.medium === active) && e.city === activeCity
  );

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
          <h1 className="font-display text-4xl md:text-6xl text-ink leading-tight text-shield">
            what are you doing this week?
          </h1>
          <p className="text-ink/55 mt-3 text-sm md:text-base text-shield">
            everything Tiger Club is hosting, sorted by how you want to leave the house.
          </p>
        </motion.div>

        <div className="mb-8 md:mb-10 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] tracking-wideish uppercase text-ink/35 mr-1 text-shield">
            city
          </span>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCity(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeCity === c ? "bg-tiger text-paper" : "bg-paper-dim text-ink/70 hover:bg-ink/10"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="px-4 py-1.5 rounded-full text-sm font-medium text-ink/30 border border-dashed border-ink/15 cursor-default">
            more cities soon
          </span>
        </div>

        <div className="mb-12 md:mb-16">
          <button
            onClick={() => setActive("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 mb-4 ${
              active === "All" ? "bg-ink text-paper" : "bg-paper-dim text-ink/70 hover:bg-ink/10"
            }`}
          >
            All
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 md:gap-3">
            {mediums.map((m, i) => {
              const expanded = active === m.name || hoveredMedium === m.name;
              return (
                <motion.button
                  key={m.name}
                  onClick={() => setActive(active === m.name ? "All" : m.name)}
                  onMouseEnter={() => setHoveredMedium(m.name)}
                  onMouseLeave={() => setHoveredMedium((h) => (h === m.name ? null : h))}
                  onFocus={() => setHoveredMedium(m.name)}
                  onBlur={() => setHoveredMedium((h) => (h === m.name ? null : h))}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative flex flex-col items-center text-center gap-2 rounded-2xl border px-3 py-4 md:py-5 transition-colors duration-300 ${
                    active === m.name
                      ? "border-tiger bg-tiger/[0.06]"
                      : "border-ink/10 bg-paper-dim/60 hover:border-ink/20 hover:bg-paper-dim"
                  }`}
                >
                  <motion.span
                    className="relative h-14 w-14 md:h-16 md:w-16 shrink-0"
                    animate={{ scale: expanded ? 1.1 : 1, rotate: expanded ? -4 : 0 }}
                    transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Image
                      src={m.icon}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </motion.span>
                  <span
                    className={`font-display text-base md:text-lg leading-none text-shield ${
                      active === m.name ? "text-tiger" : "text-ink"
                    }`}
                  >
                    {m.name}
                  </span>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 2 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden text-[11px] md:text-xs leading-snug text-ink/50 text-shield"
                      >
                        {m.description}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          {groups.map((group, gi) => (
            <div key={`${gi}-${group.label}`} className="mb-10 md:mb-14 last:mb-0">
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`font-mono text-xs tracking-wideish uppercase mb-2 text-shield ${
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
          <p className="text-ink/50 text-sm mt-10 text-shield">Nothing in this category yet — check back soon.</p>
        )}
      </div>
    </main>
  );
}
