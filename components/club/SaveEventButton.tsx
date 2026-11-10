"use client";

/* Save button for the individual event page. Unlike the one in
   EventRow, it looks up its own saved state on mount — the event page is
   static HTML and doesn't know who's viewing. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMember } from "./MemberProvider";
import { getSavedEventIds, toggleSavedEvent } from "@/lib/club/supabase";

export default function SaveEventButton({
  eventId,
  returnTo,
}: {
  eventId: string;
  returnTo: string;
}) {
  const { member, loading, available } = useMember();
  const [saved, setSaved] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!member) return;
    getSavedEventIds(member.id).then((ids) => setSaved(ids.includes(eventId)));
  }, [member, eventId]);

  const base =
    "block w-full text-center rounded-full border px-6 py-3.5 text-[14px] font-semibold transition-colors";

  if (!available || loading) return null;

  if (!member) {
    return (
      <Link
        href={`/join?next=${encodeURIComponent(returnTo)}`}
        className={`${base} border-ink/20 text-ink/75 hover:border-tiger-fill hover:text-tiger-text`}
      >
        ♡ Save &amp; get a reminder
      </Link>
    );
  }

  async function toggle() {
    if (busy || !member) return;
    setBusy(true);
    const res = await toggleSavedEvent(member.id, eventId);
    if (res) setSaved(res.saved);
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy || saved === null}
      className={`${base} disabled:opacity-60 ${
        saved
          ? "border-tiger-fill bg-tiger-fill/10 text-tiger-text"
          : "border-ink/20 text-ink/75 hover:border-tiger-fill hover:text-tiger-text"
      }`}
    >
      {busy ? "…" : saved ? "♥ Saved to your club" : "♡ Save to your club"}
    </button>
  );
}
