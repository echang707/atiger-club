"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type Variant = "eat" | "create" | "move" | "explore" | "serve" | "learn";

const SCRAMBLE = "!@#$%^&*+=?<>XQZKY";
function randChar() {
  return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
}

// "connection" in many languages, for the gap that opens in EXPLORE
const CONNECTION_WORDS = [
  "connection",
  "conexión",
  "connexion",
  "conexão",
  "connessione",
  "Verbindung",
  "つながり",
  "연결",
  "连接",
  "kết nối",
  "जुड़ाव",
  "muunganisho",
  "اتصال",
  "ìsopọ̀",
  "pilina",
  "ukuxhumana",
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

    if (variant === "explore") {
      setLangIndex((i) => (i + 1) % CONNECTION_WORDS.length);
      if (langTimer.current) clearInterval(langTimer.current);
      langTimer.current = setInterval(() => {
        setLangIndex((i) => (i + 1) % CONNECTION_WORDS.length);
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

  // Detect touch / no-hover devices so we can trigger the animation on
  // scroll instead of on a hover event that will never fire.
  const [noHover, setNoHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    setNoHover(mq.matches);
    const onChange = () => setNoHover(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (!noHover || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runEnter();
          const t = setTimeout(() => runLeave(), 1500);
          timers.current.push(t);
        } else {
          runLeave();
        }
      },
      { threshold: 0.55 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noHover]);

  const onEnter = useCallback(() => {
    if (noHover) return;
    runEnter();
  }, [noHover, runEnter]);

  const onLeave = useCallback(() => {
    if (noHover) return;
    runLeave();
  }, [noHover, runLeave]);

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
              style.animation = `eat-bite 0.85s ${i * 0.09}s cubic-bezier(.6,-0.2,.4,1.4) 1`;
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
                {variant === "eat" && hovered && <EatCrumbs delay={i * 0.09} />}
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
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 66% 100%, 66% 100%, 0% 100%);
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          28% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 66% 100%, 48% 58%, 0% 100%);
            transform: scale(0.94) rotate(-4deg);
            opacity: 1;
          }
          50% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 40% 100%, 15% 30%, 0% 100%);
            transform: scale(0.7) translateY(8px) rotate(8deg);
            opacity: 0.35;
          }
          64% {
            clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%);
            transform: scale(0.25) translateY(14px) rotate(14deg);
            opacity: 0;
          }
          65% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 66% 100%, 66% 100%, 0% 100%);
            transform: scale(0.25) translateY(-12px) rotate(0deg);
            opacity: 0;
          }
          100% {
            clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 66% 100%, 66% 100%, 0% 100%);
            transform: scale(1) translateY(0) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes crumb-fall {
          0%, 40% { opacity: 0; transform: translate(0, 0) scale(0.6); }
          52% { opacity: 1; transform: translate(var(--cx), 2px) scale(1); }
          100% { opacity: 0; transform: translate(calc(var(--cx) * 1.6), 22px) scale(0.4); }
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

function EatCrumbs({ delay }: { delay: number }) {
  return (
    <>
      <span
        className="pointer-events-none absolute h-1 w-1 rounded-full bg-tiger-deep/70"
        style={{ left: "60%", top: "60%", ["--cx" as string]: "6px", animation: `crumb-fall 0.85s ${delay}s ease-out 1` }}
      />
      <span
        className="pointer-events-none absolute h-[3px] w-[3px] rounded-full bg-tiger-deep/60"
        style={{ left: "45%", top: "68%", ["--cx" as string]: "-8px", animation: `crumb-fall 0.85s ${delay + 0.03}s ease-out 1` }}
      />
      <span
        className="pointer-events-none absolute h-1 w-1 rounded-full bg-tiger-deep/50"
        style={{ left: "52%", top: "50%", ["--cx" as string]: "3px", animation: `crumb-fall 0.85s ${delay + 0.06}s ease-out 1` }}
      />
    </>
  );
}

// EXPLORE — the word splits open like a double door on hover, revealing a
// gap where a rotating list of translations of "connection" appears.
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
              {CONNECTION_WORDS[langIndex]}
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
