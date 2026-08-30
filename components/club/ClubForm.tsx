"use client";

/* Shared furniture for the four auth screens. Built out of the tokens
   already in the theme — tiger-fill, ink, font-display, max-w-content,
   organic-underline — so these pages read as part of the site rather
   than a bolted-on account system. No new colours, no new type scale. */

import Link from "next/link";

export function ClubShell({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    // pt clears the fixed nav (76px mobile / 80px desktop) with room to
    // breathe; the page is deliberately short so it never scrolls on a
    // phone with the keyboard open.
    <main className="min-h-svh px-5 pb-24 pt-32 sm:px-6 md:px-10 md:pt-40">
      <div className="mx-auto w-full max-w-[26rem]">
        <p className="font-mono text-[11px] uppercase tracking-wideish text-tiger-text">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-[2rem] leading-[1.1] text-ink md:text-[2.5rem]">
          {title}
        </h1>
        <div className="mt-8">{children}</div>
        {footer ? (
          <div className="mt-8 text-[15px] text-ink/70">{footer}</div>
        ) : null}
      </div>
    </main>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label htmlFor={id} className="block">
      <span className="font-mono text-[11px] uppercase tracking-wideish text-ink/60">
        {label}
      </span>
      <input
        id={id}
        {...props}
        className="mt-2 w-full rounded-sm border border-ink/15 bg-transparent px-3 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-tiger-fill"
      />
    </label>
  );
}
/* 16px on inputs is not a style choice — iOS Safari zooms the viewport
   on focus for anything smaller, which on a fixed-nav layout looks like
   the page is broken. */

export function SubmitButton({
  children,
  pending,
  ...props
}: { pending?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      {...props}
      disabled={pending || props.disabled}
      className="w-full rounded-full border-2 border-tiger-fill bg-tiger-fill px-5 py-3 text-[15px] font-semibold leading-none text-white transition-colors duration-300 hover:border-tiger-deep hover:bg-tiger-deep disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "One moment…" : children}
    </button>
  );
}

export function FormError({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-[14px] leading-snug text-tiger-text">
      {children}
    </p>
  );
}

export function FormNote({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] leading-snug text-ink/70">{children}</p>;
}

export function ClubLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="organic-underline font-semibold text-ink">
      {children}
    </Link>
  );
}

/* One place that turns an AuthFailure into words. Note that
   "invalid_input" on signup says nothing about whether the address is
   already registered — see the adapter for why. */
export const AUTH_MESSAGES: Record<string, string> = {
  invalid_credentials: "That email and password don't match. Try again?",
  invalid_input: "We couldn't create an account with those details.",
  weak_password: "Passwords need to be at least 8 characters.",
  rate_limited: "Too many tries just now. Give it a minute.",
  member_record_failed:
    "Your login worked but we couldn't open your club record. Get in touch and we'll sort it.",
  unavailable: "Something went wrong on our end. Try again shortly.",
};
