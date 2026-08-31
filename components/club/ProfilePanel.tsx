"use client";

/* Read-only until you press edit. A page that greets you with seven
   live input boxes is a settings screen; this should read as a
   membership record you can amend. */

import { useRef, useState } from "react";
import { useMember } from "./MemberProvider";
import { Field, FormError, FormNote, SubmitButton } from "./ClubForm";
import { Avatar, BODY, ClubSection, DetailRow, MARK } from "./ClubUI";
import type { EditableProfile, Member } from "@/lib/member";
import {
  AVATAR_MAX_BYTES,
  saveAvatarUrl,
  updateProfile,
  uploadAvatar,
} from "@/lib/club/supabase";

const AVATAR_ERRORS: Record<string, string> = {
  too_large: `That image is over ${Math.round(AVATAR_MAX_BYTES / 1024 / 1024)}MB. Pick a smaller one.`,
  wrong_type: "Use a JPG, PNG or WebP.",
  failed: "That upload didn't go through. Try again.",
};

export default function ProfilePanel({ member }: { member: Member }) {
  const { refresh } = useMember();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<EditableProfile>({
    firstName: member.firstName,
    lastName: member.lastName,
    phone: member.phone ?? "",
    birthday: member.birthday ?? "",
    city: member.city ?? "",
    dietaryNotes: member.dietaryNotes ?? "",
    instagram: member.instagram ?? "",
  });

  function set<K extends keyof EditableProfile>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setAvatarBusy(true);
    const up = await uploadAvatar(member.authUserId, file);
    if (up.ok) {
      await saveAvatarUrl(member.id, up.url);
      await refresh();
    } else {
      setError(AVATAR_ERRORS[up.reason]);
    }
    setAvatarBusy(false);
    // Reset so re-picking the same file fires change again.
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.firstName?.trim() || !form.lastName?.trim()) {
      setError("A first and last name are required.");
      return;
    }
    setPending(true);
    const updated = await updateProfile(member.id, form);
    setPending(false);
    if (!updated) {
      setError("That didn't save. Try again.");
      return;
    }
    await refresh();
    setEditing(false);
  }

  if (!editing) {
    return (
      <ClubSection mark="Your details">
        <dl>
          <DetailRow label="Phone" value={member.phone} />
          <DetailRow label="Birthday" value={formatBirthday(member.birthday)} />
          <DetailRow label="City" value={member.city} />
          <DetailRow label="Dietary notes" value={member.dietaryNotes} />
          <DetailRow
            label="Instagram"
            value={member.instagram ? `@${member.instagram}` : null}
          />
        </dl>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={`organic-underline mt-8 ${MARK} text-ink transition-colors hover:text-tiger-text`}
        >
          edit your profile
        </button>
      </ClubSection>
    );
  }

  return (
    <ClubSection mark="Editing your profile">
      <form onSubmit={onSave} className="max-w-[34rem] space-y-6" noValidate>
        <div className="flex items-center gap-5">
          <Avatar member={member} size={64} />
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={avatarBusy}
              className={`organic-underline ${MARK} text-ink transition-colors hover:text-tiger-text disabled:opacity-60`}
            >
              {avatarBusy
                ? "uploading"
                : member.avatarUrl
                  ? "change photo"
                  : "add a photo"}
            </button>
            <p className="mt-2 text-sm text-ink/45">JPG, PNG or WebP.</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onPickAvatar}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="First name"
            name="firstName"
            value={form.firstName ?? ""}
            onChange={(e) => set("firstName", e.target.value)}
            required
          />
          <Field
            label="Last name"
            name="lastName"
            value={form.lastName ?? ""}
            onChange={(e) => set("lastName", e.target.value)}
            required
          />
        </div>

        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={form.phone ?? ""}
          onChange={(e) => set("phone", e.target.value)}
        />
        <Field
          label="Birthday"
          name="birthday"
          type="date"
          value={form.birthday ?? ""}
          onChange={(e) => set("birthday", e.target.value)}
        />
        <Field
          label="City or neighborhood"
          name="city"
          value={form.city ?? ""}
          onChange={(e) => set("city", e.target.value)}
        />
        <Field
          label="Dietary notes"
          name="dietaryNotes"
          placeholder="Anything we should know for dinners"
          value={form.dietaryNotes ?? ""}
          onChange={(e) => set("dietaryNotes", e.target.value)}
        />
        <Field
          label="Instagram"
          name="instagram"
          placeholder="handle, without the @"
          value={form.instagram ?? ""}
          onChange={(e) => set("instagram", e.target.value)}
        />

        <FormNote>
          Your email is {member.email}. Get in touch if you need it changed.
        </FormNote>
        <FormError>{error}</FormError>

        <div className="flex items-center gap-6 pt-2">
          <div className="w-full max-w-[13rem]">
            <SubmitButton pending={pending}>Save changes</SubmitButton>
          </div>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className={`${MARK} text-ink/45 transition-colors hover:text-ink`}
          >
            cancel
          </button>
        </div>
      </form>
    </ClubSection>
  );
}

/* Parsed as parts, not `new Date("1994-06-02")` — that string is read as
   UTC midnight and displays as the previous day anywhere west of
   Greenwich, Atlanta included. */
function formatBirthday(iso?: string | null) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}
