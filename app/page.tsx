import type { Metadata } from "next";
import Hero from "@/components/Hero";
import MediumsSpread from "@/components/MediumsSpread";
import ScrollStory from "@/components/ScrollStory";
import UpcomingRows from "@/components/UpcomingRows";
import Ending from "@/components/Ending";
import MarbleWedge from "@/components/MarbleWedge";
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
    // The page's rhythm, and the reason the pattern lands at all:
    //
    //   Hero .............. tiger-marble, full strength
    //   MediumsSpread ..... quiet cream
    //   ScrollStory ....... quiet cream (one fragment behind a photo)
    //   MarbleWedge ....... accent, entering from the left edge
    //   UpcomingRows ...... quiet cream
    //   MarbleWedge ....... accent, entering from the right edge
    //   Ending ............ tiger-marble returning, full strength
    //
    // The material gets two long stretches of absence in the middle. That
    // absence is what makes it read as a brand device instead of wallpaper.
    <main>
      <Hero />
      <MediumsSpread />
      <ScrollStory />
      <MarbleWedge side="left" />
      <UpcomingRows />
      <MarbleWedge side="right" />
      <Ending />
    </main>
  );
}
