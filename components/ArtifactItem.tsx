"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export type ArtifactKind =
  | "polaroid"
  | "note"
  | "ticket"
  | "atl"
  | "doodle"
  | "stamp"
  | "receipt"
  | "paw"
  | "flyer"
  | "wordlist"
  | "snippet";

export type Artifact = {
  id: string;
  kind: ArtifactKind;
  top: string;
  left: string;
  rotate: number;
  depth: number;
  draggable?: boolean;
  width?: number;
  image?: string;
  caption?: string;
  text?: string;
  reveal?: { title: string; meta: string; url: string };
};

export default function ArtifactItem({
  artifact,
  mvX,
  mvY,
  interactive,
}: {
  artifact: Artifact;
  mvX: MotionValue<number>;
  mvY: MotionValue<number>;
  interactive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { kind, rotate, depth, draggable, width, image, caption, text, reveal } = artifact;

  const px = useTransform(mvX, (v) => v * depth * 26);
  const py = useTransform(mvY, (v) => v * depth * 26);
  const rY = useTransform(mvX, (v) => v * depth * 10);
  const rX = useTransform(mvY, (v) => v * depth * -10);

  const baseStyle = interactive
    ? {
        x: draggable ? undefined : px,
        y: draggable ? undefined : py,
        rotateY: draggable ? 0 : rY,
        rotateX: draggable ? 0 : rX,
        rotate,
      }
    : { rotate };

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: interactive ? "absolute" : "relative",
        top: interactive ? artifact.top : undefined,
        left: interactive ? artifact.left : undefined,
        width: width ?? 150,
        perspective: 600,
        ...baseStyle,
      }}
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.12}
      whileHover={{ scale: 1.07, zIndex: 40 }}
      whileDrag={{ scale: 1.1, zIndex: 50, cursor: "grabbing" }}
      onClick={() => reveal && setOpen((v) => !v)}
      className={`group ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${
        reveal ? "cursor-pointer" : ""
      }`}
    >
      <ArtifactBody kind={kind} image={image} text={text} />

      {caption && (
        <p className="font-hand text-lg text-ink/70 text-center mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {caption}
        </p>
      )}

      {reveal && open && (
        <motion.a
          href={reveal.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-56 bg-ivory paper-shadow rounded-xl p-4 text-left"
        >
          <p className="font-display text-base text-ink leading-snug mb-1">
            {reveal.title}
          </p>
          <p className="text-xs text-ink/60 mb-2">{reveal.meta}</p>
          <span className="text-xs font-medium underline-stripe text-ink">
            Learn more ↗
          </span>
        </motion.a>
      )}
    </motion.div>
  );
}

function ArtifactBody({
  kind,
  image,
  text,
}: {
  kind: ArtifactKind;
  image?: string;
  text?: string;
}) {
  switch (kind) {
    case "polaroid":
      return (
        <div className="bg-ivory p-2.5 pb-8 paper-shadow rounded-sm">
          <div className="relative w-full aspect-square bg-stone overflow-hidden">
            {image && (
              <Image src={image} alt="" fill sizes="200px" className="object-cover" />
            )}
          </div>
        </div>
      );

    case "note":
      return (
        <div className="bg-amber-soft/70 paper-shadow rounded-sm px-4 py-5">
          <p className="font-hand text-xl text-ink/80 leading-snug">{text}</p>
        </div>
      );

    case "ticket":
      return (
        <div className="bg-ivory paper-shadow rounded-md px-4 py-3 border border-dashed border-ink/25 relative overflow-hidden">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-stone" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-stone" />
          <p className="text-[10px] uppercase tracking-[0.15em] text-ink/40 mb-1">
            Admit One
          </p>
          <p className="font-display text-sm text-ink leading-snug">{text}</p>
        </div>
      );

    case "atl":
      return (
        <div className="bg-ink text-ivory rounded-full px-4 py-2.5 paper-shadow text-center">
          <p className="font-display text-sm tracking-wide">{text}</p>
        </div>
      );

    case "doodle":
      return (
        <svg viewBox="0 0 100 80" className="w-full text-ink/60">
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 55 Q15 30 35 22 Q40 12 50 20 Q60 12 65 22 Q85 30 80 55 Q82 68 65 68 L60 62 L55 68 L45 68 L40 62 L35 68 Q18 68 20 55 Z" />
            <circle cx="38" cy="42" r="2.5" fill="currentColor" stroke="none" />
            <circle cx="62" cy="42" r="2.5" fill="currentColor" stroke="none" />
            <path d="M42 52 Q50 58 58 52" />
            <path d="M25 40 L35 44 M75 40 L65 44" />
          </g>
        </svg>
      );

    case "stamp":
      return (
        <div className="w-28 h-28 rounded-full border-[3px] border-double border-rust/70 flex items-center justify-center text-center rotate-[-6deg] paper-shadow bg-ivory/60">
          <p className="font-hand text-lg text-rust leading-none px-2">{text}</p>
        </div>
      );

    case "receipt":
      return (
        <div className="bg-ivory paper-shadow px-3 py-4 font-mono text-[10px] text-ink/60 leading-relaxed whitespace-pre-line torn-edge">
          {text}
        </div>
      );

    case "paw":
      return (
        <svg viewBox="0 0 60 60" className="w-full text-amber-deep/70">
          <g fill="currentColor">
            <ellipse cx="30" cy="40" rx="14" ry="11" />
            <ellipse cx="14" cy="24" rx="6" ry="8" />
            <ellipse cx="46" cy="24" rx="6" ry="8" />
            <ellipse cx="22" cy="14" rx="5" ry="7" />
            <ellipse cx="38" cy="14" rx="5" ry="7" />
          </g>
        </svg>
      );

    case "flyer":
      return (
        <div className="bg-ivory paper-shadow torn-edge px-4 pt-4 pb-3 border-t-2 border-rust">
          <p className="text-[10px] uppercase tracking-[0.15em] text-ink/40 mb-1">
            Save the date
          </p>
          <p className="font-display text-base text-ink leading-snug">{text}</p>
        </div>
      );

    case "wordlist":
      return (
        <div className="text-right">
          {(text ?? "").split("·").map((w, i) => (
            <p key={i} className="font-display italic text-ink/25 text-lg leading-tight">
              {w.trim()}
            </p>
          ))}
        </div>
      );

    case "snippet":
    default:
      return (
        <p className="font-hand text-2xl text-ink/70 leading-tight">{text}</p>
      );
  }
}
