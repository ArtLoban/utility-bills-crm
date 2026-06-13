# Deploy-Readiness Audit

**Date:** 2026-06-13
**Target:** first production deploy to Vercel (app) + Neon (Postgres)
**Nature:** read-only audit — factual ground truth to seed a deployment runbook. The only
command run was `npm run build`, once (§8).

Facts only. Where something is absent, it is stated explicitly. Closing section lists
observations that would block or complicate a first deploy — observations, not prescriptions.

---

## 1. Database driver and connection

Runtime client: **node-postgres (`pg`) `Pool`** via `drizzle-orm/node-postgres`. Instantiated at
module level in `lib/db/client.ts`:

```ts
// Driver isolation point — switching to Neon touches only this file:
//   import { neon } from "@neondatabase/serverless";
//   import { drizzle } from "drizzle-orm/neon-http";
//   export const db = drizzle(neon(process.env.DATABASE_URL!), { schema });
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });
export type DB = typeof db;
```

- **Single `DATABASE_URL`** — no separate pooled vs. direct URLs. `drizzle.config.ts` reads the
  same variable (`dbCredentials: { url: process.env.DATABASE_URL! }`).
- The `Pool` is created **once at module scope** — a long-lived, module-level connection pool, not
  the serverless connection-reuse pattern (e.g. `@neondatabase/serverless` HTTP driver). The file
  documents the one-file swap path to Neon serverless in the header comment above.

## 2. Migrations

- `db:migrate` → `drizzle-kit migrate`. Applies SQL files from `lib/db/migrations/` in order
  against the `DATABASE_URL` endpoint. Nothing in this path assumes local-only — the same
  `DATABASE_URL` can point at a **remote Neon** database.
- `db:generate` → `drizzle-kit generate` (produces new migration SQL from the schema).
- **No `db:push` script is defined** in `package.json`. `docs/README.living.md` mentions `db:push`
  as a dev-only shortcut, but it is not wired to any runnable npm script — not reachable outside
  manual local use.
- **`btree_gist` extension:** created in `0003_foundation.sql`
  (`CREATE EXTENSION IF NOT EXISTS btree_gist;`) and re-declared (idempotently) in
  `0008_icy_madame_hydra.sql`.
- **Exclusion constraints** (all `EXCLUDE USING gist (... WITH =, tstzrange(...) WITH &&) WHERE (deleted_at IS NULL)`):

  | Migration                   | Table(s)                                        |
  | --------------------------- | ----------------------------------------------- |
  | `0008_icy_madame_hydra.sql` | `contracts`                                     |
  | `0009_lush_thor.sql`        | `tariffs`, `account_numbers`, `payment_details` |
  | `0010_yielding_sir_ram.sql` | `meters`                                        |

  The extension (migration `0003`) precedes all constraint migrations (`0008`–`0010`) — ordering
  is correct; every exclusion constraint has its required extension already in place.

## 3. Auth.js v5 production config

Config: `lib/auth/index.ts`.

- **`trustHost` is NOT set.** Auth.js v5 auto-trusts the host when running on Vercel (via
  `VERCEL`/`AUTH_TRUST_HOST`), so a Vercel deploy works without it; any non-Vercel host would need
  it set explicitly.
- `session: { strategy: "database" }`; custom pages `signIn: "/login"`, `error: "/error"`.
- **`NEXTAUTH_URL`:** not referenced anywhere (Auth.js v5 uses `AUTH_URL`).
- **`AUTH_URL`:** referenced only in `lib/auth/cookie.ts`:
  ```ts
  const useSecureCookies = process.env.AUTH_URL?.startsWith("https://") ?? false;
  ```
  It toggles the `__Secure-` cookie name prefix and the `secure` flag.
