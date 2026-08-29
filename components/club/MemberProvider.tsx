"use client";

/* One source of truth for "who is looking at this page". Everything —
   the nav, the dashboard, event pricing — reads this rather than
   touching Supabase directly, so there is exactly one place where
   session state is resolved and one place to change if auth moves. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Member } from "@/lib/member";
import type { MemberStatus } from "@/lib/membership";
import { fetchMember, isConfigured, supabase } from "@/lib/club/supabase";

type MemberContextValue = {
  member: Member | null;
  /* The status to price against: a member's own, or "guest". */
  status: MemberStatus;
  /* True until the first session check resolves. Components should show
     nothing auth-dependent while this is true — flashing "Join" at a
     signed-in member on every page load looks broken. */
  loading: boolean;
  /* False when env vars are missing. Lets the nav hide membership
     entirely rather than offering links that cannot work. */
  available: boolean;
  refresh: () => Promise<void>;
};

const MemberContext = createContext<MemberContextValue>({
  member: null,
  status: "guest",
  loading: true,
  available: false,
  refresh: async () => {},
});

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const available = isConfigured();

  const load = useCallback(async () => {
    const sb = supabase();
    if (!sb) {
      setMember(null);
      setLoading(false);
      return;
    }
    const { data } = await sb.auth.getUser();
    setMember(data.user ? await fetchMember(sb, data.user) : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let alive = true;

    void load();

    // Keeps other tabs, token refreshes and the password-reset redirect
    // in sync without any page needing to know about them.
    const sb = supabase();
    const sub = sb?.auth.onAuthStateChange(async (_event, session) => {
      if (!alive) return;
      if (!session?.user) {
        setMember(null);
        setLoading(false);
        return;
      }
      const m = await fetchMember(sb!, session.user);
      if (alive) {
        setMember(m);
        setLoading(false);
      }
    });

    return () => {
      alive = false;
      sub?.data.subscription.unsubscribe();
    };
  }, [load]);

  const value = useMemo<MemberContextValue>(
    () => ({
      member,
      status: member?.status ?? "guest",
      loading,
      available,
      refresh: load,
    }),
    [member, loading, available, load],
  );

  return (
    <MemberContext.Provider value={value}>{children}</MemberContext.Provider>
  );
}

export function useMember() {
  return useContext(MemberContext);
}
