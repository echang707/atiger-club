import type { Metadata } from "next";
import Hero from "@/components/Hero";
import MediumsSpread from "@/components/MediumsSpread";
import ScrollStory from "@/components/ScrollStory";
import UpcomingRows from "@/components/UpcomingRows";
import Ending from "@/components/Ending";
import TheStripe from "@/components/TheStripe";
import { SITE_TITLE, SITE_DESCRIPTION } from "@/lib/seo";

export const metadata: Metadata = {
  // Bypasses the layout's "%s — Tiger Club" template — SITE_TITLE is
  // already the full, brand-inclusive title for the homepage.
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <main>
      {/* Lives only in the homepage's tree — see the note in
          app/layout.tsx for why it's not mounted up there instead.
          Its own "absolute inset-0 h-full w-full" still resolves
          against the layout's page-tall `relative` wrapper, since CSS
          absolute positioning looks for the nearest positioned
          ancestor regardless of how deep in the tree it's rendered
          from — it doesn't need to be a direct child of it. */}
      <TheStripe />
      <Hero />
      <MediumsSpread />
      <ScrollStory />
      <UpcomingRows />
      <Ending />
    </main>
  );
}
