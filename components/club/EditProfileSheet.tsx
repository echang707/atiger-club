"use client";

/* Edit profile as a pop-up, the way Luma and Partiful do it: the profile
   page shows only the public face (photo, name, city, Instagram), and the
   private fields (phone, birthday, dietary notes) live in this form.
   Centered dialog on desktop, bottom sheet on phones. */

import { useEffect, useRef, useState } from "react";
import { useMember } from "./MemberProvider";
import { Field, FormError, FormNote, SubmitButton } from "./ClubForm";
import { Avatar } from "./ClubUI";
import type { EditableProfile, Member } from "@/lib/member";
import {
  AVATAR_MAX_BYTES,
  saveAvatarUrl,
  signOut,
  updateProfile,
  uploadAvatar,
} from "@/lib/club/supabase";

export default function EditProfileSheet({
  member,
  open,
  onClose,
  onSignedOut,
}: {
  member: Member;
  open: boolean;
  onClose: () => void;
  onSignedOut: () => void;
}) {
  const { refresh } = useMember();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<EditableProfile>(toForm(member));

  // Fresh values every time it opens, so a cancelled edit doesn't linger.
  useEffect(() => {
    if (open) {
      setForm(toForm(member));
      setError(null);
    }
  }, [open, member]);

  // Escape closes; the page behind doesn't scroll while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

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
            : "Upload failed. Try again.",
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
      setError("That didn't save. Try again shortly.");
      return;
    }
    await refresh();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="max-h-[92svh] w-full overflow-y-auto rounded-t-3xl bg-paper shadow-xl sm:max-w-lg sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-paper px-6 py-4">
          <h2 id="edit-profile-title" className="font-display text-[1.25rem] text-ink">
            Edit profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-ink/60 transition-colors hover:bg-ink/[0.06] hover:text-ink"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-5 px-6 py-6" noValidate>
          <div className="flex flex-col items-center gap-3 pb-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={avatarBusy}
              className="group relative rounded-full"
              aria-label={member.avatarUrl ? "Change photo" : "Add a photo"}
            >
              <Avatar member={member} size={96} />
              <span className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-paper bg-ink text-white">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
              </span>
            </button>
            <span className="text-[13px] text-ink/50">
              {avatarBusy ? "Uploading…" : member.avatarUrl ? "Change photo" : "Add a photo"}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onPickAvatar}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" name="firstName" value={form.firstName ?? ""} onChange={(e) => set("firstName", e.target.value)} required />
            <Field label="Last name" name="lastName" value={form.lastName ?? ""} onChange={(e) => set("lastName", e.target.value)} required />
          </div>
          <Field label="City or neighborhood" name="city" value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} />
          <Field label="Instagram" name="instagram" placeholder="handle, without the @" value={form.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} />

          <div className="border-t border-ink/10 pt-5">
            <p className="mb-4 text-[13px] text-ink/50">Only Tiger Club sees these.</p>
            <div className="space-y-5">
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
              <Field label="Birthday" name="birthday" type="date" value={form.birthday ?? ""} onChange={(e) => set("birthday", e.target.value)} />
              <Field label="Dietary notes" name="dietaryNotes" placeholder="Anything we should know for dinners" value={form.dietaryNotes ?? ""} onChange={(e) => set("dietaryNotes", e.target.value)} />
            </div>
          </div>

          <FormNote>Signed in as {member.email}.</FormNote>
          <FormError>{error}</FormError>
          <SubmitButton pending={pending}>Save</SubmitButton>

          <button
            type="button"
            onClick={async () => {
              await signOut();
              onSignedOut();
            }}
            className="block w-full pt-1 text-center text-[14px] text-ink/50 transition-colors hover:text-ink"
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}

function toForm(m: Member): EditableProfile {
  return {
    firstName: m.firstName,
    lastName: m.lastName,
    phone: m.phone ?? "",
    birthday: m.birthday ?? "",
    city: m.city ?? "",
    dietaryNotes: m.dietaryNotes ?? "",
    instagram: m.instagram ?? "",
  };
}
