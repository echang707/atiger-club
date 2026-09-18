"use client";

import Link from "next/link";
import type { Member } from "@/lib/member";
import { memberInitials } from "@/lib/member";

export const MARK = "font-mono text-[11px] tracking-wideish uppercase";
export const BODY = "text-[17px] leading-relaxed text-ink/70";

/* ─── Avatar ───────────────────────────────────────────────────────── */

export function Avatar({ member, size = 72 }: { member: Member; size?: number }) {
  if (member.avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={member.avatarUrl}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="grid shrink-0 place-items-center rounded-full bg-tiger-fill font-wordmark font-extrabold text-white select-none"
    >
      {memberInitials(member)}
    </span>
  );
}

/* ─── Page hero ─────────────────────────────────────────────────────── */

export function ClubHero({
  member,
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  member: Member;
  eyebrow: string;
  title: string;
  subtitle?: string | null;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b border-ink/10 bg-paper">
      <div className="mx-auto max-w-content px-6 pt-12 pb-14 md:px-10 md:pt-20 md:pb-20">
        <p className={`${MARK} text-tiger-text mb-8 md:mb-12`}>{eyebrow}</p>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
          <Avatar member={member} size={88} />

          <div className="flex-1 min-w-0">
            <h1 className="font-wordmark font-extrabold text-ink tracking-tight leading-[1.0] text-[clamp(2rem,6vw,3.5rem)]">
              {title}
            </h1>
            {subtitle && (
              <p className={`${MARK} text-ink/45 mt-3`}>{subtitle}</p>
            )}
            {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Content section ────────────────────────────────────────────────── */

export function ClubSection({
  eyebrow,
  children,
  action,
}: {
  eyebrow: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="border-b border-ink/10 last:border-b-0">
      <div className="mx-auto max-w-content px-6 py-10 md:px-10 md:py-14">
        <div className="flex items-baseline justify-between gap-4 mb-6 md:mb-8">
          <p className={`${MARK} text-ink/45`}>{eyebrow}</p>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ─── Profile detail row ─────────────────────────────────────────────── */

export function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-4 py-4 border-b border-ink/8 last:border-b-0">
      <dt className={`${MARK} text-ink/40 pt-0.5`}>{label}</dt>
      <dd className={`text-[16px] ${value ? "text-ink" : "text-ink/30"}`}>
        {value || "Not added yet"}
      </dd>
    </div>
  );
}

/* ─── Quiet link ──────────────────────────────────────────────────────── */

export function ClubLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`organic-underline ${MARK} text-ink transition-colors hover:text-tiger-text`}
    >
      {children}
    </Link>
  );
}

/* Kept for backward compat — Profile page uses this */
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
    <ClubHero
      member={member}
      eyebrow={mark}
      title={title}
      subtitle={meta}
    />
  );
}
