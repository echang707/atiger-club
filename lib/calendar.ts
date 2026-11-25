/* Calendar export for experiences: a standard .ics file, and a Google
   Calendar link. Built only from fields on the event, so an event without
   start times simply gets no calendar buttons. */

import { eventSlug, type TigerEvent } from "./events";
import { SITE_URL } from "./seo";

const DEFAULT_LENGTH_MS = 2 * 60 * 60 * 1000;

function bounds(e: TigerEvent): { start: Date; end: Date } | null {
  if (!e.startsAt) return null;
  const start = new Date(e.startsAt);
  if (Number.isNaN(start.getTime())) return null;
  const end = e.endsAt
    ? new Date(e.endsAt)
    : new Date(start.getTime() + DEFAULT_LENGTH_MS);
  return { start, end };
}

/* 2026-12-05T18:00:00.000Z -> 20261205T180000Z */
function stamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/* RFC 5545: lines longer than 75 characters continue on the next line,
   starting with a space. */
function fold(line: string): string {
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 73) {
    parts.push(rest.slice(0, 73));
    rest = " " + rest.slice(73);
  }
  parts.push(rest);
  return parts.join("\r\n");
}

export function canAddToCalendar(e: TigerEvent): boolean {
  return bounds(e) !== null;
}

export function eventPageUrl(e: TigerEvent): string {
  return `${SITE_URL}/experiences/${eventSlug(e)}`;
}

export function buildIcs(e: TigerEvent): string | null {
  const b = bounds(e);
  if (!b) return null;
  const url = eventPageUrl(e);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tiger Club//Experiences//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${eventSlug(e)}@atigerclub.com`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(b.start)}`,
    `DTEND:${stamp(b.end)}`,
    `SUMMARY:${escapeText(e.title)}`,
    `LOCATION:${escapeText(e.address ?? e.location)}`,
    `DESCRIPTION:${escapeText(`${e.description}\n\n${url}`)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n");
}

export function googleCalendarUrl(e: TigerEvent): string | null {
  const b = bounds(e);
  if (!b) return null;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${stamp(b.start)}/${stamp(b.end)}`,
    details: `${e.description}\n\n${eventPageUrl(e)}`,
    location: e.address ?? e.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
