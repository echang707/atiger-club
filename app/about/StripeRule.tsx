"use client";

import { motion } from "framer-motion";

// A single stripe of the brand pattern, drawn as a rule that wipes open
// when it enters view. Used instead of a border between movements — it is
// the tiger motif at its quietest, and it keeps the page feeling like one
// continuous piece of art direction rather than a stack of sections.
export default function StripeRule({
  className = "",
  align = "left",
}: {
  className?: string;
  align?: "left" | "right" | "full";
}) {
  const width = align === "full" ? "100%" : "clamp(90px, 22vw, 260px)";
  return (
    <motion.div
      aria-hidden="true"
      className={`h-[3px] rounded-full bg-tiger ${
        align === "right" ? "ml-auto" : ""
      } ${className}`}
      style={{ width, transformOrigin: align === "right" ? "right" : "left" }}
      initial={{ scaleX: 0, opacity: 0.7 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
