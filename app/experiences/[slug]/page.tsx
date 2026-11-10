import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { events, eventSlug, TigerEvent } from "@/lib/events";
import { SITE_URL } from "@/lib/seo";

// ─── helpers ─────────────────────────────────────────────────────────────────

const MONTHS: Record<string, string> = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

function toIsoDate(month: string, day: string, year = "2026") {
  const mm = MONTHS[month] ?? "01";
  const dd = day.padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function isPast(event: TigerEvent): boolean {
  const d = new Date(`${event.date}, 2026`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

function absoluteImage(src: string): string {
  return src.startsWith("http") ? src : `${SITE_URL}${src}`;
}

function findEvent(slug: string): TigerEvent | undefined {
  return events.find((e) => eventSlug(e) === slug);
}

// ─── static-params ───────────────────────────────────────────────────────────

export function generateStaticParams() {
  return events.map((e) => ({ slug: eventSlug(e) }));
}

// ─── metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = findEvent(params.slug);
  if (!event) return {};

  // Keep description under 160 chars; trim at a word boundary.
  const raw = event.description;
  const desc =
    raw.length > 155 ? raw.slice(0, raw.lastIndexOf(" ", 152)) + "…" : raw;

  const canonicalPath = `/experiences/${eventSlug(event)}`;
  const ogImage = absoluteImage(event.image);

  return {
    // The layout template appends " — Tiger Club", giving e.g.:
    // "Multicultural Friendsgiving — Tiger Club"
    title: event.title,
    description: desc,
    alternates: { canonical: canonicalPath },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonicalPath,
      title: event.title,
      description: desc,
      images: [{ url: ogImage, width: 1200, height: 900, alt: event.title }],
    },
  };
}

// ─── kind config ─────────────────────────────────────────────────────────────

const KIND = {
  original: {
    label: "Tiger Original",
    by: "with",
    blurb: "Created and hosted by Tiger Club.",
  },
  pick: {
    label: "Tiger Pick",
    by: "presented by",
    blurb:
      "Not hosted or organised by Tiger Club. We just think it's worth showing up for.",
  },
  collab: {
    label: "Tiger Collab",
    by: "with",
    blurb: "Co-created by Tiger Club and a partner.",
  },
} as const;

// ─── page ────────────────────────────────────────────────────────────────────

export default function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = findEvent(params.slug);
  if (!event) notFound();

  const past = isPast(event);
  const kind = event.kind ?? "original";
  const pageUrl = `${SITE_URL}/experiences/${eventSlug(event)}`;

  // CTA mirrors EventRow logic exactly.
  const primaryHref = event.partifulLink ?? event.link ?? null;
  const primaryLabel = event.partifulLink
    ? "RSVP on Partiful"
    : (event.linkLabel ?? "Learn More");

  // ── JSON-LD ──────────────────────────────────────────────────────────────
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    // Individual page URL is now the canonical identifier for this event.
    "@id": pageUrl,
    name: event.title,
    description: event.description,
    // Date-only ISO string; no machine-readable time is available from the
    // prose `time` field. The timezone is implicitly US Eastern (Atlanta).
    startDate: toIsoDate(event.month, event.day),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location,
      // `address` is the structured field when present; fall back to the
      // display location string so there is always some address signal.
      address: event.address ?? event.location,
    },
    organizer: {
      "@type": "Organization",
      name: "Tiger Club",
      url: SITE_URL,
    },
    image: [absoluteImage(event.image)],
    url: pageUrl,
  };

  // Include offers only for upcoming events with a registration URL.
  // Never invent price or availability — only emit what the data supports.
  if (!past && primaryHref) {
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      url: primaryHref,
    };
    // Explicit free pricing (structured field takes precedence over prose).
    if (event.priceCents === 0) {
      offer.price = "0";
      offer.priceCurrency = "USD";
      offer.availability = "https://schema.org/InStock";
    } else if (
      typeof event.price === "string" &&
      event.price.trim().toLowerCase() === "free"
    ) {
      offer.price = "0";
      offer.priceCurrency = "USD";
      offer.availability = "https://schema.org/InStock";
    }
    jsonLd.offers = [offer];
  }

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="pt-24 md:pt-32 pb-24">
        {/* Narrow centered container — Partiful-style focused reading width */}
        <div className="max-w-lg mx-auto px-5">

          {/* ── back nav ── */}
          <Link
            href="/experiences"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wideish uppercase text-ink/40 hover:text-tiger-text transition-colors mb-8"
          >
            ← Experiences
          </Link>

          {/* ── hero image ── */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover"
              priority
            />
            {/* Past event ribbon over image */}
            {past && (
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-ink/70 backdrop-blur-sm px-3 py-1 font-mono text-[10px] tracking-wideish uppercase text-paper/90">
                  Past Event
                </span>
              </div>
            )}
          </div>

          {/* ── title block ── */}
          <div className="mt-5">
            <p className="font-mono text-[10px] tracking-wideish uppercase text-tiger-text mb-2">
              {KIND[kind].label}
              {event.presentedBy && ` · ${KIND[kind].by} ${event.presentedBy}`}
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight">
              {event.title}
            </h1>
          </div>

          {/* ── info rows ── */}
          <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">

            {/* Date & time */}
            <div className="flex items-start gap-4 py-4">
              {/* Calendar icon */}
              <svg
                aria-hidden="true"
                className="mt-0.5 w-4 h-4 shrink-0 text-ink/35"
                fill="none" stroke="currentColor" strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <div>
                <p className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 mb-0.5">
                  Date &amp; Time
                </p>
                <p className="text-sm text-ink">
                  {/* Full month name for readability */}
                  {new Date(`${event.month} 1, 2026`).toLocaleString("en-US", { month: "long" })}{" "}
                  {event.day}, 2026
                </p>
                {event.time && (
                  <p className="text-sm text-ink/60 mt-0.5">{event.time}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4 py-4">
              {/* Pin icon */}
              <svg
                aria-hidden="true"
                className="mt-0.5 w-4 h-4 shrink-0 text-ink/35"
                fill="none" stroke="currentColor" strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 0 1 14 0C19 13.5 12 21 12 21z"/>
                <circle cx="12" cy="8.5" r="2.5"/>
              </svg>
              <div>
                <p className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 mb-0.5">
                  Location
                </p>
                <p className="text-sm text-ink">{event.location}</p>
                {event.address && (
                  <p className="text-xs text-ink/50 mt-0.5">{event.address}</p>
                )}
              </div>
            </div>

            {/* Price — only when explicitly set */}
            {event.price && (
              <div className="flex items-start gap-4 py-4">
                {/* Ticket icon */}
                <svg
                  aria-hidden="true"
                  className="mt-0.5 w-4 h-4 shrink-0 text-ink/35"
                  fill="none" stroke="currentColor" strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 12a2 2 0 0 0 0-4V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2z"/>
                </svg>
                <div>
                  <p className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 mb-0.5">
                    Price
                  </p>
                  <p className="text-sm text-ink">{event.price}</p>
                </div>
              </div>
            )}

            {/* Medium / category */}
            <div className="flex items-start gap-4 py-4">
              {/* Tag icon */}
              <svg
                aria-hidden="true"
                className="mt-0.5 w-4 h-4 shrink-0 text-ink/35"
                fill="none" stroke="currentColor" strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              <div>
                <p className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 mb-0.5">
                  Category
                </p>
                <p className="text-sm text-ink">{event.medium}</p>
              </div>
            </div>

          </div>

          {/* ── description ── */}
          <div className="mt-6">
            <p className="text-sm md:text-base text-ink/75 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* ── CTA ── */}
          <div className="mt-8">
            {past ? (
              <div>
                <p className="text-xs text-ink/40 font-mono tracking-wideish uppercase mb-4">
                  Registration closed
                </p>
                <Link
                  href="/experiences"
                  className="block w-full text-center rounded-full bg-ink/8 border border-ink/15 px-6 py-3.5 text-sm font-semibold text-ink/70 transition-colors hover:bg-ink/12"
                >
                  See upcoming experiences →
                </Link>
              </div>
            ) : primaryHref ? (
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-full bg-tiger-fill px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-tiger-deep"
              >
                {primaryLabel}
              </a>
            ) : (
              <a
                href="https://discord.gg/6u83g4P8Cb"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-full bg-tiger-fill px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-tiger-deep"
              >
                RSVP on Discord
              </a>
            )}
          </div>

          {/* ── hosted by ── */}
          <div className="mt-8 pt-6 border-t border-ink/10">
            <p className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 mb-2">
              Hosted by
            </p>
            <p className="text-sm text-ink font-medium">
              Tiger Club
              {event.presentedBy && (
                <span className="font-normal text-ink/60"> · {event.presentedBy}</span>
              )}
            </p>
            <p className="mt-1 text-xs text-ink/40">{KIND[kind].blurb}</p>
          </div>

          {/* ── footer nav ── */}
          <div className="mt-10 pt-6 border-t border-ink/10">
            <Link
              href="/experiences"
              className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 hover:text-tiger-text transition-colors"
            >
              ← All experiences
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
