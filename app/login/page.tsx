import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Tiger Club membership.",
};

export default function Page() {
  return <LoginClient />;
}
