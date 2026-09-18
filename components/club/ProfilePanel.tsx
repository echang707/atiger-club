"use client";

import { useRef, useState } from "react";
import { useMember } from "./MemberProvider";
import { Field, FormError, FormNote, SubmitButton } from "./ClubForm";
import { Avatar, ClubSection, DetailRow, MARK } from "./ClubUI";
import type { EditableProfile, Member } from "@/lib/member";
import {
  AVATAR_MAX_BYTES,
  saveAvatarUrl,
  updateProfile,
  uploadAvatar,
} from "@/lib/club/supabase";

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
      setError(
        up.reason === "too_large"
          ? `Image is over ${Math.round(AVATAR_MAX_BYTES / 1024 / 1024)}MB.`
          : up.reason === "wrong_type"
            ? "Use a JPG, PNG or WebP."
            : `Upload failed${"detail" in up && up.detail ? `: ${up.detail}` : " — check the browser console"}.`,
      );
    }
    setAvatarBusy(false);
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
    const result = await updateProfile(member.id, form);
    setPending(false);
    if ("error" in result) {
      setError(
        result.error === "42703"
          ? "Profile fields aren't set up in the database yet. Run supabase-profile-fix.sql in Supabase SQL Editor."
          : "That didn't save. Check the browser console for the exact error.",
      );
      return;
    }
    await refresh();
    setEditing(false);
  }

  return (
    <>
      {/* Photo section */}
      <ClubSection eyebrow="Photo">
        <div className="flex items-center gap-5 md:gap-8">
          <Avatar member={member} size={72} />
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={avatarBusy}
              className="rounded-full border border-ink/20 px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40 disabled:opacity-50"
            >
              {avatarBusy ? "Uploading…" : member.avatarUrl ? "Change photo" : "Add a photo"}
            </button>
            <p className="mt-2 text-[13px] text-ink/40">JPG, PNG or WebP · max 3MB</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onPickAvatar}
            className="hidden"
          />
        </div>
        {error && <p className="mt-4 text-[14px] text-tiger-text">{error}</p>}
      </ClubSection>

      {/* Details — read view */}
      {!editing && (
        <ClubSection
          eyebrow="Your details"
          action={
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={`${MARK} text-ink/45 transition-colors hover:text-ink`}
            >
              Edit
            </button>
          }
        >
          <dl>
            <DetailRow label="First name" value={member.firstName} />
            <DetailRow label="Last name" value={member.lastName} />
            <DetailRow label="Email" value={member.email} />
            <DetailRow label="Phone" value={member.phone} />
            <DetailRow label="Birthday" value={formatBirthday(member.birthday)} />
            <DetailRow label="City" value={member.city} />
            <DetailRow label="Dietary notes" value={member.dietaryNotes} />
            <DetailRow
              label="Instagram"
              value={member.instagram ? `@${member.instagram}` : null}
            />
          </dl>
        </ClubSection>
      )}

      {/* Edit form */}
      {editing && (
        <ClubSection eyebrow="Edit your details">
          <form onSubmit={onSave} className="space-y-5 max-w-lg" noValidate>
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
              Your email is {member.email}. Get in touch if you need to change it.
            </FormNote>
            <FormError>{error}</FormError>
            <div className="flex items-center gap-5 pt-2">
              <div className="w-full max-w-[10rem]">
                <SubmitButton pending={pending}>Save</SubmitButton>
              </div>
              <button
                type="button"
                onClick={() => { setEditing(false); setError(null); }}
                className="text-[14px] text-ink/45 hover:text-ink transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </ClubSection>
      )}
    </>
  );
}

function formatBirthday(iso?: string | null) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}
