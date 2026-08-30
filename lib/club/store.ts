/* ---------------------------------------------------------------------
   The seam between Tiger Club and whatever database/auth we run on.

   Every route and component talks to these interfaces, never to a
   vendor SDK. That is what makes the Supabase-vs-D1 decision cheap: it
   is one adapter file, not a refactor. It also keeps the auth provider
   out of the React tree entirely, which matters because this site
   deploys to the Cloudflare Workers runtime where a Node-only SDK will
   fail at build time rather than politely degrade.

   Nothing here is implemented yet — the adapter is written once the
   database is chosen and its credentials exist.
   --------------------------------------------------------------------- */

import type { Member } from "../member";
import type { Registration } from "../member";
import type { MemberStatus } from "../membership";

export type SignUpInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type AuthResult =
  | { ok: true; member: Member }
  /* Signup succeeded but there is no session yet, because the project
     requires email confirmation. The account EXISTS — this is a success
     state that happens to need a detour, not a failure. Treating it as
     an error (which an earlier version did) told people signup had
     broken when it had actually worked. */
  | { ok: true; member: null; needsConfirmation: true }
  | { ok: false; reason: AuthFailure };

/* Deliberately coarse. "email already in use" is intentionally NOT a
   distinct public failure on signup, because reporting it lets anyone
   enumerate who is a member. The adapter may distinguish internally for
   logging; the UI shows the same message either way. */
export type AuthFailure =
  | "invalid_credentials"
  | "invalid_input"
  | "weak_password"
  | "rate_limited"
  /* The auth user was created but the members row was not — i.e. the
     handle_new_user() trigger is missing or throwing. Split out from
     "unavailable" because the fix is specific and in the database, and
     lumping it in with every other error made it undiagnosable. */
  | "member_record_failed"
  | "unavailable";

export interface ClubAuth {
  signUp(input: SignUpInput): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  /* Always resolves without error even for unknown addresses — the
     response must not reveal whether an account exists. */
  requestPasswordReset(email: string): Promise<void>;
  /* The member for the current request's session, or null. */
  currentMember(): Promise<Member | null>;
}

export interface ClubStore {
  getMemberByAuthUserId(authUserId: string): Promise<Member | null>;
  createMember(
    input: Omit<Member, "id" | "joinedAt" | "status"> & {
      status?: MemberStatus;
    },
  ): Promise<Member>;
  updateMember(id: string, patch: Partial<Member>): Promise<Member>;

  listRegistrationsForMember(memberId: string): Promise<Registration[]>;
  createRegistration(
    input: Omit<Registration, "id" | "registeredAt">,
  ): Promise<Registration>;
}
