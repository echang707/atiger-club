"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { memories } from "@/lib/events";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

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

// A stylized but geographically-honest metro Atlanta: the I-285 perimeter
// (its true rounded-diamond shape), the downtown connector, the Beltline
// loop, the Chattahoochee along the northwest edge, and the intown
// neighborhoods Tiger Club actually shows up in — editorial line-art
// rather than a literal street map, drawn in the site's own palette.
function AtlantaMap() {
  return (
    <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      {/* base wash */}
      <rect x="0" y="0" width="100" height="80" fill="#ECE3CB" />

      {/* Chattahoochee river tracing the northwest edge of the city */}
      <path
        d="M2,2 C12,6 10,16 18,22 C27,29 22,38 30,46 C38,54 34,64 42,72 C46,76 48,79 52,80"
        stroke="#4B5B30"
        strokeWidth="0.55"
        fill="none"
        opacity="0.4"
      />

      {/* I-285 perimeter — the real rounded-diamond shape, not a plain ellipse */}
      <path
        d="M50,16 C64,16 74,22 80,32 C86,42 86,54 78,63 C70,72 60,76 50,76 C40,76 30,72 22,63 C14,54 14,42 20,32 C26,22 36,16 50,16 Z"
        stroke="#15130E"
        strokeWidth="0.4"
        fill="none"
        opacity="0.32"
      />

      {/* downtown connector (I-75/85) */}
      <path d="M50,12 L50,80" stroke="#15130E" strokeWidth="0.32" opacity="0.28" />
      {/* I-20 east-west */}
      <path d="M10,48 L90,48" stroke="#15130E" strokeWidth="0.26" opacity="0.22" />
      {/* a few connecting arteries out to the perimeter */}
      <path d="M50,48 L76,26" stroke="#15130E" strokeWidth="0.22" opacity="0.18" />
      <path d="M50,48 L80,50" stroke="#15130E" strokeWidth="0.22" opacity="0.18" />
      <path d="M50,48 L24,30" stroke="#15130E" strokeWidth="0.22" opacity="0.18" />
      <path d="M50,48 L60,70" stroke="#15130E" strokeWidth="0.22" opacity="0.18" />

      {/* the Beltline — a looping trail through intown neighborhoods */}
      <path
        d="M40,30 C50,24 60,26 64,34 C68,42 66,50 58,54 C50,58 44,56 40,50 C36,44 38,36 44,34 C48,32 52,34 52,38"
        stroke="#B23E14"
        strokeWidth="0.5"
        strokeDasharray="1.4 1.2"
        fill="none"
        opacity="0.4"
      />

      {/* green space: Piedmont Park, Grant Park */}
      <ellipse cx="58" cy="38" rx="3.6" ry="2.6" fill="#4B5B30" opacity="0.22" />
      <ellipse cx="52" cy="60" rx="3.2" ry="2.8" fill="#4B5B30" opacity="0.22" />

      {/* downtown marker */}
      <circle cx="50" cy="48" r="1.1" fill="#E2531C" opacity="0.75" />
      <text x="50" y="45" fontSize="2.1" textAnchor="middle" fill="#15130E" opacity="0.45" fontFamily="var(--font-inter)" letterSpacing="0.05em">
        DOWNTOWN
      </text>

      {/* intown neighborhoods Tiger Club actually gathers in */}
      <text x="60" y="33" fontSize="1.8" fill="#15130E" opacity="0.35" fontFamily="var(--font-inter)">Old Fourth Ward</text>
      <text x="44" y="63" fontSize="1.8" fill="#15130E" opacity="0.35" fontFamily="var(--font-inter)">Grant Park</text>
      <text x="60" y="58" fontSize="1.8" fill="#15130E" opacity="0.35" fontFamily="var(--font-inter)">Cabbagetown</text>
      <text x="30" y="40" fontSize="1.8" fill="#15130E" opacity="0.35" fontFamily="var(--font-inter)">West Midtown</text>
      <text x="52" y="22" fontSize="1.8" fill="#15130E" opacity="0.35" fontFamily="var(--font-inter)">Midtown</text>
      <text x="66" y="52" fontSize="1.8" fill="#15130E" opacity="0.35" fontFamily="var(--font-inter)">East Atlanta</text>
      <text x="74" y="42" fontSize="1.8" fill="#15130E" opacity="0.3" fontFamily="var(--font-inter)">Decatur</text>

      {/* perimeter towns, fainter */}
      <text x="80" y="16" fontSize="1.6" fill="#15130E" opacity="0.2" fontFamily="var(--font-inter)">Duluth</text>
      <text x="14" y="20" fontSize="1.6" fill="#15130E" opacity="0.2" fontFamily="var(--font-inter)">Marietta</text>
      <text x="82" y="66" fontSize="1.6" fill="#15130E" opacity="0.2" fontFamily="var(--font-inter)">Stonecrest</text>
    </svg>
  );
}
