import type { Metadata } from "next";
import { Fraunces, Inter, Caveat, JetBrains_Mono, Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
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

        {/* Tiger-marble backdrop: two tileable patterns, referenced by id
            from every MarbleField instance on the page (see
            components/MarbleField.tsx). Defined once here — same trick
            as #roughen above — rather than re-declared per section.
            `tiger-marble` runs on the light paper sections, warm veined
            strokes in ink and tiger-orange; `tiger-marble-invert` is the
            same shapes re-coloured in cream and tiger-soft for the one
            dark section (Ending). Colours are baked in at a working
            opacity already, since a MarbleField masks and dims the
            whole pattern further per section — this is the "at full
            strength" ceiling, not the on-page strength. */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <pattern
              id="tiger-marble"
              patternUnits="userSpaceOnUse"
              width="460"
              height="460"
              patternTransform="rotate(-7)"
            >
              <path d="M-20 70 C40 40 90 95 150 60 C210 25 260 80 320 50 C370 25 420 55 470 35" fill="none" stroke="#15130E" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />
              <path d="M-30 260 C30 235 75 285 135 255 C195 225 245 270 305 245 C360 220 405 255 470 230" fill="none" stroke="#E2531C" strokeWidth="2.6" strokeLinecap="round" opacity="0.5" />
              <path d="M10 400 C65 375 110 420 170 395 C225 370 270 410 330 390 C375 370 415 400 470 380" fill="none" stroke="#15130E" strokeWidth="1.8" strokeLinecap="round" opacity="0.32" />
              <path d="M60 30 C74 55 72 82 52 104 C38 90 36 62 60 30 Z" fill="#E2531C" opacity="0.42" />
              <path d="M330 15 C348 40 344 68 320 88 C305 72 305 44 330 15 Z" fill="#15130E" opacity="0.36" />
              <path d="M190 140 C214 158 222 186 205 212 C182 200 172 170 190 140 Z" fill="#15130E" opacity="0.34" />
              <path d="M395 150 C415 172 415 200 393 220 C374 204 372 176 395 150 Z" fill="#E2531C" opacity="0.4" />
              <path d="M95 195 C118 210 128 236 112 262 C90 250 80 222 95 195 Z" fill="#E2531C" opacity="0.4" />
              <path d="M30 330 C52 346 60 372 44 396 C22 386 12 358 30 330 Z" fill="#15130E" opacity="0.32" />
              <path d="M250 300 C270 322 270 350 248 372 C228 354 226 326 250 300 Z" fill="#E2531C" opacity="0.4" />
              <path d="M410 320 C428 340 428 366 408 386 C390 370 388 344 410 320 Z" fill="#15130E" opacity="0.3" />
            </pattern>

            <pattern
              id="tiger-marble-invert"
              patternUnits="userSpaceOnUse"
              width="460"
              height="460"
              patternTransform="rotate(-7)"
            >
              <path d="M-20 70 C40 40 90 95 150 60 C210 25 260 80 320 50 C370 25 420 55 470 35" fill="none" stroke="#F5F0E3" strokeWidth="2.2" strokeLinecap="round" opacity="0.16" />
              <path d="M-30 260 C30 235 75 285 135 255 C195 225 245 270 305 245 C360 220 405 255 470 230" fill="none" stroke="#F0A15F" strokeWidth="2.6" strokeLinecap="round" opacity="0.22" />
              <path d="M10 400 C65 375 110 420 170 395 C225 370 270 410 330 390 C375 370 415 400 470 380" fill="none" stroke="#F5F0E3" strokeWidth="1.8" strokeLinecap="round" opacity="0.14" />
              <path d="M60 30 C74 55 72 82 52 104 C38 90 36 62 60 30 Z" fill="#F0A15F" opacity="0.18" />
              <path d="M330 15 C348 40 344 68 320 88 C305 72 305 44 330 15 Z" fill="#F5F0E3" opacity="0.14" />
              <path d="M190 140 C214 158 222 186 205 212 C182 200 172 170 190 140 Z" fill="#F5F0E3" opacity="0.14" />
              <path d="M395 150 C415 172 415 200 393 220 C374 204 372 176 395 150 Z" fill="#F0A15F" opacity="0.18" />
              <path d="M95 195 C118 210 128 236 112 262 C90 250 80 222 95 195 Z" fill="#F0A15F" opacity="0.18" />
              <path d="M30 330 C52 346 60 372 44 396 C22 386 12 358 30 330 Z" fill="#F5F0E3" opacity="0.13" />
              <path d="M250 300 C270 322 270 350 248 372 C228 354 226 326 250 300 Z" fill="#F0A15F" opacity="0.18" />
              <path d="M410 320 C428 340 428 366 408 386 C390 370 388 344 410 320 Z" fill="#F5F0E3" opacity="0.12" />
            </pattern>
          </defs>
        </svg>
        {/* Relative wrapper gives The Stripe (rendered from within the
            homepage's own tree, see app/page.tsx) a positioning context
            exactly as tall as the whole page, so its z-index:-1 SVG
            paints above the paper background but underneath every
            normal-flow element — photos, cards, the footer — with no
            per-element bookkeeping. TheStripe itself is intentionally
            NOT rendered here: this layout is shared by every route, and
            a component mounted here would need to reliably detect and
            hide itself on /events and /work-with-us. Instead it only
            exists inside the homepage's component tree, so it's
            structurally impossible for it to render anywhere else —
            no runtime check to trust, nothing to go stale. */}
        <div className="relative">
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
