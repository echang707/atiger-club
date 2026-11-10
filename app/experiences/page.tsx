import type { Metadata } from "next";
import ExperiencesClient from "./ExperiencesClient";
import { events, eventSlug, mediums, cities, type Medium } from "@/lib/events";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Atlanta Social Events & Experiences | Tiger Club";
const DESCRIPTION =
  "Discover social events in Atlanta with Tiger Club. Meet new people through community dinners, creative workshops, neighborhood adventures, and more.";

export const metadata: Metadata = {
  // `absolute` bypasses the layout's "%s — Tiger Club" template so the
  // full title string is used exactly as written, without a doubled suffix.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/experiences" },
  robots: { index: true, follow: true },
  openGraph: {
    url: "/experiences",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Maps our short month abbreviations to a two-digit month number so we
// can build ISO start dates for Event structured data. Every event on
// the site currently falls in 2026.
const MONTHS: Record<string, string> = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

function toIsoDate(month: string, day: string, year = "2026") {
  const mm = MONTHS[month] ?? "01";
  const dd = day.padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// Event structured data for every listed event — rendered server-side
// so it's present in the initial HTML with no client JS required.
//
// @id and url now point to each event's dedicated page rather than a
// fragment identifier on /experiences or a third-party registration link.
// This aligns the listing-page structured data with the canonical URLs
// that exist at app/experiences/[slug]/page.tsx.
const eventsJsonLd = {
  "@context": "https://schema.org",
  "@graph": events.map((event) => {
    const eventPageUrl = `${SITE_URL}/experiences/${eventSlug(event)}`;
    return {
      "@type": "Event",
      "@id": eventPageUrl,
      name: event.title,
      description: event.description,
      startDate: toIsoDate(event.month, event.day),
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: event.location,
        address: event.address ?? event.location,
      },
      organizer: {
        "@type": "Organization",
        name: "Tiger Club",
        url: SITE_URL,
      },
      image: [event.image.startsWith("http") ? event.image : `${SITE_URL}${event.image}`],
      url: eventPageUrl,
    };
  }),
};

// Rendered per request (Cloudflare edge) rather than once at build time.
// Two reasons:
//   1. The ?medium= / ?city= filter is read HERE, on the server, so the
//      initial HTML already shows the right filtered list — no flash of
//      the unfiltered list before the browser applies the filter.
//   2. "Upcoming" vs "past" is worked out against today's date in Atlanta
//      on every request, instead of being frozen at deploy time.
// Previously the client read useSearchParams() inside <Suspense
// fallback={null}>, which made Next.js skip server rendering entirely:
// the initial HTML had no H1, no event titles and no event links.
export const runtime = "edge";

/* Today's date in Atlanta as YYYY-MM-DD. The edge server runs in UTC, so
   using its local midnight would flip events to "past" at 7–8pm ET. */
function todayInAtlanta(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Only accept known values; anything else falls back to the defaults,
  // exactly as the old client-side check did.
  const m = one(searchParams.medium);
  const c = one(searchParams.city);
  const initialMedium: Medium | "All" =
    m && mediums.some((x) => x.name === m) ? (m as Medium) : "All";
  const initialCity = c && cities.includes(c) ? c : cities[0];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      {/* Keyed on the filter so moving between filtered URLs (e.g. from a
          homepage medium link) starts from that URL's filter. */}
      <ExperiencesClient
        key={`${initialMedium}|${initialCity}`}
        initialMedium={initialMedium}
        initialCity={initialCity}
        today={todayInAtlanta()}
      />
    </>
  );
}
