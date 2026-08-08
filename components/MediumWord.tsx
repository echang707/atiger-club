"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Variant = "eat" | "create" | "move" | "explore" | "serve" | "learn";

const SCRAMBLE = "!@#$%^&*+=?<>XQZKY";

function randChar() {
  return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
}

export default function MediumWord({
  word,
  variant,
  href,
}: {
  word: string;
  variant: Variant;
  href: string;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const letters = word.split("");

  // LEARN scramble state
  const [display, setDisplay] = useState(letters);
  const timers = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const onEnter = useCallback(() => {
    setHovered(true);
    setCycle((c) => c + 1);

    if (variant === "learn") {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      letters.forEach((letter, i) => {
        let ticks = 0;
        const maxTicks = 5 + i * 2;
        const iv = setInterval(() => {
          ticks++;
          setDisplay((prev) => {
            const next = [...prev];
            next[i] = ticks >= maxTicks ? letter : randChar();
            return next;
          });
          if (ticks >= maxTicks) clearInterval(iv);
        }, 45);
        timers.current.push(iv);
      });
    }
  }, [variant, letters]);

  const onLeave = useCallback(() => {
    setHovered(false);
    if (variant === "learn") {
      timers.current.forEach(clearTimeout);
      setDisplay(letters);
    }
  }, [variant, letters]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

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
      className="group relative inline-flex cursor-pointer select-none py-2"
      style={{ perspective: "600px" }}
    >
      <div className="flex">
        {letters.map((letter, i) => {
          const style: React.CSSProperties = {};
          let animClass = "";
          let content: string = display[i] ?? letter;

          if (variant === "eat" && hovered) {
            style.animation = `eat-bite 0.7s ${i * 0.09}s cubic-bezier(.6,-0.2,.4,1.4) 1`;
          }

          if (variant === "create") {
            style.display = "inline-block";
            style.clipPath = hovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)";
            style.opacity = hovered ? 1 : 0.94;
            style.transition = `clip-path 0.5s ${i * 0.06}s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ${i * 0.06}s`;
          }

          if (variant === "move" && hovered && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const letterX = (rect.width / letters.length) * (i + 0.5);
            const dx = letterX - mouse.x;
            const dy = 18 - mouse.y * 0.15;
            const dist = Math.max(40 - Math.abs(dx), 0);
            const push = Math.sign(dx || 1) * dist * 0.9;
            style.transform = `translate(${push}px, ${Math.max(-18, Math.min(18, dy * 0.2))}px) rotate(${push * 0.4}deg)`;
            style.transition = "transform 0.15s cubic-bezier(0.22,1,0.36,1)";
          } else if (variant === "move") {
            style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
          }

          if (variant === "explore") {
            const dir = [
              [-6, -10], [8, -14], [-10, 6], [12, 8], [-4, 12], [10, -4], [0, -16],
            ][i % 7];
            style.display = "inline-block";
            style.transform = hovered
              ? `translate(${dir[0]}px, ${dir[1]}px)`
              : "translate(0,0)";
            style.transition = `transform 0.5s ${i * 0.04}s cubic-bezier(0.22,1,0.36,1)`;
          }

          if (variant === "serve") {
            const isLast = i === letters.length - 1;
            style.display = "inline-block";
            style.transformOrigin = "bottom center";
            style.transform = hovered
              ? `translateX(${(i - letters.length / 2) * 3}px) skewX(${isLast ? -8 : -2}deg) scaleX(${isLast ? 1.15 : 1})`
              : "translateX(0) skewX(0) scaleX(1)";
            style.transition = `transform 0.45s ${i * 0.03}s cubic-bezier(0.22,1,0.36,1)`;
          }

          return (
            <span
              key={variant === "eat" || variant === "learn" ? `${cycle}-${i}` : i}
              className={`font-display text-[13vw] leading-none sm:text-6xl md:text-7xl lg:text-8xl tracking-tightest text-ink ${animClass}`}
              style={style}
            >
              {content}
            </span>
          );
        })}
      </div>

      {variant === "explore" && (
        <svg
          className="pointer-events-none absolute -bottom-2 left-0 w-full h-4 opacity-0 group-hover:opacity-60 transition-opacity duration-500"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
        >
          <line x1="2" y1="5" x2="98" y2="5" stroke="#E2531C" strokeWidth="1" strokeDasharray="1.5 3" />
        </svg>
      )}

      {variant === "serve" && (
        <span
          className="pointer-events-none absolute top-1/2 h-1.5 w-1.5 rounded-full bg-tiger opacity-0 group-hover:opacity-100 transition-all duration-700 ease-smooth"
          style={{
            left: hovered ? "92%" : "8%",
            transform: "translateY(-50%)",
          }}
        />
      )}

      <span className="pointer-events-none absolute -bottom-3 left-0 h-px w-0 bg-ink/25 group-hover:w-full transition-all duration-500" />

      <style jsx>{`
        @keyframes eat-bite {
          0% { transform: scale(1) rotate(0deg); opacity: 1; clip-path: inset(0 0 0 0); }
          35% { transform: scale(0.75) translateY(6px) rotate(-8deg); opacity: 0.3; clip-path: inset(0 35% 0 0); }
          60% { transform: scale(0.55) translateY(10px) rotate(6deg); opacity: 0; clip-path: inset(0 60% 0 0); }
          61% { transform: scale(0.55) translateY(-6px) rotate(0deg); opacity: 0; }
          100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; clip-path: inset(0 0 0 0); }
        }
      `}</style>
    </div>
  );
}
