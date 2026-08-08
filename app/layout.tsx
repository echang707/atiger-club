import type { Metadata } from "next";
import { Fraunces, Inter, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PawPrints from "@/components/PawPrints";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tiger Club",
  description:
    "go do something. dinners, walks, creative nights, adventures, and other reasons to leave the house.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${caveat.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <div className="grain" aria-hidden="true" />
        <PawPrints />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
