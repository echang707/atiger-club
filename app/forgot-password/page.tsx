import type { Metadata } from "next";
import ForgotClient from "./ForgotClient";

export const metadata: Metadata = { title: "Reset your password" };

export default function Page() {
  return <ForgotClient />;
}
