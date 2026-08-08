"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { discordUrl } from "@/lib/events";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-ivory/85 backdrop-blur-md border-b border-stone-dark" : "bg-transparent"
      }`}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-ink">
          <span className="stripe-mark text-amber-deep">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className="font-display text-lg tracking-tightest">Tiger Club</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm">
          <Link href="/events" className="underline-stripe text-ink/80 hover:text-ink transition-colors">
            Experiences
          </Link>
          <Link href="/#about" className="underline-stripe text-ink/80 hover:text-ink transition-colors">
            About
          </Link>
        </nav>

        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium bg-ink text-ivory px-5 py-2.5 rounded-full hover:bg-rust transition-colors duration-300"
        >
          Join the Community
        </a>
      </div>
    </header>
  );
}