- **Google OAuth redirect URL:** the provider is registered with defaults (`providers: [Google]`),
  reading `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` from env automatically. Auth.js derives the
  redirect URI from `AUTH_URL` + `/api/auth/callback/google`. **No `localhost` literal exists in
  the auth config or callbacks.** `localhost` appears only as `??` fallbacks behind
  `NEXT_PUBLIC_SITE_URL` in `app/robots.ts`, `app/sitemap.ts`, `app/layout.tsx`, and in
  test/Playwright config — none on an auth path.
- **Session cookie** (`lib/auth/cookie.ts`): explicitly `httpOnly: true`, `sameSite: "lax"`,
  `path: "/"`, `secure` conditional on `AUTH_URL` being https. `domain` and `maxAge` are **not
  set** — Auth.js defaults apply.

## 4. Runtime / edge compatibility

- **Middleware is `proxy.ts`** (Next.js 16 renamed `middleware.ts` → `proxy.ts`). It runs on the
  edge runtime. Matcher: `["/dashboard/:path*", "/art-admin/:path*"]`. Imports:
  ```ts
  import { type NextRequest, NextResponse } from "next/server";
  import { ROUTES } from "@/lib/routes";
  import { CORRELATION_ID_HEADER } from "@/lib/logger/constants";
  ```
  `lib/logger/constants.ts` is a bare string constant (`export const CORRELATION_ID_HEADER = "x-correlation-id";`)
  — **no `pino` reachable from the edge path.**
- **`pino` / `pino-pretty`** are imported only in `lib/logger/index.ts`, which is not reachable
  from `proxy.ts`. `next.config.ts` additionally declares
  `serverExternalPackages: ["pino", "pino-pretty"]`.
- **`export const runtime = ...`:** none — no such declaration anywhere in the codebase.
- **`next.config.ts`** (Vercel-relevant):

  ```ts
  const devAllowedOrigins = (process.env.DEV_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const nextConfig: NextConfig = {
    serverExternalPackages: ["pino", "pino-pretty"],
    images: {
      remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
    },
    ...(devAllowedOrigins.length > 0 && { allowedDevOrigins: devAllowedOrigins }),
  };
  export default withNextIntl(nextConfig);
  ```

  - Image domain `lh3.googleusercontent.com` (Google avatars).
  - `allowedDevOrigins` is dev-only, driven by the optional `DEV_ALLOWED_ORIGINS` env var
    (comma-separated); omitted entirely when unset. No host literal in source.
  - Wrapped by the `next-intl` plugin (`createNextIntlPlugin("./i18n/request.ts")`).
  - **No** redirects, headers, rewrites, or experimental flags. **No** `eslint.ignoreDuringBuilds`
    and **no** `typescript.ignoreBuildErrors` — type and lint errors fail the build.

## 5. Environment variables

From `.env.example`:

| Variable               | Status                                     | Notes                                                                                                      |
| ---------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`         | required                                   | Postgres connection string (local Docker or Neon).                                                         |
| `AUTH_SECRET`          | required                                   | Auth.js signing key (`openssl rand -base64 32`).                                                           |
| `AUTH_GOOGLE_ID`       | required                                   | Google OAuth client ID.                                                                                    |
| `AUTH_GOOGLE_SECRET`   | required                                   | Google OAuth client secret.                                                                                |
| `AUTH_URL`             | optional in file, "required in production" | Commented example; drives secure cookies + OAuth redirect.                                                 |
| `ADMIN_EMAILS`         | optional                                   | Comma-separated emails promoted to `systemRole = admin` on sign-in.                                        |
| `SEED_USER_EMAIL`      | optional                                   | Target dev user for seed scripts.                                                                          |
| `NEXT_PUBLIC_SITE_URL` | optional (commented)                       | Used for `metadataBase`, sitemap, robots; fallback `http://localhost:3000`.                                |
| `DEV_ALLOWED_ORIGINS`  | optional (commented)                       | Dev-only; comma-separated extra origins for `allowedDevOrigins` in `next.config.ts`. Unused in production. |

- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` are consumed implicitly by Auth.js (not via
  explicit `process.env.*`), but are documented in `.env.example`.
- `NODE_ENV` and `CI` are referenced implicitly (Next.js / GitHub Actions standard).
- **No `process.env.*` reference in the codebase is missing from `.env.example`.**

## 6. Seed and baseline data in production

- **`seed:demo`** → `tsx lib/db/seeds/demo.seed.ts`. Connection setup:
  ```ts
  config({ path: ".env.local" });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  ```
  It targets whatever `DATABASE_URL` resolves to — **can run against a remote DB**. No hardcoded
  `localhost`/Docker assumption. It is opt-in (not auto-run).
- **`service_types` catalog** is delivered via **migration** `0005_lowly_wendell_rand.sql`
  (`INSERT INTO "service_types" ... ON CONFLICT (code) DO NOTHING`) — applies automatically on
  `db:migrate`.
- **Landing CMS baseline content** is delivered via **migrations** `0017_content_seed.sql` (and
  `0018_about_hero_fields.sql`) as `UPDATE` statements on the singleton CMS tables — applies
  automatically on `db:migrate`.
- Conclusion: catalog + CMS baseline require **no manual seed step** in production; running
  migrations is sufficient. Demo data is separate and optional.

## 7. CI

- **No `.github/workflows/` directory exists — absent.** There is no automated pipeline running
  lint / typecheck / format / build / test on pull requests or on `main`.
- The corresponding scripts exist locally and could back a future pipeline: `lint` (`eslint .`),
  `typecheck` (`tsc --noEmit`), `format:check` (`prettier --check .`), `test` (`vitest run`),
  `build` (`next build`) — but nothing invokes them automatically.

## 8. Build

`npm run build` was run once. **Outcome: success.**

```
▲ Next.js 16.2.4 (Turbopack)
- Environments: .env.local
✓ Compiled successfully in 3.6s
  Running TypeScript ...
  Finished TypeScript in 5.8s ...
✓ Generating static pages using 13 workers (30/30) in 232ms
  Finalizing page optimization ...
```

- TypeScript check passed; 30 pages generated; one Proxy (Middleware) bundle. No errors or
  warnings surfaced. Most routes are dynamic (`ƒ`); `/robots.txt` and `/sitemap.xml` are static
  (`○`).
- Relevant config facts: `next 16.2.4` (Turbopack), `next-auth ^5.0.0-beta.31` (beta), strict
  `tsconfig` (`strict`, `noUncheckedIndexedAccess`, …), no build-error suppression.
- **No `vercel.json`** in the repo.
- **No pinned Node version** — no `engines` field in `package.json`, no `.nvmrc`, no
  `.node-version`.
- Package manager: npm (`package-lock.json`, lockfileVersion 3).

---

## Closing — observations that would block or complicate a first deploy

These are factual observations only.

1. **DB driver vs. serverless.** The runtime client is a long-lived module-level `pg` `Pool`
   (`lib/db/client.ts`), not the serverless HTTP driver. On Vercel functions + Neon this is the
   primary thing to reconcile (connection reuse / pooling). The file documents a one-file swap to
   `@neondatabase/serverless` + `drizzle-orm/neon-http`.
2. **`AUTH_URL` must be set in production** — it drives both secure-cookie selection
   (`lib/auth/cookie.ts`) and the Google OAuth redirect URI derivation. Currently only a commented
   example in `.env.example`.
3. **No CI pipeline** — no automated lint/typecheck/test/build gate before merge or deploy.
4. **No pinned Node version** — no `engines` / `.nvmrc` / `.node-version`; dev↔prod version drift
   is unconstrained.
5. **`next-auth` is on a beta** (`^5.0.0-beta.31`) — production-deployed pre-release.
6. **No `vercel.json`** — deploy relies entirely on Vercel defaults (build command, install,
   output) and dashboard-configured env vars.
7. **Build is green** as of this audit (§8) — no compile/type blocker.
