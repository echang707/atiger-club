"use client";

import { useState } from "react";
import {
  ClubLink,
  ClubShell,
  Field,
  FormNote,
  SubmitButton,
} from "@/components/club/ClubForm";
import { requestPasswordReset } from "@/lib/club/supabase";

export default function ForgotClient() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    await requestPasswordReset(email);
    setPending(false);
    // Always the same outcome, whether or not that address has an
    // account. Confirming which emails are members would let anyone
    // enumerate the membership one address at a time.
    setSent(true);
  }

  if (sent) {
    return (
      <ClubShell
        eyebrow="Membership"
        title="Check your email."
        footer={<ClubLink href="/login">Back to log in</ClubLink>}
      >
        <FormNote>
          If there's a Tiger Club account for {email.trim() || "that address"},
          a reset link is on its way. It expires in an hour.
        </FormNote>
      </ClubShell>
    );
  }

  return (
    <ClubShell
      eyebrow="Membership"
      title="Reset your password."
      footer={<ClubLink href="/login">Back to log in</ClubLink>}
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
        <SubmitButton pending={pending}>Send reset link</SubmitButton>
      </form>
    </ClubShell>
  );
}
