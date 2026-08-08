"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { memories } from "@/lib/events";

const MIN_SCALE = 1;
const MAX_SCALE = 3.2;

export default function TigerWasHere() {
  const [active, setActive] = useState<string | null>(null);
  const activeMemory = memories.find((m) => m.id === active);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const moved = useRef(0);

  const clamp = (t: { scale: number; x: number; y: number }) => {
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale));
    const bound = (scale - 1) * 140;
    return {
      scale,
      x: Math.min(bound, Math.max(-bound, t.x)),
      y: Math.min(bound, Math.max(-bound, t.y)),
    };
  };

  const zoomBy = useCallback((delta: number) => {
    setTransform((t) => clamp({ ...t, scale: t.scale + delta }));
  }, []);

  const reset = useCallback(() => setTransform({ scale: 1, x: 0, y: 0 }), []);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setTransform((t) => clamp({ ...t, scale: t.scale - e.deltaY * 0.0018 }));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-dot]")) return; // let dot clicks through
    dragging.current = true;
    moved.current = 0;
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    moved.current += Math.abs(dx) + Math.abs(dy);
    last.current = { x: e.clientX, y: e.clientY };
    setTransform((t) => clamp({ ...t, x: t.x + dx, y: t.y + dy }));
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <section id="was-here" className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mb-12 md:mb-16 max-w-lg"
      >
        <h2 className="font-display text-4xl md:text-6xl text-ink leading-[0.95]">
          TIGER CLUB<br />WAS HERE
        </h2>
        <p className="text-ink/55 text-sm md:text-base mt-4">
          A living archive of Atlanta. Zoom in, drag around, click a dot for the story behind it.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-[1.4fr,1fr] gap-8 md:gap-14 items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div
            ref={wrapRef}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className="relative aspect-[5/4] bg-[#ECE3CB] rounded-sm overflow-hidden border border-ink/10 touch-none cursor-grab active:cursor-grabbing"
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transformOrigin: "center center",
                transition: dragging.current ? "none" : "transform 0.18s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <AtlantaMap />

              {memories.map((m) => (
                <button
                  key={m.id}
                  data-dot
                  onClick={(e) => {
                    if (moved.current > 6) return;
                    e.stopPropagation();
                    setActive(m.id);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                  aria-label={m.title}
                >
                  <span
                    className={`block h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                      active === m.id
                        ? "bg-tiger scale-150"
                        : "bg-tiger-deep/70 group-hover:bg-tiger group-hover:scale-125"
                    }`}
                    style={{ transform: `scale(${1 / transform.scale})` }}
                  />
                  <span
                    className="absolute inset-0 rounded-full bg-tiger/30 animate-ping"
                    style={{ animationDuration: "2.4s", transform: `scale(${1 / transform.scale})` }}
                  />
                </button>
              ))}
            </div>

            <span className="pointer-events-none absolute bottom-3 left-3 text-[10px] tracking-wideish uppercase text-ink/40">
              Atlanta, GA
            </span>
          </div>

          <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
            <button
              onClick={() => zoomBy(0.4)}
              className="h-8 w-8 rounded-full bg-paper border border-ink/15 text-ink/70 hover:text-ink hover:border-ink/40 transition-colors flex items-center justify-center text-base"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              onClick={() => zoomBy(-0.4)}
              className="h-8 w-8 rounded-full bg-paper border border-ink/15 text-ink/70 hover:text-ink hover:border-ink/40 transition-colors flex items-center justify-center text-base"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              onClick={reset}
              className="h-8 w-8 rounded-full bg-paper border border-ink/15 text-ink/50 hover:text-ink hover:border-ink/40 transition-colors flex items-center justify-center text-[10px]"
              aria-label="Reset view"
            >
              ⟲
            </button>
          </div>
        </motion.div>

        <div className="min-h-[260px]">
          <AnimatePresence mode="wait">
            {activeMemory ? (
              <motion.div
                key={activeMemory.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden mb-5">
                  <Image src={activeMemory.image} alt={activeMemory.title} fill sizes="(max-width: 768px) 90vw, 420px" className="object-cover" />
                </div>
                <p className="font-mono text-xs tracking-wideish text-tiger">{activeMemory.title}</p>
                <p className="font-display text-2xl text-ink mt-1">{activeMemory.location}</p>
                <p className="text-sm text-ink/50 mt-1">{activeMemory.date}</p>
                <p className="text-sm text-ink/50">{activeMemory.attendees}</p>
                <p className="annotation text-xl text-jungle mt-3">{activeMemory.note}</p>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-ink/40 text-sm mt-6"
              >
                scroll to zoom, drag to pan, click a dot.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// A stylized but geographically-honest metro Atlanta: the I-285 perimeter,
// the downtown connector, the Chattahoochee, and a few named roads —
// simplified to editorial line-art rather than a literal street map.
function AtlantaMap() {
  return (
    <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      {/* river */}
      <path d="M8,4 C20,14 14,26 24,34 C34,42 30,54 40,64 C46,70 44,76 50,80" stroke="#8AA0A8" strokeWidth="0.6" fill="none" opacity="0.55" />

      {/* I-285 perimeter */}
      <ellipse cx="50" cy="48" rx="30" ry="24" stroke="#15130E" strokeWidth="0.35" fill="none" opacity="0.35" />

      {/* downtown connector + a few arteries */}
      <path d="M50,10 L50,86" stroke="#15130E" strokeWidth="0.3" opacity="0.28" />
      <path d="M8,48 L92,48" stroke="#15130E" strokeWidth="0.25" opacity="0.22" />
      <path d="M50,48 L78,18" stroke="#15130E" strokeWidth="0.25" opacity="0.22" />
      <path d="M50,48 L88,12" stroke="#15130E" strokeWidth="0.22" opacity="0.2" />
      <path d="M50,48 L22,26" stroke="#15130E" strokeWidth="0.22" opacity="0.2" />
      <path d="M50,48 L58,68" stroke="#15130E" strokeWidth="0.22" opacity="0.2" />

      {/* green space blobs: Piedmont Park, Grant Park */}
      <ellipse cx="56" cy="44" rx="3.4" ry="2.4" fill="#4B5B30" opacity="0.18" />
      <ellipse cx="53" cy="61" rx="3" ry="2.6" fill="#4B5B30" opacity="0.18" />

      {/* downtown marker */}
      <circle cx="50" cy="48" r="1" fill="#15130E" opacity="0.4" />
      <text x="50" y="45.4" fontSize="2" textAnchor="middle" fill="#15130E" opacity="0.4" fontFamily="var(--font-inter)">
        DOWNTOWN
      </text>

      <text x="72" y="24" fontSize="1.8" fill="#15130E" opacity="0.3" fontFamily="var(--font-inter)">Tucker</text>
      <text x="66" y="27" fontSize="1.8" fill="#15130E" opacity="0.3" fontFamily="var(--font-inter)">Doraville</text>
      <text x="78" y="36" fontSize="1.8" fill="#15130E" opacity="0.3" fontFamily="var(--font-inter)">Clarkston</text>
      <text x="80" y="10" fontSize="1.8" fill="#15130E" opacity="0.3" fontFamily="var(--font-inter)">Duluth</text>
      <text x="20" y="24" fontSize="1.8" fill="#15130E" opacity="0.3" fontFamily="var(--font-inter)">Marietta</text>
      <text x="63" y="55" fontSize="1.8" fill="#15130E" opacity="0.3" fontFamily="var(--font-inter)">Decatur</text>
    </svg>
  );
}
