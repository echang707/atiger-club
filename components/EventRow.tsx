"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { TigerEvent, eventSlug } from "@/lib/events";
import { useMember } from "@/components/club/MemberProvider";
import { toggleSavedEvent } from "@/lib/club/supabase";

/* The three kinds of Tiger Club event. */
const KIND = {
  original: {
    label: "Tiger Original",
    tone: "text-tiger-text",
    by: "with",
    blurb: "Created and hosted by Tiger Club.",
  },
  pick: {
    label: "Tiger Pick",
    tone: "text-tiger-text",
    by: "presented by",
    blurb:
      "Not hosted or organised by Tiger Club. We just think it\u2019s worth showing up for.",
  },
  collab: {
    label: "Tiger Collab",
    tone: "text-tiger-text",
    by: "with",
    blurb: "Co-created by Tiger Club and a partner.",
  },
} as const;

function SaveButton({
  eventId,
  initialSaved = false,
}: {
  eventId: string;
  initialSaved?: boolean;
}) {
  const { member } = useMember();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  if (!member) {
    /* Not logged in — prompt them to join instead of hiding the button,
       so they know membership gives them a personal events list. */
    return (
      <Link
        href={`/join?next=/experiences`}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 text-[12px] font-mono tracking-wideish uppercase text-ink/60 transition-colors hover:border-tiger-fill hover:text-tiger-text"
      >
        Save to your club
      </Link>
    );
  }

  async function toggle() {
    if (busy || !member) return;
    setBusy(true);
    const res = await toggleSavedEvent(member.id, eventId);
    if (res !== null) setSaved(res.saved);
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-mono tracking-wideish uppercase transition-colors disabled:opacity-60 ${
        saved
          ? "border-tiger-fill bg-tiger-fill text-white"
          : "border-ink/20 text-ink/60 hover:border-tiger-fill hover:text-tiger-text"
      }`}
    >
      {busy ? "…" : saved ? "Saved to your club ✓" : "Save to your club"}
    </button>
  );
}

// Truncate description to a sneak-preview length at a word boundary.
function preview(text: string, max = 115): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(" ", max);
  return text.slice(0, cut > 0 ? cut : max) + "…";
}

export default function EventRow({
  event,
  index,
  savedIds = [],
}: {
  event: TigerEvent;
  index: number;
  savedIds?: string[];
}) {
  const kind = event.kind ?? "original";
  const [open, setOpen] = useState(false);

  const primaryHref = event.partifulLink ?? event.link ?? null;
  const primaryLabel = event.partifulLink
    ? "RSVP on Partiful"
    : (event.linkLabel ?? "Learn More");

  // Dedicated event page URL — this is the main destination for the row click.
  const eventHref = `/experiences/${eventSlug(event)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-ink/10 group"
    >
      {/* Row: Link takes you to the event page; + button opens the preview */}
      <div className="relative flex items-center gap-5 md:gap-10 py-6 md:py-7">

        {/* ── Main clickable area → event page ── */}
        <Link
          href={eventHref}
          className="flex-1 flex items-center gap-5 md:gap-10 min-w-0 text-left"
        >
          <span className="font-mono text-xs md:text-sm text-ink/60 w-14 md:w-16 shrink-0">
            {event.month} {event.day}
          </span>

          <span className="flex-1 min-w-0">
            <span className="font-display text-xl md:text-3xl text-ink leading-snug block truncate group-hover:italic transition-all">
              {event.title}
            </span>
            <span className="text-xs md:text-sm text-ink/65">
              {event.time ? `${event.time} · ` : ""}
              {event.location} · {event.medium}
              {event.price ? ` · ${event.price}` : ""}
            </span>
            <span className={`mt-1 block font-mono text-[10px] tracking-wideish uppercase ${KIND[kind].tone}`}>
              {KIND[kind].label}
            </span>
            <span className="sr-only">{event.description}</span>
          </span>

          <span className="hidden sm:block relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500 ease-smooth">
            <Image src={event.image} alt={event.title} fill sizes="80px" className="object-cover" />
          </span>
        </Link>

        {/* ── + button: quick preview only ── */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close preview" : "Quick preview"}
          className={`shrink-0 w-7 h-7 flex items-center justify-center text-ink/40 text-xl transition-all duration-300 hover:text-ink/70 ${open ? "rotate-45" : ""}`}
        >
          +
        </button>
      </div>

      {/* ── Sneak-preview panel ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {/* Indent to align with the event title column */}
            <div className="pb-6 flex items-start gap-5 md:gap-10">
              {/* spacer matching the date column width */}
              <div className="w-14 md:w-16 shrink-0" aria-hidden="true" />

              <div className="flex-1 min-w-0 pb-2">
                {/* Short description — sneak peek only */}
                <p className="text-sm text-ink/65 leading-relaxed mb-4 max-w-sm">
                  {preview(event.description)}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  {primaryHref ? (
                    <a
                      href={primaryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-full bg-tiger-fill border-2 border-tiger-fill px-5 py-2.5 text-[13px] font-semibold leading-none text-white transition-colors hover:bg-tiger-deep hover:border-tiger-deep"
                    >
                      {primaryLabel}
                    </a>
                  ) : (
                    <a
                      href="https://discord.gg/6u83g4P8Cb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-full bg-tiger-fill border-2 border-tiger-fill px-5 py-2.5 text-[13px] font-semibold leading-none text-white transition-colors hover:bg-tiger-deep hover:border-tiger-deep"
                    >
                      RSVP on Discord
                    </a>
                  )}

                  <SaveButton
                    eventId={event.id}
                    initialSaved={savedIds.includes(event.id)}
                  />

                  <Link
                    href={eventHref}
                    className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 hover:text-tiger-text transition-colors"
                  >
                    Full details →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
