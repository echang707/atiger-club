"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { events, mediums, cities, Medium } from "@/lib/events";
import EventRow from "@/components/EventRow";

// The event data carries "Sep 12"-style dates without a year.
const EVENT_YEAR = 2026;

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

  const matches = events.filter(
    (e) => (active === "All" || e.medium === active) && e.city === activeCity
  );

  // Only what's still to come belongs in the main list. Anything whose date
  // has passed moves to its own section further down, so the page opens on
  // what you can actually still turn up to.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const whenOf = (e: (typeof events)[number]) => new Date(`${e.date}, ${EVENT_YEAR}`);
  const filtered = matches.filter((e) => whenOf(e) >= startOfToday);
  const past = matches.filter((e) => whenOf(e) < startOfToday).reverse();

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
          <p className="text-ink/70 mt-3 text-sm md:text-base">
            everything Tiger Club is hosting, sorted by how you want to leave the house.
          </p>
        </motion.div>

        <div className="mb-8 md:mb-10 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] tracking-wideish uppercase text-ink/55 mr-1">
            city
          </span>
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCity(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeCity === c ? "bg-tiger-fill text-[#FFF7EF]" : "bg-paper-dim text-ink/80 hover:bg-ink/10"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="px-4 py-1.5 rounded-full text-sm font-medium text-ink/45 border border-dashed border-ink/15 cursor-default">
            more cities soon
          </span>
        </div>

        <div className="mb-12 md:mb-16">
          <button
            onClick={() => setActive("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 mb-4 ${
              active === "All" ? "bg-ink text-paper" : "bg-paper-dim text-ink/80 hover:bg-ink/10"
            }`}
          >
            All
          </button>

          {/* All seven mediums on a single row from `sm` up. Compact by design:
              small icon, small label, and the description lifted out to one
              shared line beneath the row rather than expanding each tile and
              pushing the list down the page. */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 md:gap-2">
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
                  className={`group relative flex flex-col items-center text-center gap-1 rounded-xl border px-1.5 py-2.5 transition-colors duration-300 ${
                    active === m.name
                      ? "border-tiger bg-tiger/[0.06]"
                      : "border-ink/10 bg-paper-dim/60 hover:border-ink/20 hover:bg-paper-dim"
                  }`}
                >
                  <motion.span
                    className="relative h-9 w-9 md:h-11 md:w-11 shrink-0"
                    animate={{ scale: expanded ? 1.1 : 1, rotate: expanded ? -4 : 0 }}
                    transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Image
                      src={m.icon}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-contain"
                    />
                  </motion.span>
                  <span
                    className={`font-display text-[12px] md:text-sm leading-none ${
                      active === m.name ? "text-tiger-text" : "text-ink"
                    }`}
                  >
                    {m.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* One shared line instead of seven expanding tiles. */}
          <p className="mt-3 min-h-[1.5rem] text-xs md:text-sm text-ink/70">
            {mediums.find((m) => m.name === (hoveredMedium ?? active))?.description ?? ""}
          </p>
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
                  group.label === "This Month" ? "text-tiger-text" : "text-ink/55"
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
          <p className="text-ink/70 text-sm mt-10">
            Nothing coming up in this category — check back soon.
          </p>
        )}

        {past.length > 0 && (
          <section className="mt-20 md:mt-28 border-t border-ink/10 pt-10 md:pt-14">
            <h2 className="font-mono text-xs tracking-wideish uppercase text-ink/55 mb-2">
              Already happened
            </h2>
            <p className="text-sm text-ink/70 mb-6 max-w-md">
              What the club got up to recently. Nothing here is bookable.
            </p>
            <div className="opacity-70">
              {past.map((event, i) => (
                <EventRow key={event.id} event={event} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
