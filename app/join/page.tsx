import type { Metadata } from "next";
import JoinClient from "./JoinClient";

export const metadata: Metadata = {
  title: "Join Tiger Club",
  description:
    "Create a free Tiger Club account and get member pricing on Atlanta experiences.",
};

export default function Page() {
  return <JoinClient />;
}
