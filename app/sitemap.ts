import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { events, eventDate } from "@/lib/events";

// Served at /sitemap.xml.
//
// URL decisions:
//   /events      — 308 permanent redirect to /experiences (see next.config.js).
//                  Redirect URLs must not appear in sitemaps; Google ignores them
//                  or penalises duplicate-canonical entries. /experiences is the
//                  canonical URL and is listed below.
//   /experiences — the events listing; lastmod derived from the most recently
//                  dated event so the date advances only when new events are added.
//   /about       — public, indexable; was previously missing.
//   /join        — public membership landing page.
//   /work-with-us — public partnership page.
//   /login /forgot-password /reset-password /member — transactional or private;
//                  /member carries robots: noindex. All intentionally absent.
//   ?medium=Eat etc. — query-string filter variants of /experiences; same
//                  canonical content, intentionally excluded.
//
// If individual event pages are added (app/experiences/[slug]/page.tsx),
// extend this function to map over `events` and push one entry per event —
// new events will then appear automatically on every build.

// Most recent event date in the array, used as the lastmod for /experiences.
// Falls back to a fixed reference date if the events array is somehow empty.
function latestEventDate(): Date {
  const dates = events.map((e) => eventDate(e)).filter((d) => !isNaN(d.getTime()));
  if (dates.length === 0) return new Date("2026-11-01");
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      // Update this date when the homepage content meaningfully changes.
      lastModified: new Date("2026-11-07"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/experiences`,
      // Advances automatically whenever a new event is added to lib/events.ts.
      lastModified: latestEventDate(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      // Update this date when the About page content meaningfully changes.
      lastModified: new Date("2026-10-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      // Membership signup — a real, public, indexable landing page.
      url: `${SITE_URL}/join`,
      // Update this date when the Join page content meaningfully changes.
      lastModified: new Date("2026-10-15"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/work-with-us`,
      // Update this date when the Work With Us page content meaningfully changes.
      lastModified: new Date("2026-10-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
