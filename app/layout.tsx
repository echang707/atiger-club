import type { Metadata } from "next";
import PawPrints from "@/components/PawPrints";
import NewsletterPopup from "@/components/NewsletterPopup";
import { Grandstander } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { MemberProvider } from "@/components/club/MemberProvider";
import Footer from "@/components/Footer";
import DiscordFab from "@/components/DiscordFab";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, SITE_LOCALE } from "@/lib/seo";

// One family across the whole site: Grandstander, a friendly hand-drawn
// rounded face, used at different weights for headlines, body copy and
// labels. (The logo is an image and is unaffected.) Every Tailwind font key
// points at this one variable.
const main = Grandstander({
  subsets: ["latin"],
  variable: "--font-main",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Tiger Club",
    "Atlanta social club",
    "Atlanta events",
    "things to do in Atlanta",
    "Atlanta meetup",
    "Atlanta community events",
    "make friends in Atlanta",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: SITE_LOCALE,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
      /* Square fallback. Some surfaces — iMessage, WhatsApp, Slack's
         compact preview — want 1:1 and will centre-crop a 1.91:1 card,
         which would slice the top and bottom off the wordmark. Listing
         it second means platforms that prefer the wide card still get it
         first. */
      {
        url: "/opengraph-square.png",
        width: 1200,
        height: 1200,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

// Organization + WebSite structured data, present site-wide so it's
// available to crawlers on every page without any client-side JS.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      sameAs: ["https://discord.gg/6u83g4P8Cb"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={main.variable}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* The tiger-marble no longer sits fixed behind the whole page.
            It was full-strength under every section, which is why each
            block needed its own blurred cream blob to stay readable —
            the pattern and the copy were fighting, and the glow was the
            referee. Now the material appears deliberately: full strength
            in the hero and the closing section, as thin wedges between
            sections, and nowhere else. The page surface itself is cream
            with a grain tile cut from the marble's own cream (globals.css),
            so the connection survives even where the pattern doesn't.
            Local layers sit at z-index -10/-9, under the paw prints
            (z-index 1) and well under the copy (z-index 10). */}
        <div className="grain" aria-hidden="true" />
        {/* Shared filter used for the brief "hand-drawn" wobble on CREATE's
            hover state — kept out-of-band so any component can reference
            filter: url(#roughen) without redefining it. */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id="roughen">
            <feTurbulence type="fractalNoise" baseFrequency="0.045 0.09" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <MemberProvider>
        <div className="relative">
          {/* Click-anywhere paw prints, on every page. Sits above the
              background layers (z-index -10/-9) and below the copy, so a
              stamp never lands on top of anything readable. */}
          <PawPrints />
          {/* Session state is resolved once, here, and read by the nav,
              the dashboard and event pricing. */}
          <Nav />
          {children}
          <Footer />
        </div>
        <DiscordFab />
        <NewsletterPopup />
        </MemberProvider>
      </body>
    </html>
  );
}
