"use client";

/* "Join the Club" = join the mailing list.

   Same pipeline as the footer and popup newsletter forms (lib/mailerlite
   → Supabase copy + MailerLite subscribe), so every joiner lands in
   MailerLite and gets event updates and the newsletter. No password, no
   account — one name, one email, done. */

import { useState } from "react";
import { ClubShell, Field, FormError, FormNote, SubmitButton, ClubLink } from "./ClubForm";
import { subscribe } from "@/lib/mailerlite";
import { markSubscribed } from "@/lib/newsletterStorage";

export default function JoinClubForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);
    const res = await subscribe(email, "join", name);
    setPending(false);

    if (!res.ok) {
      setError(
        res.reason === "invalid"
          ? "That email doesn't look right — mind double-checking it?"
          : "Something went wrong on our end. Mind trying again?",
      );
      return;
    }
    markSubscribed();
    setDone(true);
  }

  if (done) {
    return (
      <ClubShell eyebrow="Membership" title="You're in the club.">
        <div className="space-y-5">
          <FormNote>
            Welcome{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}. Event
            invites and the Tiger Club newsletter will land at {email.trim()}.
          </FormNote>
          <FormNote>
            Meanwhile, see <ClubLink href="/experiences">what&rsquo;s coming up</ClubLink>.
          </FormNote>
        </div>
      </ClubShell>
    );
  }

  return (
    <ClubShell
      eyebrow="Membership"
      title="Join the club."
      footer={
        <span>
          Already have an account? <ClubLink href="/login">Log in</ClubLink>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field
          label="First name"
          name="firstName"
          autoComplete="given-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <FormError>{error}</FormError>
        <SubmitButton pending={pending}>Join free</SubmitButton>
        <FormNote>
          Free, always. You&rsquo;ll get first word on Tiger Club experiences
          and our newsletter. Unsubscribe anytime.
        </FormNote>
      </form>
    </ClubShell>
  );
}
