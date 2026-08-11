import type { Metadata } from "next";
import AboutClient from "./AboutClient";

const TITLE = "About";
const DESCRIPTION =
  "Adulthood quietly removes the social infrastructure that used to make connection automatic. Tiger Club builds real-world shared experiences to put some of it back.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
  openGraph: {
    url: "/about",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
