import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Served at /sitemap.xml.
//
// URL decisions:
//   /events       — 308 permanent redirect to /experiences (see next.config.js).
//                   Redirect URLs must not appear in sitemaps; /experiences is
//                   the canonical URL and is listed below.
//   /experiences  — the events listing. lastmod is intentionally omitted:
//                   the only timestamp available is each event's scheduled date,
//                   which reflects when the event occurs, not when the content
//                   was last updated. Supplying a future event date as lastmod
//                   would be incorrect. Populate lastmod here once a reliable
//                   content-modification timestamp (e.g. from git) is available.
//   /about        — public, indexable; was previously missing from the sitemap.
//   /join         — public membership landing page.
//   /work-with-us — public partnership page.
//   /login /forgot-password /reset-password /member — transactional or private;
//                   /member carries robots: noindex. All intentionally absent.
//   ?medium=Eat   — query-string filter variants of /experiences; same canonical
//                   content, intentionally excluded.
//
// lastmod is omitted from all entries: without access to git history at build
// time, any hardcoded date would be a guess. Google treats a missing lastmod as
// "crawl on your own schedule", which is correct here. To add reliable lastmod
// values, pipe `git log -1 --format="%aI" -- <file>` for each page at build time
// and parse the result, or store a CONTENT_UPDATED env var in Cloudflare per deploy.
//
// If individual event pages are added (app/experiences/[slug]/page.tsx), extend
// this function to map over `events` from "@/lib/events" and push one entry per
// event — new events will appear automatically on every build.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/experiences`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      // Membership signup — a real, public, indexable landing page.
      // /login, /forgot-password, /reset-password and /member are
      // deliberately absent: they are either transactional or private,
      // and /member additionally carries robots: noindex.
      url: `${SITE_URL}/join`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/work-with-us`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
