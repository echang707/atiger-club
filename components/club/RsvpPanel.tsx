"use client";

/* RSVP for events hosted on this site. The database enforces capacity
   (see rsvp_event in supabase/migrations/20261125_rsvps.sql), so the
   button here only reports what the database decided. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMember } from "./MemberProvider";
import {
  cancelRsvp,
  getMyRsvpEventIds,
  getRsvpCounts,
  rsvpToEvent,
} from "@/lib/club/supabase";
import { eventSlug, type TigerEvent } from "@/lib/events";

const BUTTON =
  "block w-full text-center rounded-full px-6 py-4 text-[15px] font-semibold transition-colors";

export default function RsvpPanel({ event }: { event: TigerEvent }) {
  const { member, loading, available } = useMember();
  const [going, setGoing] = useState<boolean | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const capacity = event.capacity ?? null;

  function refreshCount() {
    getRsvpCounts([event.id]).then((m) => setCount(m[event.id] ?? 0));
  }

  useEffect(refreshCount, [event.id]);

  useEffect(() => {
    if (!member) {
      setGoing(null);
      return;
    }
    getMyRsvpEventIds(member.id).then((ids) => setGoing(ids.includes(event.id)));
  }, [member, event.id]);

  if (!available || loading) return null;

  if (!member) {
    return (
      <div>
        <Link
          href={`/join?next=${encodeURIComponent(`/experiences/${eventSlug(event)}`)}`}
          className={`${BUTTON} bg-tiger-fill text-white hover:bg-tiger-deep`}
        >
          RSVP — join free
        </Link>
        <p className="mt-2 text-center text-xs text-ink/50">
          {event.price ? `RSVP is free. ${event.price}.` : "Free to RSVP. Takes about 30 seconds."}
        </p>
      </div>
    );
  }

  const full = capacity !== null && count !== null && count >= capacity && !going;
  const spotsLeft =
    capacity !== null && count !== null ? Math.max(capacity - count, 0) : null;

  async function rsvp() {
    if (!member || busy) return;
    setBusy(true);
    setMessage(null);
    const outcome = await rsvpToEvent(event.id, capacity);
    setBusy(false);
    if (outcome === "going" || outcome === "already") {
      setGoing(true);
    } else if (outcome === "full") {
      setMessage("This one just filled up.");
    } else {
      setMessage("We couldn't save your RSVP. Try again shortly.");
    }
    refreshCount();
  }

  async function cancel() {
    if (!member || busy) return;
    setBusy(true);
    setMessage(null);
    const ok = await cancelRsvp(member.id, event.id);
    setBusy(false);
    if (ok) setGoing(false);
    else setMessage("We couldn't cancel that. Try again shortly.");
    refreshCount();
  }

  return (
    <div>
      {going ? (
        <>
          <p className="text-center text-[15px] font-semibold text-tiger-text">
            You&rsquo;re going ✓
          </p>
          <button
            type="button"
            onClick={cancel}
            disabled={busy}
            className="mt-3 block w-full text-center text-sm text-ink/60 underline underline-offset-4 disabled:opacity-60"
          >
            {busy ? "…" : "Cancel my RSVP"}
          </button>
        </>
      ) : full ? (
        <p className="text-center text-[15px] font-semibold text-ink/70">Sold out</p>
      ) : (
        <button
          type="button"
          onClick={rsvp}
          disabled={busy || going === null}
          className={`${BUTTON} bg-tiger-fill text-white hover:bg-tiger-deep disabled:opacity-60`}
        >
          {busy ? "…" : event.price ? "RSVP" : "RSVP — free"}
        </button>
      )}
      {spotsLeft !== null && !full && !going && (
        <p className="mt-2 text-center text-xs text-ink/50">{spotsLeft} spots left</p>
      )}
      {message && <p className="mt-2 text-center text-sm text-tiger-text">{message}</p>}
    </div>
  );
}
