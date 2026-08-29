"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AUTH_MESSAGES,
  ClubLink,
  ClubShell,
  Field,
  FormError,
  FormNote,
  SubmitButton,
} from "@/components/club/ClubForm";
import { supabase, updatePassword } from "@/lib/club/supabase";

const MIN_PASSWORD = 8;

/* Supabase sends the member here with a recovery token in the URL
   fragment. The client is configured with detectSessionInUrl, so by the
   time this mounts it may already hold a temporary session — but that
   exchange is async, so we wait for it rather than assuming. */
export default function ResetClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const sb = supabase();
    if (!sb) {
      setReady(true);
      return;
    }
    let alive = true;
    const sub = sb.auth.onAuthStateChange((_e, session) => {
      if (!alive) return;
      setValid(Boolean(session));
      setReady(true);
    });
    void sb.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setValid(Boolean(data.session));
      setReady(true);
    });
    return () => {
      alive = false;
      sub.data.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < MIN_PASSWORD) {
      setError(AUTH_MESSAGES.weak_password);
      return;
    }
    setPending(true);
    const res = await updatePassword(password);
    setPending(false);
    if (!res.ok) {
      setError(AUTH_MESSAGES[res.reason] ?? AUTH_MESSAGES.unavailable);
      return;
    }
    setDone(true);
    setTimeout(() => router.replace("/member"), 900);
  }

  if (!ready) {
    return <ClubShell eyebrow="Membership" title="One moment…" children={null} />;
  }

  if (done) {
    return (
      <ClubShell eyebrow="Membership" title="All set." children={
        <FormNote>Taking you to your club…</FormNote>
      } />
    );
  }

  if (!valid) {
    return (
      <ClubShell
        eyebrow="Membership"
        title="That link has expired."
        footer={<ClubLink href="/forgot-password">Send a new one</ClubLink>}
      >
        <FormNote>
          Reset links are good for an hour and can only be used once.
        </FormNote>
      </ClubShell>
    );
  }

  return (
    <ClubShell eyebrow="Membership" title="Choose a new password.">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field
          label="New password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormNote>At least {MIN_PASSWORD} characters.</FormNote>
        <FormError>{error}</FormError>
        <SubmitButton pending={pending}>Save password</SubmitButton>
      </form>
    </ClubShell>
  );
}
