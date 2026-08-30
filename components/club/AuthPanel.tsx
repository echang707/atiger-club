"use client";

/* One screen, two modes.

   The brief: one button, and once you're there you can either create an
   account or log in depending on what you have. So rather than two
   separate pages that each send you to the other, this is a single panel
   with a toggle — the fields for the mode you're not in simply aren't
   there, and switching keeps the email you already typed.

   /join and /login both render this, defaulting to their own mode, so
   existing links and the sitemap entry keep working and someone can
   still be sent straight to "log in" from a password-reset flow. */

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
  AUTH_MESSAGES,
  ClubShell,
  Field,
  FormError,
  FormNote,
  SubmitButton,
} from "./ClubForm";
import { useMember } from "./MemberProvider";
import { signIn, signUp } from "@/lib/club/supabase";

type Mode = "join" | "login";
const MIN_PASSWORD = 8;

/* Only same-site paths are honoured — an open redirect here would let a
   phishing link wear the atigerclub.com domain. */
function safeNext(raw: string | null): string {
  if (!raw) return "/member";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/member";
  return raw;
}

function Panel({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { member, loading } = useMember();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (!loading && member) router.replace(next);
  }, [loading, member, next, router]);

  function switchTo(m: Mode) {
    setMode(m);
    setError(null);
    setPassword("");
    // Deliberately keeps `email` — someone who typed the wrong mode
    // shouldn't have to retype what they already got right.
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "join") {
      if (!firstName.trim() || !lastName.trim()) {
        setError("We just need your first and last name.");
        return;
      }
      if (password.length < MIN_PASSWORD) {
        setError(AUTH_MESSAGES.weak_password);
        return;
      }
    }

    setPending(true);
    const res =
      mode === "join"
        ? await signUp({ firstName, lastName, email, password })
        : await signIn(email, password);
    setPending(false);

    if (!res.ok) {
      setError(AUTH_MESSAGES[res.reason] ?? AUTH_MESSAGES.unavailable);
      return;
    }
    if (res.member === null) {
      setCheckEmail(true);
      return;
    }
    router.replace(next);
  }

  if (checkEmail) {
    return (
      <ClubShell eyebrow="Membership" title="You're in — almost.">
        <FormNote>
          We've sent a confirmation link to {email.trim()}. Click it and your
          club is open.
        </FormNote>
      </ClubShell>
    );
  }

  const joining = mode === "join";

  return (
    <ClubShell
      eyebrow="Membership"
      title={joining ? "Join the club." : "Welcome back."}
      footer={
        <button
          type="button"
          onClick={() => switchTo(joining ? "login" : "join")}
          className="text-left"
        >
          {joining ? "Already a member? " : "New to Tiger Club? "}
          <span className="organic-underline font-semibold text-ink">
            {joining ? "Log in" : "Join free"}
          </span>
        </button>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {joining ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="First name"
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Field
              label="Last name"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        ) : null}

        <Field
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={joining ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {joining ? <FormNote>At least {MIN_PASSWORD} characters.</FormNote> : null}

        <FormError>{error}</FormError>
        <SubmitButton pending={pending}>
          {joining ? "Join free" : "Log in"}
        </SubmitButton>

        {joining ? (
          <FormNote>
            Free, always. Membership gets you member pricing on Tiger Club
            experiences.
          </FormNote>
        ) : (
          <p className="text-[14px] text-ink/70">
            <Link
              href="/forgot-password"
              className="organic-underline font-semibold text-ink"
            >
              Forgot your password?
            </Link>
          </p>
        )}
      </form>
    </ClubShell>
  );
}

/* useSearchParams needs a Suspense boundary or Next opts the whole route
   into dynamic rendering — which on Cloudflare means a Worker
   invocation per view instead of a static file. */
export default function AuthPanel({ initialMode }: { initialMode: Mode }) {
  return (
    <Suspense
      fallback={
        <ClubShell
          eyebrow="Membership"
          title={initialMode === "join" ? "Join the club." : "Welcome back."}
        >
          {null}
        </ClubShell>
      }
    >
      <Panel initialMode={initialMode} />
    </Suspense>
  );
}
