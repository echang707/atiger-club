import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cream is the page. It is also, exactly, the cream inside the
        // tiger-marble image — the marble's highlights were colour-matched
        // to this value so the hero dissolves into the page instead of
        // sitting on top of it as a pasted-in panel.
        paper: "#F4E9D6",
        "paper-dim": "#EADCC0",
        ink: "#15130E",
        "ink-soft": "#15130E99",
        tiger: {
          // THE Tiger Club orange. This exact value, everywhere the brand
          // orange is meant: rules, marks, borders, fills behind large
          // shapes, the wordmark artwork itself. Never substituted.
          DEFAULT: "#e0521c",
          // #e0521c is 3.24:1 on cream — fine for graphics (needs 3:1),
          // below AA for small text (needs 4.5:1). These two steps are
          // used ONLY where orange carries text or sits behind it, so the
          // brand orange never has to be compromised to stay legible.
          text: "#BE3F0E",
          fill: "#CC4413",
          soft: "#F0A15F",
          deep: "#A9350C",
        },
        jungle: {
          DEFAULT: "#26331A",
          soft: "#4B5B30",
        },
        brass: "#B98A34",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
        mono: ["var(--font-jetbrains)", "monospace"],
        wordmark: ["var(--font-bricolage)", "sans-serif"],
        tagline: ["var(--font-instrument)", "serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        wideish: "0.14em",
      },
      maxWidth: {
        content: "1400px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        snap: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        walk: {
          "0%": { transform: "translateX(-10vw)" },
          "100%": { transform: "translateX(110vw)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-1%,-2%)" },
          "30%": { transform: "translate(2%,1%)" },
          "50%": { transform: "translate(-1%,2%)" },
          "70%": { transform: "translate(1%,-1%)" },
          "90%": { transform: "translate(-2%,1%)" },
        },
      },
      animation: {
        walk: "walk 18s linear infinite",
        grain: "grain 1.4s steps(4) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
