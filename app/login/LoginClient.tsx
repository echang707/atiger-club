"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  AUTH_MESSAGES,
  ClubLink,
  ClubShell,
  Field,
  FormError,
  SubmitButton,
} from "@/components/club/ClubForm";
import { useMember } from "@/components/club/MemberProvider";
import { signIn } from "@/lib/club/supabase";

function safeNext(raw: string | null): string {
  if (!raw) return "/member";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/member";
  return raw;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { member, loading } = useMember();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && member) router.replace(next);
  }, [loading, member, next, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await signIn(email, password);
    setPending(false);
    if (!res.ok) {
      setError(AUTH_MESSAGES[res.reason] ?? AUTH_MESSAGES.unavailable);
      return;
    }
    router.replace(next);
  }

  return (
    <ClubShell
      eyebrow="Membership"
      title="Welcome back."
      footer={
        <>
          Not a member yet? <ClubLink href="/join">Join free</ClubLink>.
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormError>{error}</FormError>
        <SubmitButton pending={pending}>Log in</SubmitButton>
        <p className="text-[14px] text-ink/70">
          <ClubLink href="/forgot-password">Forgot your password?</ClubLink>
        </p>
      </form>
    </ClubShell>
  );
}

export default function LoginClient() {
  return (
    <Suspense
      fallback={<ClubShell eyebrow="Membership" title="Welcome back." children={null} />}
    >
      <LoginForm />
    </Suspense>
  );
}
