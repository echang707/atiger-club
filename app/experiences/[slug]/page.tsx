import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { events, eventSlug, TigerEvent } from "@/lib/events";
import { SITE_URL } from "@/lib/seo";
import SaveEventButton from "@/components/club/SaveEventButton";

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
        {/* Phone: one narrow column. Desktop: Partiful-style two columns —
            image on the left (sticky), details on the right. */}
        <div className="max-w-lg lg:max-w-6xl mx-auto px-5 lg:px-10">

          <Link
            href="/experiences"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wideish uppercase text-ink/40 hover:text-tiger-text transition-colors mb-6 lg:mb-8"
          >
            ← Experiences
          </Link>

          <div className="lg:grid lg:grid-cols-2 lg:gap-14 xl:gap-20 lg:items-start">

            {/* ── left: image ── */}
            <div className="lg:sticky lg:top-28">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                  priority
                />
                {past && (
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-ink/70 backdrop-blur-sm px-3 py-1 font-mono text-[10px] tracking-wideish uppercase text-paper/90">
                      Past Event
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ── right: details ── */}
            <div className="mt-6 lg:mt-0">
              <p className="font-mono text-[10px] tracking-wideish uppercase text-tiger-text mb-2">
                {KIND[kind].label}
                {event.presentedBy && ` · ${KIND[kind].by} ${event.presentedBy}`}
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink leading-[1.08]">
                {event.title}
              </h1>

              {/* Info — compact rows, label and value on one line */}
              <dl className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <svg aria-hidden="true" className="mt-[3px] w-4 h-4 shrink-0 text-tiger-text" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <div>
                    <dt className="sr-only">Date and time</dt>
                    <dd className="text-[15px] text-ink font-medium">
                      {new Date(`${event.month} 1, 2026`).toLocaleString("en-US", { month: "long" })}{" "}
                      {event.day}, 2026
                    </dd>
                    {event.time && <dd className="text-sm text-ink/60">{event.time}</dd>}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg aria-hidden="true" className="mt-[3px] w-4 h-4 shrink-0 text-tiger-text" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 0 1 14 0C19 13.5 12 21 12 21z"/><circle cx="12" cy="8.5" r="2.5"/>
                  </svg>
                  <div>
                    <dt className="sr-only">Location</dt>
                    <dd className="text-[15px] text-ink font-medium">{event.location}</dd>
                    {event.address && <dd className="text-sm text-ink/60">{event.address}</dd>}
                  </div>
                </div>

                {event.price && (
                  <div className="flex items-start gap-3">
                    <svg aria-hidden="true" className="mt-[3px] w-4 h-4 shrink-0 text-tiger-text" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                      <path d="M20 12a2 2 0 0 0 0-4V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2z"/>
                    </svg>
                    <div>
                      <dt className="sr-only">Price</dt>
                      <dd className="text-[15px] text-ink font-medium">{event.price}</dd>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <svg aria-hidden="true" className="mt-[3px] w-4 h-4 shrink-0 text-tiger-text" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  <div>
                    <dt className="sr-only">Category</dt>
                    <dd className="text-[15px] text-ink font-medium">{event.medium}</dd>
                  </div>
                </div>
              </dl>

              {/* CTA — above the fold on desktop */}
              <div className="mt-7">
                {past ? (
                  <div>
                    <p className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 mb-3">
                      Registration closed
                    </p>
                    <Link
                      href="/experiences"
                      className="block w-full text-center rounded-full border border-ink/20 px-6 py-3.5 text-sm font-semibold text-ink/75 transition-colors hover:border-ink/40"
                    >
                      See upcoming experiences →
                    </Link>
                  </div>
                ) : (
                  <a
                    href={primaryHref ?? "https://discord.gg/6u83g4P8Cb"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center rounded-full bg-tiger-fill px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-tiger-deep"
                  >
                    {primaryHref ? primaryLabel : "RSVP on Discord"}
                  </a>
                )}
                {!past && (
                  <div className="mt-3">
                    <SaveEventButton
                      eventId={event.id}
                      returnTo={`/experiences/${eventSlug(event)}`}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-8 pt-7 border-t border-ink/10">
                <h2 className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 mb-3">
                  About this event
                </h2>
                <p className="text-[15px] md:text-base text-ink/80 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Hosted by */}
              <div className="mt-7 pt-6 border-t border-ink/10">
                <h2 className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 mb-2">
                  Hosted by
                </h2>
                <p className="text-[15px] text-ink font-medium">
                  {kind === "pick" && event.presentedBy ? event.presentedBy : "Tiger Club"}
                  {kind !== "pick" && event.presentedBy && (
                    <span className="font-normal text-ink/60"> · with {event.presentedBy}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-ink/45">{KIND[kind].blurb}</p>
              </div>

              <div className="mt-8">
                <Link
                  href="/experiences"
                  className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 hover:text-tiger-text transition-colors"
                >
                  ← All experiences
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
