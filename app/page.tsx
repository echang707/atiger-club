import type { Metadata } from "next";
import Hero from "@/components/Hero";
import MediumsSpread from "@/components/MediumsSpread";
import ScrollStory from "@/components/ScrollStory";
import UpcomingRows from "@/components/UpcomingRows";
import Ending from "@/components/Ending";
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
      <Hero />
      <MediumsSpread />
      <ScrollStory />
      <UpcomingRows />
      <Ending />
    </main>
  );
}
