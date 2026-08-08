import type { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Experiences — Tiger Club",
  description: "Browse upcoming Tiger Club experiences around the city.",
};

export default function EventsPage() {
  return <EventsClient />;
}
