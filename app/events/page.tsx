import type { Metadata } from "next";
import { Suspense } from "react";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Experiences — Tiger Club",
  description: "Browse upcoming Tiger Club experiences around the city.",
};

export default function EventsPage() {
  return (
    <Suspense fallback={null}>
      <EventsClient />
    </Suspense>
  );
}
