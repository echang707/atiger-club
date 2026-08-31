"use client";

/* Shared furniture for the two member pages.

   These reuse the About page's vernacular rather than inventing a
   member-area style: full-bleed hairline rules, a mono mark above the
   content, the wordmark grotesque for anything that carries weight. No
   cards, no shadows, no rounded panels — the site doesn't use them, and
   a member area built out of them would read as a different product
   bolted on.

   The greys are the site's, too. Marks sit at ink/45 and body at ink/70,
   which is what About and the event rows use. The earlier version put
   almost everything at ink/60, so labels and content had the same
   weight and the whole page looked washed out and unfinished. */

import type { Member } from "@/lib/member";
import { memberInitials } from "@/lib/member";

export const MARK = "font-mono text-[11px] tracking-wideish uppercase";
export const NAME =
  "font-wordmark font-extrabold text-ink tracking-tight leading-[1.0] text-[8.5vw] md:text-[3.4vw] lg:text-[2.9vw]";
export const BODY = "text-base md:text-lg text-ink/70 leading-relaxed";

export function Avatar({
  member,
  size = 56,
}: {
  member: Member;
  size?: number;
}) {
  const px = { width: size, height: size };
  if (member.avatarUrl) {
    /* Plain <img>, not next/image: the URL is user-supplied and lives on
       a Supabase host, which would need allow-listing in next.config and
       would route one small avatar through an image-optimisation Worker
       on Cloudflare for no benefit. */
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={member.avatarUrl}
        alt=""
        style={px}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={px}
      className="grid shrink-0 place-items-center rounded-full bg-tiger-fill font-wordmark font-extrabold text-white"
    >
      <span style={{ fontSize: size * 0.34 }}>{memberInitials(member)}</span>
    </span>
  );
}

/* The page's one bold moment: the member's own name, set in the same
   face the site uses for its largest statements. Everything below it is
   deliberately quiet. */
export function ClubMasthead({
  member,
  mark,
  title,
  meta,
}: {
  member: Member;
  mark: string;
  title: string;
  meta?: string | null;
}) {
  return (
    <header className="border-b border-ink/12">
      <div className="mx-auto max-w-content px-6 py-10 md:px-10 md:py-16">
        <p className={`${MARK} text-tiger-text`}>{mark}</p>
        <div className="mt-5 flex items-center gap-4 md:mt-7 md:gap-6">
          <Avatar member={member} size={56} />
          <div className="min-w-0">
            <h1 className={NAME}>{title}</h1>
            {meta ? (
              <p className={`${MARK} mt-2 text-ink/45`}>{meta}</p>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

/* A section of the page. The rule and the mark are the structure; there
   is no box. */
export function ClubSection({
  mark,
  children,
}: {
  mark: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-ink/12">
      <div className="mx-auto max-w-content px-6 py-8 md:px-10 md:py-12">
        <p className={`${MARK} text-ink/45`}>{mark}</p>
        <div className="mt-4 md:mt-5">{children}</div>
      </div>
    </section>
  );
}

/* Label/value pair. The label column is fixed so every value on the page
   shares one left edge, the same way About aligns its claims. */
export function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-ink/10 py-3 last:border-b-0 sm:flex-row sm:gap-6">
      <dt className={`${MARK} shrink-0 pt-1 text-ink/45 sm:w-40`}>{label}</dt>
      <dd
        className={`text-base ${value ? "text-ink" : "text-ink/35"} break-words`}
      >
        {value || "Not added yet"}
      </dd>
    </div>
  );
}
