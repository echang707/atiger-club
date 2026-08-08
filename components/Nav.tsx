"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-paper/85 backdrop-blur-md border-b border-ink/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-ink">
          <span className="stripe-mark text-tiger">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className="font-display text-base md:text-lg tracking-tightest">TIGER CLUB</span>
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-sm">
          <Link href="/events" className="underline-stripe text-ink/80 hover:text-ink transition-colors">
            Experiences
          </Link>
          <Link href="/#was-here" className="underline-stripe text-ink/80 hover:text-ink transition-colors">
            Was Here
          </Link>
        </nav>

        <a
          href="https://discord.gg/6u83g4P8Cb"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-ink border border-ink/20 px-4 py-2 rounded-full hover:border-tiger hover:text-tiger transition-colors duration-300"
        >
          Join
        </a>
      </div>
    </header>
  );
}
