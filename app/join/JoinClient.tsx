"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  AUTH_MESSAGES,
  ClubLink,
  ClubShell,
  Field,
  FormError,
  FormNote,
  SubmitButton,
} from "@/components/club/ClubForm";
import { useMember } from "@/components/club/MemberProvider";
import { signUp } from "@/lib/club/supabase";

/* Where to send someone after they join. Taken from ?next= so that
   "Join free" on an event page returns them to that event rather than
   dumping them on a dashboard — the brief asks for exactly this.

   Only same-site paths are honoured: an open redirect here would let a
   phishing link wear the atigerclub.com domain. */
function safeNext(raw: string | null): string {
  if (!raw) return "/member";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/member";
  return raw;
}

const MIN_PASSWORD = 8;

function JoinForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { member, loading } = useMember();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  // Already signed in? Nothing to do here.
  useEffect(() => {
    if (!loading && member) router.replace(next);
  }, [loading, member, next, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("We just need your first and last name.");
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(AUTH_MESSAGES.weak_password);
      return;
    }

    setPending(true);
    const res = await signUp({ firstName, lastName, email, password });
    setPending(false);

    if (!res.ok) {
      setError(AUTH_MESSAGES[res.reason] ?? AUTH_MESSAGES.unavailable);
      return;
    }
    // Account created, but the project requires email confirmation, so
    // there is no session to send them onward with yet.
    if (res.member === null) {
      setCheckEmail(true);
      return;
    }
    router.replace(next);
  }

  if (checkEmail) {
    return (
      <ClubShell
        eyebrow="Membership"
        title="You're in — almost."
        footer={<ClubLink href="/login">Back to log in</ClubLink>}
      >
        <FormNote>
          We've sent a confirmation link to {email.trim()}. Click it and
          your club is open.
        </FormNote>
      </ClubShell>
    );
  }

  return (
    <ClubShell
      eyebrow="Membership"
      title="Join the club."
      footer={
        <>
          Already a member? <ClubLink href="/login">Log in</ClubLink>.
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormNote>At least {MIN_PASSWORD} characters.</FormNote>
        <FormError>{error}</FormError>
        <SubmitButton pending={pending}>Join free</SubmitButton>
        <FormNote>
          Free, always. Membership gets you member pricing on Tiger Club
          experiences.
        </FormNote>
      </form>
    </ClubShell>
  );
}

/* useSearchParams needs a Suspense boundary to stay statically
   prerenderable — without it Next opts the whole route into dynamic
   rendering, which on Cloudflare means a Worker invocation per view. */
export default function JoinClient() {
  return (
    <Suspense fallback={<ClubShell eyebrow="Membership" title="Join the club." children={null} />}>
      <JoinForm />
    </Suspense>
  );
}
