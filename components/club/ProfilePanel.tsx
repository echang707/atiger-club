"use client";

/* Your Profile — view by default, edit on demand.

   Kept read-only until someone presses Edit. A dashboard that greets you
   with six live input boxes feels like a settings screen; this is
   supposed to feel like a membership card you can amend. */

import { useRef, useState } from "react";
import { useMember } from "./MemberProvider";
import { Field, FormError, FormNote, SubmitButton } from "./ClubForm";
import { memberInitials } from "@/lib/member";
import type { EditableProfile, Member } from "@/lib/member";
import {
  AVATAR_MAX_BYTES,
  saveAvatarUrl,
  updateProfile,
  uploadAvatar,
} from "@/lib/club/supabase";

function Avatar({ member, size = 72 }: { member: Member; size?: number }) {
  const px = { width: size, height: size };
  if (member.avatarUrl) {
    // Plain <img>, not next/image: the URL is user-supplied and lives on
    // a Supabase domain, so next/image would need that host allow-listed
    // in next.config and would try to optimise it through a Worker on
    // Cloudflare. Not worth it for one small avatar.
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={member.avatarUrl}
        alt=""
        style={px}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={px}
      className="grid shrink-0 place-items-center rounded-full bg-tiger-fill font-display text-[22px] text-white"
    >
      {memberInitials(member)}
    </span>
  );
}

const AVATAR_ERRORS: Record<string, string> = {
  too_large: `That image is over ${Math.round(AVATAR_MAX_BYTES / 1024 / 1024)}MB. Try a smaller one.`,
  wrong_type: "Use a JPG, PNG or WebP.",
  failed: "Couldn't upload that just now. Try again?",
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
      setError("We need a first and last name.");
      return;
    }
    setPending(true);
    const updated = await updateProfile(member.id, form);
    setPending(false);
    if (!updated) {
      setError("Couldn't save that just now. Try again?");
      return;
    }
    await refresh();
    setEditing(false);
  }

  if (!editing) {
    return (
      <div>
        <div className="flex items-center gap-4">
          <Avatar member={member} />
          <div className="min-w-0">
            <p className="font-display text-[20px] leading-tight text-ink">
              {member.firstName} {member.lastName}
            </p>
            <p className="break-all text-[14px] text-ink/50">{member.email}</p>
          </div>
        </div>

        <dl className="mt-6 space-y-3 text-[15px]">
          <Row label="Phone" value={member.phone} />
          <Row label="Birthday" value={formatBirthday(member.birthday)} />
          <Row label="City" value={member.city} />
          <Row label="Dietary" value={member.dietaryNotes} />
          <Row
            label="Instagram"
            value={member.instagram ? `@${member.instagram}` : null}
          />
        </dl>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="organic-underline mt-6 text-[14px] font-semibold text-ink"
        >
          Edit your profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSave} className="space-y-5" noValidate>
      <div className="flex items-center gap-4">
        <Avatar member={member} />
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={avatarBusy}
            className="organic-underline text-[14px] font-semibold text-ink disabled:opacity-60"
          >
            {avatarBusy
              ? "Uploading…"
              : member.avatarUrl
                ? "Change photo"
                : "Add a photo"}
          </button>
          <p className="mt-1 text-[13px] text-ink/50">JPG, PNG or WebP.</p>
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

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <SubmitButton pending={pending}>Save</SubmitButton>
        </div>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-[15px] text-ink/60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-3">
      <dt className="w-24 shrink-0 text-ink/50">{label}</dt>
      <dd className={value ? "text-ink" : "text-ink/30"}>{value || "—"}</dd>
    </div>
  );
}

/* Parsed as parts, not `new Date("1994-06-02")` — that string is treated
   as UTC midnight and shifts to the previous day for anyone west of
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
