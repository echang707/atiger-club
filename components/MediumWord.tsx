"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Variant = "eat" | "create" | "move" | "explore" | "serve" | "learn";

const SCRAMBLE = "!@#$%^&*+=?<>XQZKY";
function randChar() {
  return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
}

// LEARN starts partially masked, e.g. "L?A?N" — matches the word's own letters
// masked at fixed indices so it reads as almost-legible, not random.
function maskedLearn(letters: string[]) {
  return letters.map((l, i) => (i === 1 || i === 3 ? "?" : l));
}

const EXPLORE_TEXTURE =
  "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=800&auto=format&fit=crop";

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

  // LEARN state
  const [display, setDisplay] = useState<string[]>(() =>
    variant === "learn" ? maskedLearn(letters) : letters
  );
  const [showCheck, setShowCheck] = useState(false);
  const timers = useRef<NodeJS.Timeout[]>([]);

  // SERVE state — dot rests beside the S (index 0) until hovered
  const [passIndex, setPassIndex] = useState(0);
  const [following, setFollowing] = useState(false);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const onEnter = useCallback(() => {
    setHovered(true);
    setCycle((c) => c + 1);

    if (variant === "eat") {
      // handled via key remount below
    }

    if (variant === "learn") {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setShowCheck(false);
      letters.forEach((letter, i) => {
        let ticks = 0;
        const maxTicks = 6 + i * 3;
        const iv = setInterval(() => {
          ticks++;
          setDisplay((prev) => {
            const next = [...prev];
            next[i] = ticks >= maxTicks ? letter : randChar();
            return next;
          });
          if (ticks >= maxTicks) {
            clearInterval(iv);
            if (i === letters.length - 1) {
              const t = setTimeout(() => {
                setShowCheck(true);
                const t2 = setTimeout(() => setShowCheck(false), 650);
                timers.current.push(t2);
              }, 80);
              timers.current.push(t);
            }
          }
        }, 40);
        timers.current.push(iv);
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
  }, [variant, letters]);

  const onLeave = useCallback(() => {
    setHovered(false);
    if (variant === "learn") {
      timers.current.forEach(clearTimeout);
      setShowCheck(false);
      const t = setTimeout(() => setDisplay(maskedLearn(letters)), 500);
      timers.current.push(t);
    }
    if (variant === "serve") {
      timers.current.forEach(clearTimeout);
      setFollowing(false);
      const t = setTimeout(() => setPassIndex(0), 350);
      timers.current.push(t);
    }
  }, [variant, letters]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    []
  );

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
      style={
        variant === "explore"
          ? ({ "--mx": `${mouse.x}px`, "--my": `${mouse.y}px` } as React.CSSProperties)
          : undefined
      }
    >
      <div className="flex relative">
        {letters.map((letter, i) => {
          const style: React.CSSProperties = {};
          const content = display[i] ?? letter;
          const baseCls = `font-display ${size} leading-none tracking-tightest text-ink`;

          if (variant === "eat" && hovered) {
            style.animation = `eat-bite 0.7s ${i * 0.09}s cubic-bezier(.6,-0.2,.4,1.4) 1`;
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
            style.color = content === "?" ? "rgba(21,19,14,0.32)" : undefined;
          }

          if (variant === "explore") {
            return (
              <span
                key={i}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                className="relative inline-block"
              >
                <span className={baseCls} aria-hidden="true">
                  {letter}
                </span>
                <span
                  className={`${baseCls} absolute inset-0`}
                  aria-hidden="true"
                  style={{
                    backgroundImage: `url(${EXPLORE_TEXTURE})`,
                    backgroundSize: "cover",
                    backgroundPosition: `${i * 14}% 40%`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitMaskImage: hovered
                      ? "radial-gradient(circle 60px at var(--mx) var(--my), black 35%, transparent 72%)"
                      : "radial-gradient(circle 0px at var(--mx) var(--my), black 0%, transparent 0%)",
                    maskImage: hovered
                      ? "radial-gradient(circle 60px at var(--mx) var(--my), black 35%, transparent 72%)"
                      : "radial-gradient(circle 0px at var(--mx) var(--my), black 0%, transparent 0%)",
                    transition: "mask-image 0.05s linear",
                  }}
                >
                  {letter}
                </span>
              </span>
            );
          }

          return (
            <span
              key={variant === "eat" ? `${cycle}-${i}` : i}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
              className={baseCls}
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

      <span className="pointer-events-none absolute -bottom-2 left-0 h-px w-0 bg-ink/25 group-hover:w-full transition-all duration-500" />

      <style jsx>{`
        @keyframes eat-bite {
          0% { transform: scale(1) rotate(0deg); opacity: 1; clip-path: inset(0 0 0 0); }
          35% { transform: scale(0.75) translateY(6px) rotate(-8deg); opacity: 0.3; clip-path: inset(0 35% 0 0); }
          60% { transform: scale(0.55) translateY(10px) rotate(6deg); opacity: 0; clip-path: inset(0 60% 0 0); }
          61% { transform: scale(0.55) translateY(-6px) rotate(0deg); opacity: 0; }
          100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; clip-path: inset(0 0 0 0); }
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
