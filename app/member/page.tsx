import type { Metadata } from "next";
import MemberClient from "./MemberClient";

export const metadata: Metadata = {
  title: "Your Club",
  /* Per-member and behind a session — keep it out of search entirely. */
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MemberClient />;
}
