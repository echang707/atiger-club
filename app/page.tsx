import type { Metadata } from "next";
import Hero from "@/components/Hero";
import MediumsSpread from "@/components/MediumsSpread";
import ScrollStory from "@/components/ScrollStory";
import UpcomingRows from "@/components/UpcomingRows";
import Ending from "@/components/Ending";
import JungleWash from "@/components/JungleWash";
import BallJourney from "@/components/BallJourney";
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
    //   Hero .............. tiger-marble, full strength, behind the nav
    //   MediumsSpread ..... quiet cream
    //   ScrollStory ....... quiet cream
    //   UpcomingRows ...... quiet cream
    //   Ending ............ editorial: one tail, off-screen right
    //
    // The mid-page marble fragments are gone. They read as grey rectangles
    // pasted over the page rather than as the artwork, so the pattern now
    // lives only where it can be shown at full strength.
    <main>
      <Hero />
      {/* Softens the step down from full-strength marble into cream. */}
      <JungleWash />
      {/* The period from the mediums headline travels through all seven
          words and lands in the photograph, so these two sections share
          one wrapper for measurement. */}
      <BallJourney>
        <MediumsSpread />
        <ScrollStory />
      </BallJourney>
      <UpcomingRows />
      {/* The wash that used to float above the finale as its own strip is
          now the finale's own backdrop (see Ending.tsx), so there is no
          orphan band of texture and no gap in front of it. */}
      <Ending />
    </main>
  );
}
