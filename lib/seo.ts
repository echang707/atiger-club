// Single source of truth for site-wide SEO values so the domain, name,
// and default description only ever need to change in one place.
export const SITE_URL = "https://atigerclub.com";
export const SITE_NAME = "Tiger Club";
export const SITE_TITLE = "Tiger Club | Atlanta Community Events & Experiences";
export const SITE_DESCRIPTION =
  "Meet new people and experience Atlanta with Tiger Club. Discover community dinners, creative workshops, local adventures, volunteering, and more.";
export const SITE_LOCALE = "en_US";
// No verified social handles are configured yet — Twitter/X card metadata
// intentionally omits a "site"/"creator" handle rather than guessing one.
// Add TWITTER_HANDLE here (e.g. "@atigerclub") once the account exists.

// Shared Open Graph defaults. A page that sets its own `openGraph` REPLACES
// the layout's object rather than merging into it, so pages spread these in
// to keep the share image, type, site name and locale.
export const OG_IMAGES = [
  { url: "/opengraph-image.png", width: 1200, height: 630, alt: SITE_NAME },
  /* Square fallback. Some surfaces — iMessage, WhatsApp, Slack's compact
     preview — want 1:1 and will centre-crop a 1.91:1 card, which would
     slice the top and bottom off the wordmark. Listing it second means
     platforms that prefer the wide card still get it first. */
  { url: "/opengraph-square.png", width: 1200, height: 1200, alt: SITE_NAME },
];
export const OG_DEFAULTS = {
  type: "website" as const,
  siteName: SITE_NAME,
  locale: SITE_LOCALE,
  images: OG_IMAGES,
};
