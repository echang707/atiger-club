"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  buildRoute,
  buildTail,
  TEXT_PAD_X,
  TEXT_PAD_Y,
  type Box,
  type Pt,
  type Segment,
} from "@/lib/tail";

type Metrics = { docHeight: number; winHeight: number; winWidth: number };

// How far past the bottom of the viewport the tail is already drawn, as
// a fraction of viewport height, so the growing tip stays just below
// what you're reading instead of lagging near the top of the screen.
const LOOKAHEAD = 0.92;

// Distance over which the leading edge dissolves into the page.
const HEAD_FADE = 190;

// ---------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------

// Per-line text boxes measured with a Range, so a wrapped paragraph
// yields one tight box per rendered line instead of one block, and
// intersected with any clipping ancestor so collapsed content doesn't
// leave phantom obstacles behind.
function measureTextBoxes(): Box[] {
  const root = document.querySelector("main");
  if (!root) return [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const el = node.parentElement;
      if (!el) return NodeFilter.FILTER_REJECT;
      if (el.closest("svg, .sr-only, [data-stripe-ignore]")) return NodeFilter.FILTER_REJECT;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") return NodeFilter.FILTER_REJECT;
      if (parseFloat(cs.opacity || "1") < 0.05) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const boxes: Box[] = [];
  const clipCache = new Map<HTMLElement, [number, number]>();

  const clipBounds = (el: HTMLElement): [number, number] => {
    const cached = clipCache.get(el);
    if (cached) return cached;

    let top = -Infinity;
    let bottom = Infinity;
    for (let p: HTMLElement | null = el; p && p !== root; p = p.parentElement) {
      const inherited = clipCache.get(p);
      if (inherited && p !== el) {
        top = Math.max(top, inherited[0]);
        bottom = Math.min(bottom, inherited[1]);
        break;
      }
      const cs = getComputedStyle(p);
      if (cs.overflow !== "visible" || cs.overflowY !== "visible") {
        const pr = p.getBoundingClientRect();
        top = Math.max(top, pr.top);
        bottom = Math.min(bottom, pr.bottom);
      }
    }

    const result: [number, number] = [top, bottom];
    clipCache.set(el, result);
    return result;
  };

  let node: Node | null;

  while ((node = walker.nextNode())) {
    const el = (node as Text).parentElement!;
    const [clipTop, clipBottom] = clipBounds(el);

    const range = document.createRange();
    range.selectNodeContents(node);

    for (const r of Array.from(range.getClientRects())) {
      if (r.width < 2 || r.height < 2) continue;
      const top = Math.max(r.top, clipTop);
      const bottom = Math.min(r.bottom, clipBottom);
      if (bottom - top < 2) continue;

      boxes.push({
        x0: r.left - TEXT_PAD_X,
        x1: r.right + TEXT_PAD_X,
        y0: top + window.scrollY - TEXT_PAD_Y,
        y1: bottom + window.scrollY + TEXT_PAD_Y,
      });
    }
  }

  // Keep the obstacle list short — steering is O(samples x boxes) and a
  // long page has thousands of lines. Merging boxes that share a line
  // and nearly touch loses nothing.
  boxes.sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
  const merged: Box[] = [];
  for (const b of boxes) {
    const prev = merged[merged.length - 1];
    if (
      prev &&
      Math.abs(prev.y0 - b.y0) < 4 &&
      Math.abs(prev.y1 - b.y1) < 4 &&
      b.x0 <= prev.x1 + TEXT_PAD_X * 2
    ) {
      prev.x1 = Math.max(prev.x1, b.x1);
      continue;
    }
    merged.push({ ...b });
  }
  return merged;
}

export default function TheStripe() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [route, setRoute] = useState<Pt[] | null>(null);
  const [textBoxes, setTextBoxes] = useState<Box[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ docHeight: 1, winHeight: 1, winWidth: 1 });
  const prefersReduced = useReducedMotion();

  const onHomepage = pathname === "/";

  const measure = useCallback(() => {
    const docHeight = Math.max(document.documentElement.scrollHeight, 1);
    const winWidth = Math.max(document.documentElement.clientWidth, 1);
    const winHeight = Math.max(window.innerHeight, 1);
    setMetrics({ docHeight, winWidth, winHeight });

    const boxes = measureTextBoxes();
    setTextBoxes(boxes);

    const centreOf = (el: HTMLElement): Pt => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + window.scrollY + r.height / 2 };
    };

    // The tip: the period at the end of the hero tagline.
    const startEl = document.querySelector<HTMLElement>("[data-stripe-start]");
    const START = startEl ? centreOf(startEl) : { x: winWidth / 2, y: docHeight * 0.08 };

    // The base: a point just inside the top of the tiger's rump.
    const endEl = document.querySelector<HTMLElement>("[data-stripe-end]");
    const END = endEl ? centreOf(endEl) : { x: winWidth / 2, y: docHeight - 240 };

    const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-stripe-anchor]")).map(
      centreOf
    );

    const pts = buildRoute(START, END, anchors, boxes, winWidth);
    setRoute(pts);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !onHomepage) return;
    measure();
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("load", measure);
    // Images and web fonts land after first paint and reflow the text
    // the tail routes around, so re-measure a few times after mount.
    const timers = [400, 1400, 2600].map((ms) => setTimeout(measure, ms));
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", measure);
      clearTimeout(resizeTimer);
      timers.forEach(clearTimeout);
    };
  }, [mounted, onHomepage, measure]);

  // Reveal is tied to scroll POSITION, not progress, so the growing tip
  // always sits just past the bottom of the viewport. The spring is the
  // momentum: the tail keeps advancing for a beat after you stop.
  const { scrollY } = useScroll();
  const target = useMotionValue(0);
  const revealY = useSpring(target, { stiffness: 88, damping: 18, mass: 0.7 });

  useEffect(() => {
    const project = (v: number) =>
      target.set(Math.min(metrics.docHeight, v + metrics.winHeight * LOOKAHEAD));
    project(scrollY.get());
    return scrollY.on("change", project);
  }, [scrollY, target, metrics]);

  // -------------------------------------------------------------------
  // Geometry
  // -------------------------------------------------------------------
  const segments = useMemo<Segment[]>(
    () => (route ? buildTail(route, textBoxes, metrics.winWidth) : []),
    [route, textBoxes, metrics.winWidth]
  );

  if (!mounted || !onHomepage || !route || !segments.length) return null;

  const { winWidth: W, docHeight: H } = metrics;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: -1 }}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="stripeHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <mask id="stripeReveal" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
        {prefersReduced ? (
          <rect x="0" y="0" width={W} height={H} fill="#fff" />
        ) : (
          <>
            <motion.rect x="0" y="0" width={W} height={revealY} fill="#fff" />
            <motion.rect x="0" y={revealY} width={W} height={HEAD_FADE} fill="url(#stripeHead)" />
          </>
        )}
      </mask>

      <g mask="url(#stripeReveal)" shapeRendering="geometricPrecision">
        {segments.map((seg, i) => (
          <g key={i}>
            <path d={seg.body} fill="#D97721" />
            {seg.bands.map((d, j) => (
              <path key={`b${j}`} d={d} fill="#16140F" />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}
