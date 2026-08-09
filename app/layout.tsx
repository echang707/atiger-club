import type { Metadata } from "next";
import { Fraunces, Inter, Caveat, JetBrains_Mono, Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollThread from "@/components/ScrollThread";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, SITE_LOCALE } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

// Wordmark: a grotesque with a bit of attitude, for "TIGER CLUB" in the nav/footer.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Tagline: a soft, condensed display italic for "life is better together."
const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400"],
  style: ["normal", "italic"],
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
      className={`${fraunces.variable} ${inter.variable} ${caveat.variable} ${jetbrains.variable} ${bricolage.variable} ${instrument.variable}`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        <ScrollThread />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
