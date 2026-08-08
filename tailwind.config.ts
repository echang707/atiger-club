import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF6EF",
        ink: "#201D1A",
        amber: {
          DEFAULT: "#E2A63B",
          soft: "#F1CE8C",
          deep: "#B9822A",
        },
        rust: "#C1652F",
        sage: "#6E7B5E",
        stone: "#EFEAE0",
        "stone-dark": "#E1DACB",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        content: "1400px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
