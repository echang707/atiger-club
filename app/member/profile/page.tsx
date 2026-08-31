import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Your Profile",
  /* Personal and behind a session — keep it out of search entirely. */
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ProfileClient />;
}
