import type { Metadata } from "next";
import AuthPanel from "@/components/club/AuthPanel";

export const metadata: Metadata = {
  title: "Join Tiger Club",
  description:
    "Create a free Tiger Club account and get member pricing on Atlanta experiences.",
};

export default function Page() {
  return <AuthPanel initialMode="join" />;
}
