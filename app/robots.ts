import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Served at /robots.txt. Every public route on this site is meant to be
// indexed — there's no admin area or private section to carve out — so
// this simply allows everything and points crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
