import type { Metadata } from "next";
import WorkWithUsClient from "./WorkWithUsClient";

const TITLE = "Work With Us";
const DESCRIPTION =
  "Have an idea for an Atlanta experience — a dinner, a workshop, a service day? Tell Tiger Club about it and we'll work with you to make it happen.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work-with-us" },
  robots: { index: true, follow: true },
  openGraph: {
    url: "/work-with-us",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function WorkWithUsPage() {
  return <WorkWithUsClient />;
}
