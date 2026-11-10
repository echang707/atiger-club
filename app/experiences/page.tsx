import type { Metadata } from "next";
import { Suspense } from "react";
import ExperiencesClient from "./ExperiencesClient";
import { events, eventSlug } from "@/lib/events";
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

export default function EventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      <Suspense fallback={null}>
        <ExperiencesClient />
      </Suspense>
    </>
  );
}
