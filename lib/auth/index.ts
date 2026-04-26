import { eq } from "drizzle-orm";
import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db/client";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";

// Auth.js's default Session type does not include user.id.
// This augmentation makes it available in server components via auth().
declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}

const getAdminEmails = (): string[] =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  // Google reads AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET from env automatically.
  providers: [Google],
  session: { strategy: "database" },
  // Auth.js redirects unauthenticated users to /login instead of its default /api/auth/signin.
  pages: { signIn: "/login" },
  callbacks: {
    // Expose user.id in the session so server components don't need an extra DB query.
    // With database strategy, 'user' here is the actual DB row.
    session: ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
    // Idempotent: promotes to admin if email is in ADMIN_EMAILS, demotes otherwise.
    // Runs after the adapter creates/finds the user, before the session is written.
    signIn: async ({ user }) => {
      if (!user.email) return true;
      const role = getAdminEmails().includes(user.email) ? "admin" : "user";
      await db.update(users).set({ systemRole: role }).where(eq(users.email, user.email));
      return true;
    },
  },
});
