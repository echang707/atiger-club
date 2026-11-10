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

      <main className="pt-28 md:pt-36 pb-24">
        <div className="max-w-content mx-auto px-6 md:px-10">

          {/* ── top nav ── */}
          <Link
            href="/experiences"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wideish uppercase text-ink/50 hover:text-tiger-text transition-colors mb-10 md:mb-14"
          >
            ← all experiences
          </Link>

          {/* ── past-event notice ── */}
          {past && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-1.5">
              <span className="font-mono text-[10px] tracking-wideish uppercase text-ink/50">
                Past Event
              </span>
            </div>
          )}

          {/* ── kind badge ── */}
          <p className="font-mono text-[10px] tracking-wideish uppercase text-tiger-text mb-3">
            {KIND[kind].label}
            {event.presentedBy &&
              ` · ${KIND[kind].by} ${event.presentedBy}`}
          </p>

          {/* ── title ── */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-ink leading-tight mb-5 max-w-3xl">
            {event.title}
          </h1>

          {/* ── meta row ── */}
          <p className="font-mono text-xs md:text-sm text-ink/60 mb-10 md:mb-14 leading-relaxed">
            {event.month} {event.day}, 2026
            {event.time && ` · ${event.time}`}
            {" · "}
            {event.location}
            {" · "}
            {event.medium}
            {event.price && ` · ${event.price}`}
          </p>

          {/* ── hero image ── */}
          <div className="relative w-full aspect-[4/3] md:aspect-video rounded-sm overflow-hidden mb-10 md:mb-16">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover"
              priority
            />
          </div>

          {/* ── body ── */}
          <div className="max-w-2xl">

            {/* Kind blurb */}
            <p className="font-mono text-[10px] tracking-wideish uppercase text-ink/40 mb-5 leading-relaxed">
              {KIND[kind].blurb}
            </p>

            {/* Description — the single most important text on the page.
                Never truncated; full prose from lib/events.ts. */}
            <p className="text-ink/80 leading-relaxed text-base md:text-lg mb-8">
              {event.description}
            </p>

            {/* ── CTA ── */}
            {past ? (
              /* Past events: registration is closed. Show a path forward. */
              <div>
                <p className="text-sm text-ink/50 mb-5">
                  Registration for this event has closed.
                </p>
                <Link
                  href="/experiences"
                  className="inline-block rounded-full bg-tiger-fill border-2 border-tiger-fill px-6 py-3 text-sm font-semibold leading-none text-white transition-colors hover:bg-tiger-deep hover:border-tiger-deep"
                >
                  See upcoming experiences →
                </Link>
              </div>
            ) : primaryHref ? (
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-tiger-fill border-2 border-tiger-fill px-6 py-3 text-sm font-semibold leading-none text-white transition-colors hover:bg-tiger-deep hover:border-tiger-deep"
              >
                {primaryLabel}
              </a>
            ) : (
              /* No registration link — direct to Discord */
              <a
                href="https://discord.gg/6u83g4P8Cb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-tiger-fill border-2 border-tiger-fill px-6 py-3 text-sm font-semibold leading-none text-white transition-colors hover:bg-tiger-deep hover:border-tiger-deep"
              >
                RSVP on Discord
              </a>
            )}
          </div>

          {/* ── footer nav ── */}
          <div className="mt-16 md:mt-24 pt-8 border-t border-ink/10">
            <Link
              href="/experiences"
              className="font-mono text-[11px] md:text-xs tracking-wideish uppercase text-ink/60 hover:text-tiger-text transition-colors"
            >
              ← see all experiences
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
