"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type Variant = "eat" | "create" | "move" | "explore" | "serve" | "learn";

const SCRAMBLE = "!@#$%^&*+=?<>XQZKY";
function randChar() {
  return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
}

// "explore" itself, in many languages, for the gap that opens in EXPLORE
const EXPLORE_WORDS = [
  "explore",
  "explorar",
  "explorer",
  "esplora",
  "erkunden",
  "探索",
  "탐험",
  "探検",
  "khám phá",
  "खोजें",
  "chunguza",
  "استكشف",
  "ṣàwárí",
  "ʻimi",
  "hlola",
];

export default function MediumWord({
  word,
  variant,
  href,
  size = "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
}: {
  word: string;
  variant: Variant;
  href: string;
  size?: string;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [hovered, setHovered] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const letters = word.split("");

  // LEARN state — word reads correctly at rest, then decrypts on hover
  const [display, setDisplay] = useState<string[]>(letters);
  const [showCheck, setShowCheck] = useState(false);
  const timers = useRef<NodeJS.Timeout[]>([]);

  // SERVE state — dot rests beside the S (index 0) until hovered
  const [passIndex, setPassIndex] = useState(0);
  const [following, setFollowing] = useState(false);

  // EXPLORE state — rotating "connection" translation shown in the door gap
  const [langIndex, setLangIndex] = useState(0);
  const langTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runEnter = useCallback(() => {
    setHovered(true);
    setCycle((c) => c + 1);

    if (variant === "learn") {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setShowCheck(false);
      const ticksPerLetter = 5;
      const tickMs = 65;
      const letterDuration = ticksPerLetter * tickMs;
      setDisplay(letters.map(() => randChar()));

      letters.forEach((letter, li) => {
        const t0 = setTimeout(() => {
          let ticks = 0;
          const iv = setInterval(() => {
            ticks++;
            if (ticks >= ticksPerLetter) {
              clearInterval(iv);
              setDisplay((prev) => {
                const next = [...prev];
                next[li] = letter;
                return next;
              });
              if (li === letters.length - 1) {
                setShowCheck(true);
                const t2 = setTimeout(() => setShowCheck(false), 700);
                timers.current.push(t2);
              }
            } else {
              setDisplay((prev) => {
                const next = [...prev];
                next[li] = randChar();
                return next;
              });
            }
          }, tickMs);
          timers.current.push(iv);
        }, li * letterDuration);
        timers.current.push(t0);
      });
    }

    if (variant === "serve") {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setFollowing(false);
      letters.forEach((_, i) => {
        if (i === 0) return; // already resting at S
        const t = setTimeout(() => {
          setPassIndex(i);
          if (i === letters.length - 1) {
            const t2 = setTimeout(() => setFollowing(true), 180);
            timers.current.push(t2);
          }
        }, i * 150 + 60);
        timers.current.push(t);
      });
    }

    if (variant === "explore") {
      setLangIndex((i) => (i + 1) % EXPLORE_WORDS.length);
      if (langTimer.current) clearInterval(langTimer.current);
      langTimer.current = setInterval(() => {
        setLangIndex((i) => (i + 1) % EXPLORE_WORDS.length);
      }, 620);
    }
  }, [variant, letters]);

  const runLeave = useCallback(() => {
    setHovered(false);
    if (variant === "learn") {
      timers.current.forEach(clearTimeout);
      setShowCheck(false);
      setDisplay(letters);
    }
    if (variant === "serve") {
      timers.current.forEach(clearTimeout);
      setFollowing(false);
      const t = setTimeout(() => setPassIndex(0), 350);
      timers.current.push(t);
    }
    if (variant === "explore" && langTimer.current) {
      clearInterval(langTimer.current);
      langTimer.current = null;
    }
  }, [variant, letters]);

  const onEnter = useCallback(() => {
    runEnter();
  }, [runEnter]);

  const onLeave = useCallback(() => {
    runLeave();
  }, [runLeave]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  // dot x-position for SERVE: center of the letter at passIndex, or following the cursor
  let dotLeft = 0;
  let dotTop = 12;
  if (ref.current && variant === "serve") {
    if (following) {
      dotLeft = mouse.x;
      dotTop = mouse.y;
    } else if (letterRefs.current[passIndex]) {
      const el = letterRefs.current[passIndex]!;
      dotLeft = passIndex === 0 ? el.offsetLeft - 7 : el.offsetLeft + el.offsetWidth / 2;
      dotTop = el.offsetTop - 6;
    }
  }

  const baseCls = `font-display ${size} leading-none tracking-tightest text-ink`;

  return (
    <div
      ref={ref}
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(e) => (e.key === "Enter" ? router.push(href) : null)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      className="group relative inline-flex cursor-pointer select-none py-3"
    >
      {variant === "explore" ? (
        <ExploreDoor letters={letters} baseCls={baseCls} hovered={hovered} langIndex={langIndex} />
      ) : (
        <div className="flex relative">
          {letters.map((letter, i) => {
            const style: React.CSSProperties = {};
            const content = display[i] ?? letter;

            if (variant === "eat" && hovered) {
              style.animation = `eat-bite 0.6s ${i * 0.07}s ease-out 1`;
            }

            if (variant === "create") {
              style.display = "inline-block";
              style.animation = hovered
                ? `create-draw 0.55s ${i * 0.06}s cubic-bezier(0.22,1,0.36,1) 1`
                : `create-ambient 3.4s ${i * 0.18}s ease-in-out infinite`;
            }

            if (variant === "move" && hovered && ref.current) {
              const rect = ref.current.getBoundingClientRect();
              const letterX = (rect.width / letters.length) * (i + 0.5);
              const dx = letterX - mouse.x;
              const dy = 18 - mouse.y * 0.15;
              const dist = Math.max(40 - Math.abs(dx), 0);
              const push = Math.sign(dx || 1) * dist * 0.9;
              style.display = "inline-block";
              style.transform = `translate(${push}px, ${Math.max(-18, Math.min(18, dy * 0.2))}px) rotate(${push * 0.4}deg)`;
              style.transition = "transform 0.15s cubic-bezier(0.22,1,0.36,1)";
            } else if (variant === "move") {
              style.display = "inline-block";
              style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
            }

            if (variant === "learn") {
              style.display = "inline-block";
            }

            return (
              <span
                key={variant === "eat" ? `${cycle}-${i}` : i}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                className={baseCls + (variant === "eat" ? " relative inline-block" : "")}
                style={style}
              >
                {content}
              </span>
            );
          })}

          {variant === "serve" && (
            <span
              className="pointer-events-none absolute h-2 w-2 rounded-full bg-tiger"
              style={{
                left: dotLeft,
                top: dotTop,
                opacity: hovered || following ? 1 : 0.55,
                transform: "translate(-50%,-50%)",
                transition: following
                  ? "left 0.08s linear, top 0.08s linear, opacity 0.2s"
                  : "left 0.14s cubic-bezier(0.22,1,0.36,1), top 0.14s cubic-bezier(0.22,1,0.36,1), opacity 0.2s",
              }}
            />
          )}

          {variant === "learn" && showCheck && (
            <span className="absolute -top-3 -right-5 text-tiger text-sm">✓</span>
          )}
        </div>
      )}

      <span className="pointer-events-none absolute -bottom-2 left-0 h-px w-0 bg-ink/25 group-hover:w-full transition-all duration-500" />

      <style jsx global>{`
        @keyframes eat-bite {
          0% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%, 0% 100%);
            opacity: 1;
            transform: translateY(0);
          }
          38% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 68% 100%, 54% 42%, 0% 100%);
            opacity: 1;
            transform: translateY(2px);
          }
          55% {
            clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%);
            opacity: 0;
            transform: translateY(5px);
          }
          56% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%, 0% 100%);
            opacity: 0;
            transform: translateY(-4px);
          }
          100% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%, 0% 100%);
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes create-ambient {
          0%, 100% { opacity: 0.55; clip-path: inset(0 0 0 0); }
          50% { opacity: 1; clip-path: inset(0 0 0 0); }
        }
        @keyframes create-draw {
          0% { clip-path: inset(0 100% 0 0); opacity: 0.3; }
          70% { clip-path: inset(0 0% 0 0); opacity: 1; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// EXPLORE — the word splits open like a double door on hover, revealing a
// gap where a rotating list of translations of "explore" appears.
function ExploreDoor({
  letters,
  baseCls,
  hovered,
  langIndex,
}: {
  letters: string[];
  baseCls: string;
  hovered: boolean;
  langIndex: number;
}) {
  const split = Math.ceil(letters.length / 2);
  const left = letters.slice(0, split).join("");
  const right = letters.slice(split).join("");

  return (
    <div className="relative inline-flex items-center" style={{ perspective: 700 }}>
      <span
        className={baseCls}
        style={{
          display: "inline-block",
          transformOrigin: "left center",
          transform: hovered ? "translateX(-0.85em) rotateY(-16deg)" : "translateX(0) rotateY(0deg)",
          transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {left}
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink/15"
        style={{
          width: "1px",
          opacity: hovered ? 0 : 1,
          transition: "opacity 0.3s",
          height: "0.8em",
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center whitespace-nowrap"
        style={{
          minWidth: hovered ? "1.6em" : 0,
          transition: "min-width 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <AnimatePresence mode="wait">
          {hovered && (
            <motion.span
              key={langIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="font-display italic text-tiger text-sm sm:text-base md:text-lg lg:text-xl"
            >
              {EXPLORE_WORDS[langIndex]}
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <span
        className={baseCls}
        style={{
          display: "inline-block",
          transformOrigin: "right center",
          transform: hovered ? "translateX(0.85em) rotateY(16deg)" : "translateX(0) rotateY(0deg)",
          transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {right}
      </span>
    </div>
  );
}
