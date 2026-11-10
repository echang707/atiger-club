/* Reminders for saved events, worked out in the browser from the
   member's saved event ids + lib/events.ts. No extra table needed:
   "an alert" is simply a saved event happening soon. */

import type { TigerEvent } from "../events";

const DAY = 24 * 60 * 60 * 1000;

/* Whole days from today (local) to the event. 0 = today, negative = past. */
export function daysUntil(e: TigerEvent, now = new Date()): number {
  const d = new Date(`${e.date}, 2026`);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / DAY);
}

export function whenLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 0) return "Past";
  return `In ${days} days`;
}

export type Alert = { event: TigerEvent; days: number };

/* Saved events happening today through `withinDays` from now, soonest first. */
export function upcomingAlerts(saved: TigerEvent[], withinDays = 7): Alert[] {
  return saved
    .map((event) => ({ event, days: daysUntil(event) }))
    .filter((a) => a.days >= 0 && a.days <= withinDays)
    .sort((a, b) => a.days - b.days);
}
