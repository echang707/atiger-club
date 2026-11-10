import type { Metadata } from "next";
import AboutClient from "./AboutClient";

// `absolute` bypasses the layout's "%s — Tiger Club" template, so the
// full title is used exactly as written without duplicating "Tiger Club".
const TITLE = "About Tiger Club | Atlanta Social Club";
const DESCRIPTION =
  "Adulthood quietly removes the social infrastructure that used to make connection automatic. Tiger Club builds real-world shared experiences to put some of it back.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
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
