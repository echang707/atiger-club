import type { Metadata } from "next";
import AuthPanel from "@/components/club/AuthPanel";

export const metadata: Metadata = {
  title: "Join Tiger Club",
  description:
    "Create a free Tiger Club account — save Atlanta experiences, get reminders before they happen, and receive event invites and our newsletter.",
};

export default function Page() {
  return <AuthPanel initialMode="join" />;
}
