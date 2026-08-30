import type { Metadata } from "next";
import AuthPanel from "@/components/club/AuthPanel";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Tiger Club membership.",
};

export default function Page() {
  return <AuthPanel initialMode="login" />;
}
