import type { Metadata } from "next";
import JoinClubForm from "@/components/club/JoinClubForm";

export const metadata: Metadata = {
  title: "Join Tiger Club",
  description:
    "Join Tiger Club free — get invites to Atlanta social experiences and our newsletter straight to your inbox.",
};

export default function Page() {
  return <JoinClubForm />;
}
