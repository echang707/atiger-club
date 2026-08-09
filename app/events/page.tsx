import type { Metadata } from "next";
import { Suspense } from "react";
import EventsClient from "./EventsClient";
import { events } from "@/lib/events";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Atlanta Events & Experiences";
const DESCRIPTION =
  "Every upcoming Tiger Club experience in Atlanta — dinners, watch parties, creative meetups, service days, and more — sorted by how you want to leave the house.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/events" },
  robots: { index: true, follow: true },
  openGraph: {
    url: "/events",
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
const eventsJsonLd = {
  "@context": "https://schema.org",
  "@graph": events.map((event) => ({
    "@type": "Event",
    "@id": `${SITE_URL}/events#${event.id}`,
    name: event.title,
    description: event.description,
    startDate: toIsoDate(event.month, event.day),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location,
      address: event.location,
    },
    organizer: {
      "@type": "Organization",
      name: "Tiger Club",
      url: SITE_URL,
    },
    image: [event.image],
    url: event.link ?? `${SITE_URL}/events`,
  })),
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
        <EventsClient />
      </Suspense>
    </>
  );
}
