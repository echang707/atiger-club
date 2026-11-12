"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nextUp, type NextUp } from "@/lib/nextUp";
import DoorScene from "./DoorScene";

/* The homepage's first screen.

   One screen, everything on the centre line: a small "Hey, Atlanta.", the
   two-line headline, one line on what Tiger Club is, one button. The little
   ATL door scene sits on the bottom edge between "Atlanta, GA" and the next
   event. All text is in the server-rendered HTML; only the scene animates. */

export default function Hero({ initialNext }: { initialNext: NextUp }) {
  // The homepage is built ahead of time, so "next up" comes from the server
  // (identical in the HTML and on hydration) and is then refreshed in the
  // browser in case that event has passed since the last deploy.
  const [next, setNext] = useState<NextUp>(initialNext);
  useEffect(() => setNext(nextUp()), []);

  return (
    <section className="tc-hero max-w-content mx-auto px-5 sm:px-6 md:px-10" aria-labelledby="hero-title">
      <div className="tc-hero-center">
        <p className="tc-hey">Hey, Atlanta.</p>
        <h1 id="hero-title">
          <span>Life is better</span> <span>together.</span>
        </h1>
        <p className="tc-kicker">Building community through events, culture, and shared experiences.</p>
        <Link href="/experiences" className="tc-cta">
          Explore experiences <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="tc-foot">
        <span className="l">Atlanta, GA</span>
        <DoorScene />
        {next ? (
          <Link href={next.href} className="r">
            <b>Next up</b> <span>{next.title} · {next.date} →</span>
          </Link>
        ) : (
          <Link href="/experiences" className="r">
            <span>All experiences →</span>
          </Link>
        )}
      </div>
    </section>
  );
}
