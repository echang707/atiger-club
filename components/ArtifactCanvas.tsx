"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import ArtifactItem, { Artifact } from "@/components/ArtifactItem";
import CursorDot from "@/components/CursorDot";
import { events } from "@/lib/events";

const artifacts: Artifact[] = [
  {
    id: "polaroid-1",
    kind: "polaroid",
    top: "6%",
    left: "8%",
    rotate: -7,
    depth: 0.5,
    draggable: true,
    width: 150,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop",
    caption: "bite club, july",
  },
  {
    id: "note-1",
    kind: "note",
    top: "3%",
    left: "60%",
    rotate: 5,
    depth: 0.3,
    draggable: true,
    width: 140,
    text: "see you saturday :)",
  },
  {
    id: "ticket-1",
    kind: "ticket",
    top: "18%",
    left: "33%",
    rotate: -3,
    depth: 0.8,
    width: 190,
    text: `${events[4]?.title ?? "CompassionCon"}`,
    reveal: {
      title: events[4]?.title ?? "CompassionCon",
      meta: `${events[4]?.month} ${events[4]?.day} · ${events[4]?.location}`,
      url: events[4]?.ctaUrl ?? "/events",
    },
  },
  {
    id: "atl-1",
    kind: "atl",
    top: "2%",
    left: "85%",
    rotate: -4,
    depth: 0.6,
    width: 90,
    text: "ATL",
  },
  {
    id: "doodle-1",
    kind: "doodle",
    top: "34%",
    left: "12%",
    rotate: 8,
    depth: 0.4,
    width: 110,
  },
  {
    id: "stamp-1",
    kind: "stamp",
    top: "40%",
    left: "72%",
    rotate: -6,
    depth: 0.7,
    width: 112,
    text: `${events[0]?.weekday} ${events[0]?.month} ${events[0]?.day}`,
    reveal: {
      title: events[0]?.title ?? "Upcoming",
      meta: `${events[0]?.location}`,
      url: events[0]?.ctaUrl ?? "/events",
    },
  },
  {
    id: "receipt-1",
    kind: "receipt",
    top: "50%",
    left: "42%",
    rotate: -9,
    depth: 0.35,
    draggable: true,
    width: 120,
    text: "BITE CLUB\nKOREA NIGHT\n---------------\nNEW FRIENDS   4\nTOTAL      PRICELESS",
  },
  {
    id: "paw-1",
    kind: "paw",
    top: "58%",
    left: "6%",
    rotate: 10,
    depth: 0.2,
    width: 60,
  },
  {
    id: "flyer-1",
    kind: "flyer",
    top: "64%",
    left: "58%",
    rotate: 4,
    depth: 0.65,
    width: 170,
    text: `${events[3]?.title ?? "JapanFest"} — ${events[3]?.month} ${events[3]?.day}`,
    reveal: {
      title: events[3]?.title ?? "JapanFest",
      meta: `${events[3]?.time} · ${events[3]?.location}`,
      url: events[3]?.ctaUrl ?? "/events",
    },
  },
  {
    id: "wordlist-1",
    kind: "wordlist",
    top: "72%",
    left: "22%",
    rotate: -2,
    depth: 0.15,
    width: 130,
    text: "eat · create · move · explore · learn · give",
  },
  {
    id: "snippet-1",
    kind: "snippet",
    top: "80%",
    left: "68%",
    rotate: -3,
    depth: 0.45,
    draggable: true,
    width: 190,
    text: "the group chat is unhinged (affectionate)",
  },
  {
    id: "polaroid-2",
    kind: "polaroid",
    top: "88%",
    left: "10%",
    rotate: 6,
    depth: 0.55,
    width: 150,
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=600&auto=format&fit=crop",
    caption: "sunday morning",
  },
];

export default function ArtifactCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mvX = useSpring(rawX, { damping: 20, stiffness: 120 });
  const mvY = useSpring(rawY, { damping: 20, stiffness: 120 });

  useEffect(() => {
    setInteractive(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const handle = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      rawX.set(nx);
      rawY.set(ny);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [interactive, rawX, rawY]);

  return (
    <section className={`relative bg-ivory ${interactive ? "md:cursor-none" : ""}`}>
      {interactive && <CursorDot />}
      <div className="grain-overlay" />

      {/* masthead line, understated */}
      <div className="pt-28 md:pt-36 px-6 md:px-10 max-w-content mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-ink/40">Atlanta, GA</p>
        <p className="font-display italic text-xl md:text-2xl text-ink/70 mt-1">
          A social club for people who do things.
        </p>
      </div>

      {/* Desktop: absolute scattered canvas */}
      <div
        ref={ref}
        className="hidden md:block relative max-w-content mx-auto px-10 mt-10"
        style={{ height: "150vh" }}
      >
        {artifacts.map((a) => (
          <ArtifactItem key={a.id} artifact={a} mvX={mvX} mvY={mvY} interactive />
        ))}
      </div>

      {/* Mobile: simple staggered flow, tap-to-reveal still works */}
      <div className="md:hidden flex flex-wrap gap-8 justify-center px-6 py-16">
        {artifacts.map((a) => (
          <ArtifactItem
            key={a.id}
            artifact={{ ...a, width: Math.min(a.width ?? 150, 140) }}
            mvX={mvX}
            mvY={mvY}
            interactive={false}
          />
        ))}
      </div>
    </section>
  );
}
