"use client";

/* Add-to-calendar buttons: a .ics download (Apple, Outlook, etc.) and a
   Google Calendar link. Renders nothing for events without start times. */

import { buildIcs, canAddToCalendar, googleCalendarUrl } from "@/lib/calendar";
import { eventSlug, type TigerEvent } from "@/lib/events";

const BUTTON =
  "flex-1 text-center rounded-full border border-ink/20 px-4 py-3 text-[14px] font-semibold text-ink/75 transition-colors hover:border-tiger-fill hover:text-tiger-text";

export default function AddToCalendar({ event }: { event: TigerEvent }) {
  if (!canAddToCalendar(event)) return null;

  function download() {
    const ics = buildIcs(event);
    if (!ics) return;
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventSlug(event)}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const google = googleCalendarUrl(event);

  return (
    <div className="flex gap-3">
      <button type="button" onClick={download} className={BUTTON}>
        Add to calendar
      </button>
      {google && (
        <a href={google} target="_blank" rel="noopener noreferrer" className={BUTTON}>
          Google Calendar
        </a>
      )}
    </div>
  );
}
