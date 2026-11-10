"use client";

import { useState, useEffect, useId } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { events, mediums, cities, Medium } from "@/lib/events";
import { useMember } from "@/components/club/MemberProvider";
import { getSavedEventIds } from "@/lib/club/supabase";
import EventRow from "@/components/EventRow";

// The event data carries "Sep 12"-style dates without a year.
const EVENT_YEAR = 2026;

/* "Sep 12" + EVENT_YEAR → "2026-09-12", built from the date's own local
   parts so it means the same calendar day on the server and in the browser. */
function dayKey(date: string): string {
  const d = new Date(`${date}, ${EVENT_YEAR}`);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function ExperiencesClient({
  initialMedium,
  initialCity,
  today,
}: {
  /* Read from ?medium= / ?city= on the server (page.tsx), so the first
     render — server HTML and hydration alike — is already filtered. */
  initialMedium: Medium | "All";
  initialCity: string;
  /* Today in Atlanta, YYYY-MM-DD, decided once on the server so the
     server HTML and the browser agree on what's upcoming vs past. */
  today: string;
}) {
  const [showPast, setShowPast] = useState(false);
  const pastId = useId();
  const [active, setActive] = useState<Medium | "All">(initialMedium);
  const [activeCity, setActiveCity] = useState<string>(initialCity);
  // A medium's description shows for whichever pill is hovered, and stays
  // for the one that's selected.
  const [hoveredMedium, setHoveredMedium] = useState<Medium | null>(null);
  const { member } = useMember();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!member) { setSavedIds([]); return; }
    getSavedEventIds(member.id).then(setSavedIds);
  }, [member]);

  const selectedMedium = active === "All" ? null : mediums.find((m) => m.name === active) ?? null;

  const matches = events.filter(
    (e) => (active === "All" || e.medium === active) && e.city === activeCity
  );

  // Only what's still to come belongs in the main list. Anything whose date
  // has passed moves to its own section further down, so the page opens on
  // what you can actually still turn up to.
  // "YYYY-MM-DD" strings compare correctly as plain strings.
  // Sorted explicitly rather than trusting the order of lib/events.ts —
  // editing one event's date used to silently put the list out of sequence.
  const filtered = matches
    .filter((e) => dayKey(e.date) >= today)
    .sort((a, b) => dayKey(a.date).localeCompare(dayKey(b.date)));
  const past = matches
    .filter((e) => dayKey(e.date) < today)
    .sort((a, b) => dayKey(b.date).localeCompare(dayKey(a.date)));

  // Group in chronological order under month headers, labeling whichever group matches the current
  // real-world month as "This Month" so the page always opens on what's
  // happening now, then rolls into the months after it.
  const groups: { label: string; items: typeof filtered }[] = [];
  const thisMonthAbbr = new Date(`${today}T12:00:00`)
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
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
                activeCity === c ? "bg-tiger-fill text-[#FFFFFF]" : "bg-paper-dim text-ink/80 hover:bg-ink/10"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="px-4 py-1.5 rounded-full text-sm font-medium text-ink/45 border border-dashed border-ink/15 cursor-default">
            more cities soon
          </span>
        </div>

        {/* One row: All plus the seven mediums, in the same pill language as
            the city picker above, so the whole filter reads as two simple
            lines instead of a button and a separate icon grid. */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] tracking-wideish uppercase text-ink/55 mr-1">
              type
            </span>
            {(["All", ...mediums.map((m) => m.name)] as (Medium | "All")[]).map((name) => {
              const on = active === name;
              return (
                <button
                  key={name}
                  onClick={() => setActive(name === "All" || on ? "All" : name)}
                  onMouseEnter={() => name !== "All" && setHoveredMedium(name as Medium)}
                  onMouseLeave={() => setHoveredMedium((h) => (h === name ? null : h))}
                  onFocus={() => name !== "All" && setHoveredMedium(name as Medium)}
                  onBlur={() => setHoveredMedium((h) => (h === name ? null : h))}
                  aria-pressed={on}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                    on ? "bg-ink text-paper" : "bg-paper-dim text-ink/80 hover:bg-ink/10"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          {/* The selected medium's tiger, next to its one-line description.
              Only one, only once something is picked ("All" shows none), and
              it swaps with a small pop when the choice changes. Hovering
              another pill previews that pill's description. */}
          <div className="mt-4 flex min-h-[2.75rem] items-center gap-3">
            <AnimatePresence mode="wait">
              {selectedMedium && (
                <motion.span
                  key={selectedMedium.name}
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative h-11 w-11 shrink-0"
                >
                  <Image src={selectedMedium.icon} alt="" fill sizes="44px" className="object-contain" />
                </motion.span>
              )}
            </AnimatePresence>
            <p className="text-xs text-ink/60 md:text-sm">
              {mediums.find((m) => m.name === (hoveredMedium ?? active))?.description ?? ""}
            </p>
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
                className={`font-mono text-xs tracking-wideish uppercase mb-2 ${
                  group.label === "This Month" ? "text-tiger-text" : "text-ink/55"
                }`}
              >
                {group.label}
              </motion.h2>
              {group.items.map((event, i) => (
                <EventRow key={event.id} event={event} index={gi * 10 + i} savedIds={savedIds} />
              ))}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-ink/70 text-sm mt-10">
            Nothing coming up in this category — check back soon.
          </p>
        )}

        {/* Past events stay collapsed so what's actually bookable is the
            whole page until you ask for the archive. */}
        {past.length > 0 && (
          <section className="mt-12 md:mt-16 border-t border-ink/10 pt-8 md:pt-10">
            <button
              type="button"
              onClick={() => setShowPast((v) => !v)}
              aria-expanded={showPast}
              aria-controls={pastId}
              className="organic-underline font-mono text-[11px] md:text-xs tracking-wideish uppercase text-ink/70 hover:text-tiger-text transition-colors"
            >
              {showPast ? "hide past events" : `view past events (${past.length}) →`}
            </button>

            {/* Disclosure panel. The past list is always in the page (so
                each past event keeps a real link to its own page) but stays
                collapsed until asked for — same look and animation as
                before. While collapsed it is `inert`: not focusable, not
                clickable, and skipped by screen readers. */}
            <motion.div
              id={pastId}
              initial={false}
              animate={showPast ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
              style={showPast ? undefined : { height: 0, opacity: 0 }}
              // React 18 only forwards `inert` as a string attribute; the
              // newer types expect a boolean, hence the cast.
              {...(showPast ? {} : ({ inert: "" } as unknown as Record<string, never>))}
            >
              <div className="pt-6 opacity-65">
                {past.map((event, i) => (
                  <EventRow key={event.id} event={event} index={i} savedIds={savedIds} />
                ))}
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </main>
  );
}
