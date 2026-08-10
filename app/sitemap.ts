import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Served at /sitemap.xml. Only the two real, canonical, publicly
// indexable routes on the site today: the homepage and the events
// listing. The medium filter on /events (e.g. ?medium=Eat) renders the
// same page/content and is intentionally left out to avoid duplicate
// URLs — /events itself always carries the canonical tag.
//
// If individual event pages are ever added (e.g. app/events/[id]/page.tsx),
// extend this function to map over `events` from "@/lib/events" and push
// one entry per event — new events will then be picked up automatically
// on every build with no other changes required.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/events`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/work-with-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
