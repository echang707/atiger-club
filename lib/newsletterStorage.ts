/* Small localStorage helpers, kept out of the components so the popup
   and the form don't need to agree on key names inline. Wrapped in
   try/catch throughout — private browsing / storage-disabled contexts
   throw on access, and none of this is critical enough to break the
   page over. */

const SUBSCRIBED_KEY = "tigerclub:newsletter:subscribed";
const DISMISSED_AT_KEY = "tigerclub:newsletter:dismissedAt";

const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

export function isSubscribed(): boolean {
  try {
    return window.localStorage.getItem(SUBSCRIBED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSubscribed(): void {
  try {
    window.localStorage.setItem(SUBSCRIBED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function markDismissed(): void {
  try {
    window.localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

// True if the popup was dismissed within the last 10 days.
export function isDismissedRecently(): boolean {
  try {
    const raw = window.localStorage.getItem(DISMISSED_AT_KEY);
    if (!raw) return false;
    const dismissedAt = Number(raw);
    if (Number.isNaN(dismissedAt)) return false;
    return Date.now() - dismissedAt < TEN_DAYS_MS;
  } catch {
    return false;
  }
}
