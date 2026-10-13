"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────
   CursorThread — two Verlet rope simulations, one black and one orange,
   following the cursor with slightly different physics so they
   naturally weave apart and back together.

   The ropes are invisible until the first mouse/touch move.
   ───────────────────────────────────────────────────────────────────── */

const N    = 44;   // nodes per rope
const SEG  = 13;   // rest length per segment (px)

type Pt = { x: number; y: number; px: number; py: number };

function makeRope(cx: number, cy: number): Pt[] {
  return Array.from({ length: N }, (_, i) => ({
    x: cx, y: cy + i * SEG,
    px: cx, py: cy + i * SEG,
  }));
}

function stepRope(
  pts: Pt[],
  mx: number, my: number,
  gravity: number,
  damping: number,
  iters: number,
) {
  for (let i = 1; i < N; i++) {
    const p = pts[i];
    const vx = (p.x - p.px) * damping;
    const vy = (p.y - p.py) * damping;
    p.px = p.x; p.py = p.y;
    p.x += vx;
    p.y += vy + gravity;
  }
  for (let iter = 0; iter < iters; iter++) {
    pts[0].x = mx; pts[0].y = my;
    pts[0].px = mx; pts[0].py = my;
    for (let i = 0; i < N - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d  = Math.hypot(dx, dy) || 0.001;
      const diff = (d - SEG) / d * 0.5;
      const fx = dx * diff, fy = dy * diff;
      if (i > 0) { a.x += fx; a.y += fy; }
      b.x -= fx; b.y -= fy;
    }
    pts[0].x = mx; pts[0].y = my;
  }
}

function tracePath(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < N - 1; i++) {
    const xc = (pts[i].x + pts[i + 1].x) / 2;
    const yc = (pts[i].y + pts[i + 1].y) / 2;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
  }
  ctx.lineTo(pts[N - 1].x, pts[N - 1].y);
}

export default function CursorThread() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas; // non-nullable alias for use inside closures
    const ctx = c.getContext("2d")!;

    let W = 0, H = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let hasMoused = false;
    let rafId = 0;

    /* ── two ropes ──────────────────────────────────────────────────
       Orange: floats lazily — low gravity, high damping
       Black:  snappier, heavier — more gravity, less damping     */
    const orange = makeRope(mx, my);
    const black  = makeRope(mx, my);

    /* ── resize ──────────────────────────────────────────────────── */
    function resize() {
      W = c.width  = window.innerWidth;
      H = c.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    /* ── input ───────────────────────────────────────────────────── */
    function onMove(x: number, y: number) {
      mx = x; my = y;
      hasMoused = true;
    }
    const onMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      onMove(t.clientX, t.clientY);
    };
    document.addEventListener("mousemove", onMouse);
    document.addEventListener("touchmove", onTouch, { passive: true });

    /* ── draw ────────────────────────────────────────────────────── */
    function draw() {
      ctx.clearRect(0, 0, W, H);
      if (!hasMoused) return;

      ctx.save();
      ctx.lineCap  = "round";
      ctx.lineJoin = "round";

      /* ── orange rope ──────────────────────────────────────────── */

      /* soft outer glow */
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = "#D2470F";
      ctx.lineWidth   = 7;
      tracePath(ctx, orange);
      ctx.stroke();

      /* main thread */
      ctx.globalAlpha = 0.70;
      ctx.strokeStyle = "#D2470F";
      ctx.lineWidth   = 1.4;
      tracePath(ctx, orange);
      ctx.stroke();

      /* bright head section */
      ctx.globalAlpha = 0.95;
      ctx.lineWidth   = 1.1;
      ctx.beginPath();
      ctx.moveTo(orange[0].x, orange[0].y);
      for (let i = 1; i < Math.min(5, N); i++) {
        ctx.lineTo(orange[i].x, orange[i].y);
      }
      ctx.stroke();

      /* ── black rope ───────────────────────────────────────────── */

      /* soft outer glow */
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = "#0F0E0A";
      ctx.lineWidth   = 5;
      tracePath(ctx, black);
      ctx.stroke();

      /* main thread */
      ctx.globalAlpha = 0.62;
      ctx.strokeStyle = "#0F0E0A";
      ctx.lineWidth   = 1.0;
      tracePath(ctx, black);
      ctx.stroke();

      /* ── cursor tip ───────────────────────────────────────────── */

      /* orange bloom behind the needle */
      const bloom = ctx.createRadialGradient(mx, my, 0, mx, my, 14);
      bloom.addColorStop(0, "rgba(210,71,15,0.40)");
      bloom.addColorStop(1, "rgba(210,71,15,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle   = bloom;
      ctx.beginPath();
      ctx.arc(mx, my, 14, 0, Math.PI * 2);
      ctx.fill();

      /* needle dot */
      ctx.fillStyle   = "#D2470F";
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    /* ── loop ────────────────────────────────────────────────────── */
    function loop() {
      stepRope(orange, mx, my, 0.20, 0.988, 16); // floaty
      stepRope(black,  mx, my, 0.32, 0.980, 14); // snappy
      draw();
      rafId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouse);
      document.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[45] w-full h-full"
      aria-hidden="true"
    />
  );
}
