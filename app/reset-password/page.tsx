import type { Metadata } from "next";
import ResetClient from "./ResetClient";

export const metadata: Metadata = { title: "Choose a new password" };

export default function Page() {
  return <ResetClient />;
}
