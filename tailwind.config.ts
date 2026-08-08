import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F0E3",
        "paper-dim": "#ECE4D0",
        ink: "#15130E",
        "ink-soft": "#15130E99",
        tiger: {
          DEFAULT: "#E2531C",
          soft: "#F0A15F",
          deep: "#B23E14",
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
