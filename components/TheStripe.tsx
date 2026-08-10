"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";

type Pt = { x: number; y: number };

// A page can opt individual elements into the route by giving them
// `data-stripe-anchor` (see ScrollStory.tsx for the pattern: the hero
// photo, the word "connected" in the pull-quote, and each scattered
// memory photo). On mount we measure where those elements actually
// landed and thread the stripe through them, in document order, so the
// line has a reason to be where it is — it's visiting things — instead
// of an arbitrary decorative squiggle. Pages with fewer than two
// anchors (events, work with us) fall back to a fixed, hand-tuned
// wander down the page.
const FALLBACK: Pt[] = [
  { x: 82, y: 0 },
  { x: 90, y: 120 },
  { x: 80, y: 260 },
  { x: 91, y: 400 },
  { x: 79, y: 540 },
  { x: 90, y: 680 },
  { x: 81, y: 820 },
  { x: 89, y: 960 },
  { x: 84, y: 1000 },
];

const START: Pt = { x: 35, y: 0 };

// Catmull-Rom → cubic-bezier sampling, so the route through a sparse set
// of anchor points still reads as one continuous, gently curving stripe
// rather than straight dot-to-dot segments.
function sampleSmooth(points: Pt[], perSegment = 22): Pt[] {
  const p = points;
  if (p.length < 2) return p;
  const out: Pt[] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    for (let s = 0; s < perSegment; s++) {
      const t = s / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      out.push({ x, y });
    }
  }
  out.push(p[p.length - 1]);
  return out;
}

// Turns the sampled centerline into a closed, filled ribbon whose width
// breathes as it travels (two overlapping sine waves at different
// frequencies so it doesn't read as a mechanical pulse) — a fat-then-
// tapering-then-fat-again silhouette, the way an actual tiger stripe
// (or a brush stroke) varies, instead of a uniform-width ruled line.
function ribbonPath(samples: Pt[], base: number, wobble: number, phase = 0): string {
  const n = samples.length;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const prev = samples[Math.max(0, i - 1)];
    const next = samples[Math.min(n - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const t = i / n;
    const w = Math.max(
      0.4,
      base +
        wobble *
          (0.6 * Math.sin(t * Math.PI * 8 + phase) + 0.4 * Math.sin(t * Math.PI * 19 + phase * 1.6))
    );
    left.push({ x: samples[i].x + nx * w, y: samples[i].y + ny * w });
    right.push({ x: samples[i].x - nx * w, y: samples[i].y - ny * w });
  }
  return (
    `M ${left[0].x.toFixed(2)},${left[0].y.toFixed(2)} ` +
    left.slice(1).map((p) => `L ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") +
    " " +
    right.slice().reverse().map((p) => `L ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") +
    " Z"
  );
}

export default function TheStripe() {
  const [mounted, setMounted] = useState(false);
  const [points, setPoints] = useState<Pt[]>(FALLBACK);
  const prefersReduced = useReducedMotion();
  const pathname = usePathname();

  const measure = useCallback(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-stripe-anchor]"));
    const docHeight = Math.max(document.documentElement.scrollHeight, 1);
    const winWidth = Math.max(document.documentElement.clientWidth, 1);

    if (nodes.length < 2) {
      setPoints(FALLBACK);
      return;
    }

    const anchors: Pt[] = nodes
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const pageY = rect.top + window.scrollY + rect.height / 2;
        const x = ((rect.left + rect.width / 2) / winWidth) * 100;
        const y = (pageY / docHeight) * 1000;
        return { x: Math.max(8, Math.min(92, x)), y };
      })
      .sort((a, b) => a.y - b.y);

    // A little meander between each pair of anchors — alternating left
    // and right of the straight line between them — so the route still
    // wanders like the rest of the stripe instead of connecting the
    // dots in perfectly straight hops.
    const route: Pt[] = [START];
    anchors.forEach((a, i) => {
      const prev = i === 0 ? START : anchors[i - 1];
      const midX = (prev.x + a.x) / 2 + (i % 2 === 0 ? 16 : -16);
      const midY = (prev.y + a.y) / 2;
      route.push({ x: Math.max(6, Math.min(94, midX)), y: midY });
      route.push(a);
    });
    const last = anchors[anchors.length - 1];
    route.push({ x: last.x > 50 ? last.x - 20 : last.x + 20, y: Math.min(1000, last.y + 120) });
    route.push({ x: 30, y: 1000 });

    setPoints(route);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", measure);
    // Images and web fonts can still land after first paint and shift
    // layout, so re-measure a couple of times after mount rather than
    // trusting the very first pass.
    const t1 = setTimeout(measure, 400);
    const t2 = setTimeout(measure, 1400);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", measure);
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // Re-measure on route change too — different pages have different
    // anchors (or none, falling back to FALLBACK).
  }, [mounted, pathname, measure]);

  const { blackD, orangeD } = useMemo(() => {
    const samples = sampleSmooth(points, 22);
    return {
      blackD: ribbonPath(samples, 2.3, 1.2, 0),
      orangeD: ribbonPath(samples, 5, 1.6, 0.5),
    };
  }, [points]);

  // Gentler than a raw scroll hookup (higher damping, lower stiffness)
  // so the reveal still tracks scroll closely without feeling jumpy.
  const { scrollYProgress } = useScroll();
  const revealSpring = useSpring(scrollYProgress, { stiffness: 45, damping: 26, mass: 0.3 });
  const revealHeight = useTransform(revealSpring, [0, 1], [0, 1000]);

  if (!mounted) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: -1 }}
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
    >
      <clipPath id="stripeReveal" clipPathUnits="userSpaceOnUse">
        {prefersReduced ? (
          <rect x="0" y="0" width="100" height="1000" />
        ) : (
          <motion.rect x="0" y="0" width="100" style={{ height: revealHeight }} />
        )}
      </clipPath>

      <g clipPath="url(#stripeReveal)">
        {/* Thick orange band, fitted snugly around the black — a solid
            fill traced along the same centerline, not a blurred hue. */}
        <path d={orangeD} fill="#E2531C" />

        {/* The stripe itself. Filled with "paper minus ink" and blended
            with mix-blend-mode: difference against whatever sits behind
            it, so it self-adjusts to true ink-black on the cream page
            and to a pale, visible tone over the dark closing section —
            it never again disappears into a matching-color background. */}
        <path d={blackD} fill="#E0DDD5" style={{ mixBlendMode: "difference" }} />
      </g>
    </svg>
  );
}
