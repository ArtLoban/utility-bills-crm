# Utility Bills CRM

A multi-tenant web application for tracking utility bills across multiple properties. Built primarily as a senior-level engineering playground, with a real product target (my wife, replacing her paper notebook) and serving as a portfolio piece.

> This is a living document. It evolves with the project. Decisions are explained where they happen, deviations from plan are tracked, and open questions are held here until resolved.

> **Status (June 2026):** the MVP feature set is complete and the application is deployed and live in production. The project is at the threshold of its next stage — onboarding the first real user, which is the only remaining MVP criterion ("real users in active use").

## Table of Contents

1. [Project Background](#project-background)
2. [MVP Scope](#mvp-scope)
3. [Application Structure](#application-structure)
4. [Tech Stack](#tech-stack)
5. [Architecture Decisions](#architecture-decisions)
6. [Cross-cutting Principles](#cross-cutting-principles)
7. [Decision Log](#decision-log)
8. [Open Questions](#open-questions)
9. [Roadmap](#roadmap)
10. [Getting Started](#getting-started)
11. [Project Structure](#project-structure)
12. [Development Workflow](#development-workflow)
13. [Deployment](#deployment)
14. [Contributing](#contributing)

---

## Project Background

Three goals in priority order:

1. **Grow as a frontend/architect-level engineer.** The project is primarily a practice ground. Every decision is made with senior-level rigor. The stack reflects practices I want to internalize, not the fastest path to features.
2. **Serve as a portfolio piece.** The project should look and work like a serious, shippable product — demonstrating skill breadth to potential employers.
3. **Deliver a useful product.** The first user is my wife, who currently tracks utility bills for two apartments by hand in a notebook. Real users keep scope honest and quality high.

Goal ordering matters. An earlier version of this README framed the MVP around "wife stops using the notebook" as the primary criterion. That framing was explicitly rejected mid-design because it led to under-scoping features that serve the learning and portfolio goals. The scope pivot is recorded in the [Decision Log](#decision-log).

## MVP Scope

MVP is defined as a **minimum viable portfolio piece** — a project that demonstrates senior/architect-level frontend engineering and is functional end-to-end. As of June 2026 this scope is **built and live in production**; the items below describe achieved, shipped capabilities.

### In scope for v1 (MVP)

- **Public landing page** — SEO-friendly, doubles as portfolio showcase, includes links to developer resources.
- **Authenticated CRM** — properties with temporal contracts and tariffs, meter readings, bills, payments, ledger balance, dashboard with charts (pie / stacked bar / line).
- **Multi-user sharing** — full invite flow, roles (owner / editor / viewer), access management UI, multi-owner support.
- **Admin section** — property oversight (including soft-deleted), record restoration, hard delete, user list, CMS for landing content.
- **Multi-language** — English, Ukrainian, Russian.
- **Theming** — light and dark modes.

### Out of scope for MVP

See [Roadmap](#roadmap). Key items:

- Email/password auth (Google OAuth only in MVP)
- Telegram notifications
- File storage (Google Drive integration)
- Custom user-defined services
- Data export
- Search

## Application Structure

The application has **four distinct surfaces** with different access models:

- **Public** — SEO-indexed landing page and marketing pages, accessible without authentication. Doubles as the developer's portfolio.
- **Authenticated app** — the CRM itself, accessible to logged-in users.
- **Admin** — restricted to users with `systemRole === 'admin'`. Defense-in-depth via middleware + layout checks.
- **Auth** — sign-in, sign-out, and error pages (the `(auth)/` route group).

Routing uses Next.js route groups:

```
app/
  (public)/      public landing and marketing
  (auth)/        login, logout
  (app)/         authenticated CRM
  (admin)/       admin-only section
```

The public layout reads the auth session to adapt its header (Login for anonymous, Open CRM for authenticated users, Admin link for admins).

## Tech Stack

### Framework and language

| Layer     | Choice                                    |
| --------- | ----------------------------------------- |
| Runtime   | Node.js 22 LTS                            |
| Framework | Next.js (App Router, full-stack with RSC) |
| Language  | TypeScript (strict, maximum practical)    |

### Data layer

| Layer      | Choice                        |
| ---------- | ----------------------------- |
| Database   | PostgreSQL (Neon, serverless) |
| ORM        | Drizzle ORM                   |
| Validation | Zod + drizzle-zod             |

### Authentication

| Layer           | Choice             |
| --------------- | ------------------ |
| Library         | Auth.js v5         |
| Provider        | Google OAuth       |
| Session storage | Database (not JWT) |

### UI

| Layer             | Choice                          |
| ----------------- | ------------------------------- |
| Component library | shadcn/ui + Radix UI            |
| Styling           | Tailwind CSS v4                 |
| Forms             | React Hook Form                 |
| Tables            | TanStack Table                  |
| Charts            | Recharts (via shadcn/ui Charts) |
| Toasts            | sonner                          |
| URL state         | nuqs                            |
| Date utilities    | date-fns                        |
| Theming           | next-themes                     |
| i18n              | next-intl                       |

### Quality, testing, observability

| Layer             | Choice                                      |
| ----------------- | ------------------------------------------- |
| Testing runner    | Vitest                                      |
| Component testing | @testing-library/react + user-event         |
| Linting           | ESLint (Flat Config) + TypeScript ESLint    |
| Formatting        | Prettier + prettier-plugin-tailwindcss      |
| Git hooks         | Husky + lint-staged                         |
| Logging           | pino (structured)                           |
| Error tracking    | Sentry (integrated — instrumentation-based) |

### Infrastructure

| Layer            | Choice                         |
| ---------------- | ------------------------------ |
| App hosting      | Vercel (free tier)             |
| Database hosting | Neon (free tier)               |
| CI               | GitHub Actions                 |
| Deployment       | Vercel auto-deploy from GitHub |
| Package manager  | npm                            |

## Architecture Decisions

This section explains **why** each significant choice was made.

### Full-stack Next.js vs. split frontend/backend

The original plan was split architecture: Next.js as SPA, separate Node.js backend, communicating over HTTP. Classic, clean, teaches API design.

It was changed after the author understood what React Server Components and Server Actions actually offer. In a split architecture, half of App Router's modern capabilities don't apply — the project would be using Next.js without its main 2024–2026 innovations.

Full-stack Next.js means:

- Server Components fetch data directly from the database — no API layer.
- No type duplication between frontend and backend.
- Single deployment, single codebase, no CORS, no version skew.
- The growth area becomes "modern Next.js in its full form," which is the actual goal.

The later addition of a public landing page reinforced this choice: the landing page is a real SSG/SEO use case that would not have existed in an authenticated-only app.

**Trade-off accepted:** if this project ever needs a mobile app or public API for integrations, an API layer will need to be extracted. The likelihood is low enough and the learning benefit high enough that this is accepted.

### Database: PostgreSQL

The data is deeply relational with strict referential integrity requirements. Specific PostgreSQL features directly match the domain:

- **Temporal data** via `daterange` / `tstzrange` and exclusion constraints, for tariff and contract history.
- **Precise numeric types** (`numeric(12,2)`) for money, no floating-point error.
- **Row-Level Security** is available but explicitly not used — see below.

NoSQL is an anti-pattern here. MySQL is weaker on the specific feature set. SQLite is not viable for a product that will grow past one user.

### ORM: Drizzle

Considered: Prisma, Drizzle, Kysely.

- **Prisma** was rejected because it abstracts SQL too heavily. The author's learning goals require staying close to SQL, not hiding it. Prisma also has known issues with query efficiency in complex joins and with serverless connection pooling.
- **Kysely** is closer to the right fit but requires more infrastructure (migrations, schema definitions) which distracts from product-building in a solo project.
- **Drizzle** balances these: SQL-like API that keeps SQL visible (so learning happens), schema-as-TypeScript, built-in migrations. The `drizzle-zod` integration eliminates schema/validation duplication.

### Authentication: Auth.js with database sessions

Considered: managed service (Clerk/Auth0), Auth.js library, roll-your-own.

- **Managed services** were rejected because they hide the learning.
- **Roll-your-own** was rejected as unjustified security risk.
- **Auth.js** fits the middle: abstracts what shouldn't be reinvented, exposes what matters.

**Database sessions (not JWT)** because:

- Sliding expiration with immediate revocation is required.
- Per-request DB cost is negligible at this scale.

**Session policy:**

| Scenario              | Inactivity timeout | Absolute cap |
| --------------------- | ------------------ | ------------ |
| Without "Remember me" | 1 hour             | —            |
| With "Remember me"    | 7 days             | 30 days      |

### Multi-tenancy: application-level isolation

PostgreSQL Row-Level Security was considered but rejected:

- Adds database-level complexity that distracts from frontend-focused growth goals.
- Drizzle does not have first-class RLS support.
- Debugging "why does this query return 0 rows" is harder with invisible DB-layer filters.

Instead: **typed helper functions** encapsulate access filters. All data queries go through helpers like `accessibleProperties(userId)` that apply filters explicitly and consistently.

### Access control: two orthogonal dimensions

- **`users.systemRole`**: `'user' | 'admin'`. Application-level privilege. Admins access admin-only views that bypass normal tenant filters.
- **`propertyAccess.propertyRole`**: `'owner' | 'editor' | 'viewer'`. Per-property role granted to a user.

Rules:

- Any property can have multiple users with any combination of roles (multi-owner supported for family scenarios).
- Only owners can invite users or change roles.
- Owners can remove editors and viewers, but cannot remove other owners.
- Each property must have at least one owner at all times.
- Users can always remove themselves.

### Soft delete and hard delete

All primary entities have `deletedAt` timestamps. Lifecycle: active → soft-deleted → hard-deleted.

- **User soft delete** cascades to all related entities in one transaction. User-facing message: "This action cannot be undone" — because from the user's perspective, it cannot.
- **Admin** can view soft-deleted records, restore them, or hard-delete.
- **Hard delete** is admin-only and only works on already-soft-deleted records.
- **External storage** (Google Drive, v2+) is never touched by our deletion operations.

### UI: shadcn/ui + Tailwind (not MUI/Mantine)

MUI was the author's daily driver for 2.5 years. Using it again would be fast but would add nothing to growth.

Mantine was rejected for being philosophically too similar to MUI.

**shadcn/ui with Radix** was chosen because:

- Different paradigm from Material component libraries — headless primitives, user-owned component source code.
- Components live inside the project, teaching component design.
- De-facto modern choice for React in 2025–2026.
- Radix provides first-class accessibility.

Tailwind v4 was picked over v3 to learn the currently-shipping version.

### Error handling approach

- **Expected errors** → returned as typed Result values (Rust/Go pattern), not thrown.
- **Unexpected errors** → thrown, caught by App Router `error.tsx`, logged to Sentry.
- **Domain error hierarchy** (`DomainError`, `NotFoundError`, `ForbiddenError`, `ValidationError`) for clean boundary discrimination.
- **Server-side validation is always performed**, even after client validation.

### Observability strategy

- **Structured logging with `pino`** — every log line inside a request carries a correlation ID via AsyncLocalStorage; PII/secrets are redacted by a central key list (`lib/logger/redaction.ts`).
- **Correlation ID** — generated in the proxy, forwarded on the `x-correlation-id` header; cron/webhook routes generate their own at entry. Propagated into logs and attached to Sentry events as a tag, bridging an error to its matching log lines.
- **Sentry** for unhandled errors — free tier, instrumentation-based (`instrumentation.ts`); server-side scrubbing aligned to the same redaction key list, `sendDefaultPii: false`.
- **No metrics, no tracing in MVP** — added only if real need emerges.

> **#154 — Observability hardening (pino redaction + ALS correlation id + Sentry).** Supersedes the deferral in #115. Six locked decisions, built as one piece because Sentry consumes the correlation id and reuses the redaction list: **(1) Correlation id via AsyncLocalStorage** — a request-scoped context; a pino `mixin` auto-attaches `correlationId` to every line in scope, with no threading through signatures. Node route handlers (cron, webhook) seed it with an id generated at entry (they sit outside the proxy matcher); RSC/Server-Action code is not ALS-wrapped, so it reads the proxy-forwarded `x-correlation-id` header via `resolveCorrelationId`. The Edge proxy and the Node runtime share only the header, never an ALS context. **(2) Redaction policy** — one `SENSITIVE_KEYS` list (`lib/logger/redaction.ts`) is the single source of truth feeding both pino `redact` and Sentry scrubbing; it redacts PII/secrets (email, amounts, account numbers, readings, names, tokens) and intentionally allows low-sensitivity operational ids (`userId`, `correlationId`, `chatId`). **(3) Sentry is instrumentation-based** (Next 16): `instrumentation.ts` (`register` + `onRequestError`), `instrumentation-client.ts`, `sentry.server/edge.config.ts`, and `withSentryConfig` — not the legacy `sentry.client.config.ts` auto-init. **(4) Privacy** — `sendDefaultPii: false`, `tracesSampleRate: 0` (error tracking only); `beforeSend` scrubs the same key list as the logs. **(5) Correlation id as a Sentry tag** — the server `beforeSend` tags from ALS; `onRequestError` tags RSC/server-component errors from the forwarded header — so a Sentry event pivots to its matching pino log lines. **(6) Throw-site logging centralized in `unwrapOrThrow`** (`lib/unwrap-or-throw.ts`) — replaces the duplicated `shouldHideAsNotFound(...) ? notFound() : throw` guard pattern; every unexpected error reaching `error.tsx` is now also a structured `logger.error` carrying the correlation id, while hideable (expected) errors stay unlogged.

> **#155 — Returned errors are plain serializable data (`TAppError` keyed by `code`); Error instances never cross the Server Action → client boundary.** Overrides #140/#143/#124 in the part that discriminated returned errors by `error.name`. React Flight strips every `Error` instance to a bare tag in production when a returned `Result` crosses to a client component (`if (value instanceof Error) return "$Z"`), so `error.name`/`message`/`instanceof` are all lost — the demo-mode toast (and the `ValidationError` inline-error path in 11 form hooks) silently fell back to the generic "Failed to save" in prod while working in dev (dev serializes `{name,message,stack}`). Fix: actions return `TAppError = { code: NOT_FOUND | FORBIDDEN | VALIDATION | DEMO_MODE; … }` built via `appError.*` factories (`lib/errors.ts`); clients discriminate by `error.code === ERROR_CODES.X` and read inline text via `errorMessage()`. The `DomainError` class hierarchy is retained **only** to reconstruct a throwable Error at the single throw boundary (`unwrapOrThrow` → `toThrowable`), so pino's `err` serializer and Sentry still receive a real Error — observability (#154) is unchanged because returned `{code}` values are never thrown and so never reach Sentry. The dual-use access helpers (`billByIdForUser` et al., consumed both by read pages that throw and by actions that return to the client) are why one unified plain-data model was chosen over a split read/return type. Full background: `.claude/instructions/action-error-serialization.md`; lesson `0015`. Now compiler-enforced: `err` is constrained to `<E extends TAppError>` (`lib/errors.ts`), so passing a non-`TAppError` payload (e.g. an `Error` instance) is a compile error at the call site everywhere — closing the producer-side hole where the check previously depended on the enclosing function carrying an explicit `Result<T>` return annotation; a `@ts-expect-error`-guarded `err(new DemoModeError())` in `lib/__tests__/errors.test.ts` locks it. The one deliberately non-domain error channel — the notifications/Telegram delivery subsystem, whose failures carry free-form external-service diagnostic text persisted verbatim to the delivery ledger and not reducible to a domain `code` — was decoupled from the domain `err` onto its own constructor (`features/notifications/result.ts`, `infraFail` → `TInfraResult`) rather than weakening the constraint or polluting `TAppError` with a pseudo-`EXTERNAL` code. Observability note (reviewed, deliberately not acted on): pino and Sentry scrub by key name, not by substrings inside string values, so PII embedded in a message string would not be redacted. Audited the live surface — no current path puts PII in a message or log (error messages carry only static text / i18n keys / opaque UUID ids; logs carry only `err`/allowed `userId`/`chatId`/aggregates), and error identity survives redaction via the `type` field. Substring-level scrubbing is therefore intentionally deferred until a real PII-in-message path exists; revisit if one is introduced.

### Testing strategy: B (strategic)

- Business logic: ledger, temporal tariff lookups, dashboard aggregations.
- Critical Server Actions: creating bills, recording payments, changing tariffs, sharing flows.
- Utility functions: currency/date formatting.
- 1–2 component tests to keep the skill alive.

Not tested in MVP: trivial CRUD, most UI components, auth flow (trusting the library), E2E scenarios.

### Infrastructure: Vercel + Neon (free tier)

- **Self-host** would teach DevOps but costs money and distracts from frontend growth.
- **Railway/Render/Fly** were viable but less polished with Next.js.
- **Vercel + Neon** is canonical Next.js deployment with official integration.

Mild Vercel lock-in is acknowledged and accepted.

### CI/CD: Vercel deploys, GitHub Actions checks

Vercel handles deployment automatically. GitHub Actions runs quality checks in parallel. Branch protection on `main` prevents merging PRs with failing checks.

## Cross-cutting Principles

- **Multi-tenant from day one.** Every entity carries an owner reference. Every query filters by access. No shortcuts.
- **Temporal data for changeable things.** Tariffs, account numbers, payment details stored with `validFrom` / `validTo`. Old records are closed, not overwritten.
- **Ledger approach to money.** Bills and payments are independent. Balance is derived.
- **Soft delete everywhere.** Data doesn't disappear physically. Hard delete is admin-only and gated behind soft delete.
- **i18n from day one.** Every user-facing string through `t('key')`.
- **UTC in the database, local time in the UI.**
- **UI speaks the user's language, not the developer's.** No "Bill," "Contract," "Meter" as UI terms.
- **Progressive disclosure.** Required fields minimal. System invites completion gently.
- **Code quality at senior level.** Type safety, readability, separation of concerns, explicit types.

## Decision Log

Chronological record of significant decisions. Each entry captures what was chosen, what the alternatives were, and why.

### 2026-04 — Phase 4: Architecture and stack

| #   | Decision                               | Alternatives considered                     | Outcome            |
| --- | -------------------------------------- | ------------------------------------------- | ------------------ |
| 1   | Backend language: TypeScript           | Go, Kotlin, Rust                            | TypeScript         |
| 2   | Frontend/backend split: unified        | Split Next.js + Node.js backend             | Next.js full-stack |
| 3   | Database: PostgreSQL                   | MySQL, SQLite, MongoDB                      | PostgreSQL         |
| 4   | ORM: Drizzle                           | Prisma, Kysely                              | Drizzle            |
| 5   | Auth: Auth.js                          | Clerk (managed), roll-your-own              | Auth.js            |
| 6   | Session strategy: database             | JWT                                         | Database sessions  |
| 7   | UI library: shadcn/ui                  | MUI, Mantine, Ant Design                    | shadcn/ui          |
| 8   | Styling: Tailwind v4                   | Tailwind v3, CSS Modules, styled-components | Tailwind v4        |
| 9   | Forms: React Hook Form                 | Formik, TanStack Form                       | React Hook Form    |
| 10  | Validation: Zod                        | Yup, Valibot                                | Zod                |
| 11  | Tables: TanStack Table                 | MUI DataGrid (paid), AG Grid (paid)         | TanStack Table     |
| 12  | Charts: Recharts                       | Visx, Chart.js                              | Recharts           |
| 13  | Toasts: sonner                         | react-hot-toast, react-toastify             | sonner             |
| 14  | i18n: next-intl, cookie-based          | react-i18next; path-prefix strategy         | next-intl cookie   |
| 15  | Theming: next-themes                   | (no real alternative)                       | next-themes        |
| 16  | Logging: pino                          | winston                                     | pino               |
| 17  | Error tracking: Sentry                 | PostHog, LogRocket                          | Sentry             |
| 18  | Testing strategy: Strategic (B)        | No tests / comprehensive coverage           | Strategic          |
| 19  | Testing runner: Vitest                 | Jest                                        | Vitest             |
| 20  | Hosting: Vercel + Neon                 | Railway, Render, self-hosted VPS            | Vercel + Neon      |
| 21  | CI pattern: Vercel deploy + Actions CI | Actions-controlled deploy                   | Split              |
| 22  | Package manager: npm                   | pnpm, bun, yarn                             | npm                |

### 2026-04 — Phase 5: Data model design

| #   | Decision                                                        | Alternatives considered                                  | Outcome             |
| --- | --------------------------------------------------------------- | -------------------------------------------------------- | ------------------- |
| 23  | Temporal data: inline versioning with `validFrom`/`validTo`     | Separate history tables; event sourcing                  | Inline versioning   |
| 24  | Interval semantics: half-open `[validFrom, validTo)`            | Closed intervals                                         | Half-open           |
| 25  | Audit trail: basic `createdAt`/`updatedAt` only                 | Full bitemporal (valid + transaction time)               | Basic only          |
| 26  | Service topology: Contract as grouping aggregate                | Flat temporal per attribute                              | Contract-based      |
| 27  | Contract-level temporal attributes: tariff, account, payment    | Fixed on Contract (new Contract per any change)          | Temporal within     |
| 28  | Provider: only attribute that creates new Contract when changed | Also account/payment changes create new Contract         | Provider only       |
| 29  | Meter ownership: Meter → Property (physical thing)              | Meter → Service (logical)                                | Property            |
| 30  | Multi-zone meters: multi-value Reading (`valueT1`/`T2`/`T3`)    | Row-per-zone                                             | Multi-value         |
| 31  | Bill period: hybrid (`periodStart`/`periodEnd` + `periodMonth`) | Month-only; arbitrary range only; separate BillingPeriod | Hybrid              |
| 32  | Payment: `paidAt` only, no period attribution in model          | Period fields on Payment                                 | Event-only          |
| 33  | Multi-tenancy enforcement: application-level                    | PostgreSQL RLS                                           | Application-level   |
| 34  | Access model: `PropertyAccess` table from day one               | Shortcut with `ownerId` only, refactor later             | PropertyAccess      |
| 35  | Roles: one user = one role per property                         | Multiple roles per user per property                     | One role            |
| 36  | Multi-owner: supported                                          | Single owner enforced                                    | Multi-owner         |
| 37  | Owner removal: can't remove another owner                       | Any owner can remove any owner                           | Protected           |
| 38  | System role: separate `systemRole` on User                      | Single combined role field                               | Separate            |
| 39  | Role field naming: `systemRole` + `propertyRole`                | Both named `role`                                        | Distinct names      |
| 40  | Admin UI: integrated route group `(admin)`                      | Separate app; DB-only admin                              | Integrated          |
| 41  | Soft delete cascade: application-level cascade on parent        | Logical cascade (children untouched)                     | Application cascade |
| 42  | Hard delete: admin-only, requires prior soft delete             | Direct hard delete; user-initiated hard delete           | Two-phase admin     |
| 43  | External file storage: never touched by our deletions           | Cascade delete files                                     | App owns refs only  |

### 2026-04 — Phase 5: Data model detailed schema (finalization)

Additional decisions made during detailed schema specification:

| #   | Decision                                                                                                                                                                                                 | Alternatives considered                                                        | Outcome                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| 44  | Enum implementation: text + CHECK                                                                                                                                                                        | Native PostgreSQL ENUM types                                                   | text + CHECK                 |
| 45  | Temporal interval type: two `timestamptz` columns                                                                                                                                                        | Single `tstzrange`; two `date` columns                                         | Two `timestamptz`            |
| 46  | Numeric precision: rates `(12,4)`, amounts `(12,2)`, meter `(12,3)`                                                                                                                                      | Uniform precision across all numerics                                          | Per-purpose                  |
| 47  | Bill date semantics: `date` (calendar), not `timestamptz`                                                                                                                                                | `timestamptz` for periods                                                      | `date`                       |
| 48  | Providers: per-user catalog, not global                                                                                                                                                                  | Global catalog with admin moderation                                           | Per-user                     |
| 49  | `gas_delivery` as a distinct ServiceType                                                                                                                                                                 | Merging with `gas`                                                             | Distinct type                |
| 50  | Future `measurementType` evolution (e.g., gas_delivery → metered)                                                                                                                                        | Change-type in place; new ServiceType; Contract-level measurementType          | Change in place (Approach A) |
| 51  | `PropertyAccess` has own `id` PK                                                                                                                                                                         | Composite `(propertyId, userId)` PK                                            | Own `id`                     |
| 52  | `PropertyAccess` uniqueness via UNIQUE partial index                                                                                                                                                     | UNIQUE over composite key                                                      | Partial UNIQUE               |
| 53  | `service_types` catalog is seeded, no UI management in MVP                                                                                                                                               | Admin UI for service types catalog                                             | Seeded only                  |
| 54  | Meter has separate `installedAt`/`removedAt` vs `validFrom`/`validTo`                                                                                                                                    | Single validity pair for both physical and system                              | Separate pairs               |
| 55  | Reading monotonicity: UX warning, not DB constraint                                                                                                                                                      | DB-enforced non-decreasing                                                     | UX warning only              |
| 56  | Multiple bills per period permitted                                                                                                                                                                      | UNIQUE/exclusion on `(serviceId, periodMonth)`                                 | Multiple allowed             |
| 57  | Expected amount not stored; computed at query time                                                                                                                                                       | Materialized on bill                                                           | Computed                     |
| 58  | `payment_details` as plain text blob                                                                                                                                                                     | Structured fields (IBAN, bank, recipient)                                      | Plain text                   |
| 59  | `createdBy` on user-generated entities (readings, bills, payments); nullable FK with `ON DELETE SET NULL` — always set on insert, goes NULL only when the author is hard-deleted, so the record survives | Omitted in MVP; or `NOT NULL` (would block deleting a user with authored rows) | Tracked, nullable            |
| 60  | Landing CMS data model: deferred to Phase 6.5                                                                                                                                                            | Designed alongside core schema                                                 | Deferred                     |

### 2026-04 — Phase 6: UI design

| #   | Decision                                                                  | Alternatives considered                            | Outcome                      |
| --- | ------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------- |
| 61  | Navigation pattern: top bar (not sidebar)                                 | Sidebar (classic CRM)                              | Top bar                      |
| 62  | Admin URL prefix: `/art-admin`                                            | `/admin`, `/manage`, `/control`                    | `/art-admin`                 |
| 63  | Admin visual identity: amber accent line + Admin badge                    | Accent only; badge only; tinted background         | Both combined                |
| 64  | Landing pages: three separate (not single-page)                           | Single-page with anchors                           | Three pages                  |
| 65  | Global `/bills` and `/payments` lists                                     | Only nested in property/service                    | Global + nested access       |
| 66  | Property list: card grid                                                  | Table                                              | Card grid                    |
| 67  | Property detail: tabs pattern                                             | Long scroll; separate pages                        | Tabs                         |
| 68  | Service detail: hybrid (main view + drawers)                              | Tabs; long scroll                                  | Hybrid                       |
| 69  | Service edit: notes only                                                  | Full edit form including contract/tariff           | Notes only                   |
| 70  | Contract history: side drawer                                             | Full page; modal                                   | Drawer                       |
| 71  | Entry records (reading, bill, payment): modals                            | Dedicated pages                                    | Modals                       |
| 72  | Meter: belongs to Property                                                | Belongs to Service                                 | Property                     |
| 73  | Multi-zone readings: multi-value fields (valueT1/T2/T3)                   | Row-per-zone                                       | Multi-value                  |
| 74  | Meter detail: single column scroll                                        | Split view                                         | Single column                |
| 75  | Reading edit: reuse Submit Reading modal                                  | Inline edit; dedicated page                        | Reuse modal                  |
| 76  | Bills list pattern: data table with URL-synced filters                    | Card list; nested only                             | Data table + URL sync        |
| 77  | Bill period: UI accepts month, schema tracks periodStart/End/Month        | UI allows custom range in MVP                      | Month only in MVP UI         |
| 78  | Stacked bar: stacked + tooltip + clickable legend                         | Toggle stacked/grouped; one service at a time      | Stacked only with enrichment |
| 79  | Line chart modes: money (multi-line) + consumption (single)               | Single mode; three modes                           | Two modes with toggle        |
| 80  | Property detail does not have Bills/Payments tabs                         | Separate tabs for bills and payments               | Global list with prefilter   |
| 81  | Sharing invite flow: immediate access (no accept step)                    | Accept/decline with pending state                  | Immediate                    |
| 82  | Last-owner leave protection: explicit helpful modal                       | Error toast; disabled button                       | Helpful modal                |
| 83  | Subtle banner on first login after invite                                 | Toast; notification center; nothing                | Subtle banner                |
| 84  | Hard delete confirmation: type-to-confirm                                 | Double confirm; single confirm                     | Type "DELETE"                |
| 85  | Soft-deleted rows in admin: opacity + strikethrough + badge               | Separate "Trash" page                              | Inline visual distinction    |
| 86  | Admin users view: read-only in MVP                                        | Full CRUD                                          | Read-only                    |
| 87  | Admin dashboard: minimal (4 stats + recent activity)                      | Full analytics dashboard                           | Minimal                      |
| 88  | Landing visual: "Variant B" — shared design + landing flavor              | Full consistency with CRM; radically different     | Shared base, distinct flavor |
| 89  | Landing page structure: `/` + `/about` + `/project` separate              | Single page with sections                          | Separate pages               |
| 90  | `/about` minimalism: no surname, no level label, no email                 | Full professional bio with CV download             | Minimal gateway              |
| 91  | `/about` contact: LinkedIn only, no email                                 | Email + LinkedIn + contact form                    | LinkedIn only                |
| 92  | `/project` stack grid: Frontend + Backend (no Infrastructure)             | Three columns including Infrastructure             | Two columns                  |
| 93  | Schema visualization on `/project`: text tree in MVP                      | ER diagram                                         | Text tree (ER in v2)         |
| 94  | Live demo: view-only demo account with pre-seeded data                    | No demo; full public access; recorded video        | View-only demo               |
| 95  | Demo data seed: one-time at deploy                                        | Nightly re-seed via cron                           | One-time                     |
| 96  | Demo mode enforcement: backend reject + frontend friendly modal           | Backend error only                                 | Both (defense in depth)      |
| 97  | CMS data model: five singleton-row tables (entity-per-section)            | Key-value store; JSON blob per page                | Entity-per-section           |
| 98  | CMS editing: per-tab save                                                 | Global save                                        | Per-tab                      |
| 99  | CMS preview: not in MVP                                                   | Split-view preview                                 | Deferred                     |
| 100 | CMS visibility: two flags (nav + URL access) per page                     | Single flag                                        | Two independent flags        |
| 101 | Auth login: Google OAuth + Remember me checkbox                           | Separate email/password form                       | Google OAuth only in MVP     |
| 102 | Sign out confirmation: none for regular, modal for "all devices"          | Confirmation for all sign outs                     | Asymmetric                   |
| 103 | Session policy: sliding 1h default / sliding 7d + 30d cap                 | Longer defaults; no absolute cap                   | Confirmed from Phase 4       |
| 104 | Return-to redirects on auth: implemented with query param                 | Always redirect to dashboard                       | Query param supported        |
| 105 | Form validation: inline, not toast                                        | Toast notifications for form errors                | Inline                       |
| 106 | Loading feedback: 200ms delay before skeleton                             | Immediate skeleton; 500ms delay                    | 200ms                        |
| 107 | Color coding: destructive for debt/expense, green for payment/overpayment | Neutral for both                                   | Colored semantics            |
| 108 | Forbidden (403) response: return 404 instead                              | Explicit 403 page                                  | 404 (hide existence)         |
| 109 | Global `/meters` list page added (post-iteration 5)                       | Keep meters per-property only; widget on dashboard | Global page added            |
| 110 | Property create/edit migrated from dedicated pages to modals              | Keep dedicated pages /new and /[id]/edit           | Modals                       |

### 2026-04 — Scope pivot: from "product-first" to "portfolio-first"

Mid Phase 5, the framing of MVP was explicitly pivoted:

- **Before:** MVP = "wife stops using the notebook." Minimum product that replaces manual tracking.
- **After:** MVP = "minimum viable portfolio piece." Demonstrates senior/architect-level frontend engineering, is functional end-to-end.

What changed in scope as a result:

- **Added to MVP:** public landing page (SEO-friendly, doubles as portfolio), admin section with landing content CMS, multi-user sharing with full invite flow and roles.
- **Reaffirmed in MVP:** Google OAuth, multi-language, light/dark theme, full temporal data, admin-only hard delete.
- **Remaining in v2+:** email/password auth, Google Drive, Telegram, custom services, export, search.

Rationale: the "product-first" framing had begun to systematically under-scope features that serve learning and portfolio goals. Examples: sharing was pushed to v2 even though the access model was already designed to support it; admin UI was initially dismissed as "overkill for one user." Re-ordering priorities (growth → portfolio → product) resolved this tension and produced a coherent MVP scope.

### 2026-05 — Phase 7: Implementation

| #   | Decision                                                                                                                                                               | Alternatives considered                                                                                                     | Outcome                                                     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 111 | URL state sync: nuqs                                                                                                                                                   | useSearchParams + manual sync                                                                                               | nuqs                                                        |
| 112 | Date utilities: date-fns                                                                                                                                               | dayjs, Intl API only                                                                                                        | date-fns                                                    |
| 113 | Co-located page components: `_components/` convention per route                                                                                                        | top-level `components/` for everything                                                                                      | `_components/` per route                                    |
| 114 | @base-ui/react → Radix UI (tech debt correction)                                                                                                                       | keep @base-ui despite known issues                                                                                          | Radix (aligns with decision #7)                             |
| 115 | Sentry integration: deferred within Phase 7                                                                                                                            | integrate from scaffold                                                                                                     | deferred (superseded by #154 — now integrated)              |
| 116 | Admin auth: `ADMIN_EMAILS` env var, seeded on first sign-in                                                                                                            | DB flag set manually; separate admin setup flow                                                                             | env-based seed                                              |
| 117 | Modal implementation: hybrid — intercepting routes for entity modals, local `<ConfirmDialog>` for confirmations                                                        | All via intercepting routes; all via Zustand store; all via local `useState`                                                | Hybrid                                                      |
| 118 | `service_types` catalog delivered via migration `INSERT`; no separate production-seed mechanism                                                                        | Dedicated `seed:prod` script; one idempotent seed with env-gated dev part                                                   | Catalog in migration                                        |
| 119 | Global `/providers` catalog page; provider management not limited to contract-form inline only                                                                         | Provider management inline within the contract form only (no dedicated page)                                                | Dedicated `/providers` page                                 |
| 120 | List-page filtering, sorting, and pagination run on the backend; URL is the source of truth for query state                                                            | Client-side data operations via TanStack Table row models                                                                   | Backend-driven, URL-synced                                  |
| 121 | List-page filtered totals: domain aggregate separate from pagination                                                                                                   | Extending `pagination` with the sum                                                                                         | `totals: { amount }` separate                               |
| 122 | Ledger as a dedicated `features/ledger/` slice                                                                                                                         | Inside `features/bills/` or `features/payments/`; in `lib/` as utility                                                      | Dedicated slice                                             |
| 123 | Sharing as a dedicated `features/sharing/` slice                                                                                                                       | Inside `features/properties/`                                                                                               | Dedicated slice                                             |
| 124 | i18n error-code pattern: two-tier namespace within feature namespace                                                                                                   | Flat error namespace; HTTP-status-based surfacing; ad hoc per component                                                     | Two-tier feature namespace                                  |
| 125 | locale/theme persistence: DB durable value carried via session callback; resolution order `cookie → session → default`                                                 | hydrate cookie from DB at login (via middleware / route handler); DB-wins resolution order (`session → cookie`)             | session-carried, cookie-priority                            |
| 126 | Russian locale hidden by default; opt-in per user via Settings                                                                                                         | keep all three locales equally visible; remove `ru` entirely                                                                | opt-in flag, hidden by default                              |
| 127 | `users.lastLoginAt` added to back the admin "Last login" column                                                                                                        | derive from most recent session (unreliable); drop the column for MVP                                                       | nullable column, written on sign-in                         |
| 128 | Admin restore cascade scoped by the soft-delete event timestamp                                                                                                        | blanket un-delete all currently-deleted children; dedicated cascade-id column                                               | `WHERE deletedAt = stamp` scoping                           |
| 129 | Admin restore / hard-delete modals reconciled from intercepting-route to `<ConfirmDialog>` pattern (#117)                                                              | keep as intercepting-route modals                                                                                           | ConfirmDialog + createSafeContext                           |
| 130 | Admin dashboard "recent activity" derived from `createdAt`, not an event table                                                                                         | a real event/audit table; leaving the feed mocked                                                                           | UNION ALL over 6 entity tables                              |
| 131 | Admin dashboard "soft-deleted" stat counts soft-deleted properties only, not all `deletedAt` rows                                                                      | sum all `deletedAt` tables; count a curated subset of top-level entities                                                    | soft-deleted properties count only                          |
| 132 | Landing CMS schema realized as five singleton-row tables (closes deferred #60, realizes #97)                                                                           | key-value store; JSON-per-page blob (both rejected at #97)                                                                  | five singleton tables in migration                          |
| 133 | Public landing reads CMS via unguarded slice readers; visibility flags honored; status/works-with as plain multiline; flag caching resolved to path-based revalidation | `unstable_cache` + `revalidateTag` for shared flags read                                                                    | path-based revalidation via existing `revalidatePath`       |
| 134 | Public SEO: per-page metadata derived from CMS via cached reads; sitemap honors visibility flags; robots is minimal (no Disallow list)                                 | dedicated SEO CMS columns; per-page/dynamic OG images; hardcoded production domain; enumerating private paths in robots.txt | `generateMetadata` + `cache()` + `sitemap.ts` + `robots.ts` |
| 136 | Demo sign-in via a session-creating route handler, not a Credentials provider                                                                                          | Credentials provider (forces JWT, conflicts with database sessions #6)                                                      | Route handler at `/auth/demo`                               |

> **#117 — detail.** Decision #71 established that entity creation/editing happens via modals, but not _how_ they are implemented. The mechanism is chosen by one criterion — whether the modal has a meaningful shareable URL:
>
> - **Navigational modals** (view / edit / add an entity tied to an ID) — implemented via **Parallel + Intercepting Routes** under a `@modal` slot. Soft navigation shows the modal over its parent; hard navigation renders a full-page fallback. Gives shareable URLs, refresh-safety, and browser-back close behaviour.
> - **Confirmation modals** (delete, leave property, role change, unsaved changes) — implemented as a local `<ConfirmDialog>` driven by `useState`. They have no identity worth sharing; a refresh should close them, not preserve them.
>
> **Confirmation modal state.** When a confirmation modal is triggered from deep in the tree (typically a row action in a table), the `useState` is lifted into a feature-level Context provider, keeping `<DataTable>` a clean generic component. A global store is not used — the state belongs to the page, not the application. The Context is created via a shared `createSafeContext` helper (`lib/utils/`). For a single modal with one trigger point, local `useState` is enough.
> **#118 — detail.** Stage 3 raised the deferred question of seed infrastructure: the dev-seed had been kept minimal (2–3 rows per entity), and `service_types` is the first entity that _must_ be seeded for the product to function at all. Rather than introduce a production-seed script, the catalog is treated as schema-level product data: a fixed 11-entry reference table (#53, no admin UI), owned by the developer, changed only through code. It is delivered by the migration pipeline — the `CREATE TABLE` migration also `INSERT`s the rows, idempotently keyed on the unique `code`. Production receives the catalog automatically on `db:migrate`; no deploy step can forget it. The dev-seed script stays strictly dev-only, for fake properties/services. A genuine production-seed mechanism is not needed for the catalog; the question resurfaces at Stage 8 for the demo account, which _is_ seed data (bulk fake data, potentially re-seedable) rather than schema-level data.

> **#119 — detail.** Global `/providers` page added. Alternatives considered: provider management inline within the contract form only (no dedicated page). Outcome: dedicated `/providers` catalog page. Rationale: provider is a per-user data entity and deserves explicit, discoverable management; the UI design (Phase 6) surfaced providers only inside the contract flow because contracts weren't detailed yet — this closes that gap.

> **#120 — detail.** All list pages perform filtering, sorting, and pagination on the backend. Query parameters are read from the URL search string and passed to the server action or API route; `useReactTable` is used for rendering only — it does not own filtering, sorting, or pagination state.
>
> **Transport:** query string parameters on a GET request.
>
> **Pagination — offset-based:** `page` and `pageSize` parameters. Backend defaults: `page=1`, `pageSize=25`. `pageSize` maximum is `100`; larger values are clamped. A `page` beyond available data returns an empty `data` array with accurate pagination metadata.
>
> **Sorting:** `sortBy` and `sortOrder` parameters. Single-column sorting only — multi-sort is not supported. `sortBy` is validated against a per-page allow-list of sortable columns. Default sorting is domain-specific with `createdAt desc` as the secondary tie-breaker (Bills: `periodMonth desc`; Payments: `paidAt desc`).
>
> **Filtering:** equality filters (`status=active`, `propertyId=<id>`); multi-value filters use `;` as separator (`service=gas;water`). Operator-based filters (`gte`, `lte`) are not used.
>
> **Date filtering:** `dateFrom` and `dateTo`, format `YYYY-MM-DD`. Both optional and independent — either bound alone is valid; both together form a range; neither means no date filter. Both bounds are inclusive. Named period presets are a frontend concern; only resolved dates are sent to the backend.
>
> **Invalid parameters:** any invalid query parameter is replaced with its default; the page still renders. Invalid `sortBy` falls back to the default sorting.
>
> **Response shape:** `{ data: [...], pagination: { page, pageSize, total, totalPages } }`.
>
> **Parameter vocabulary:** shared across all list pages — `page`, `pageSize`, `sortBy`, `sortOrder`, `dateFrom`, `dateTo`, plus page-specific filter keys (e.g. `status`, `propertyId`, `service`).
>
> Rationale: client-side data operations (TanStack Table row models) cannot work once data is paginated server-side — the table only receives one page of rows. A URL-based contract gives shareable, refresh-safe state and lets every list page share one backend contract.

> **#121 — List-page filtered totals: domain aggregate separate from pagination.** List pages that show a filtered total amount (bills, payments) compute that sum on the backend over the full filtered set (same filters, no pagination) and return it as `totals: { amount }`, separate from `pagination`. Rationale: row count is a property of pagination (`pagination.total`); a domain amount aggregate is a page-specific fact and does not belong inside pagination metadata. A frontend sum over the received page is incorrect once the filtered set exceeds one page. Alternative considered: extending `pagination` with the sum (rejected — conflates pagination with domain data).

> **#122 — Ledger as a dedicated `features/ledger/` slice.** Balance, expected amount, and current debt computations live in their own feature slice, not inside `features/bills/` or `features/payments/` and not in `lib/`. Rationale: balance is a cross-domain concept — it arithmetically combines bills and payments and draws on tariffs and readings — and belongs to neither owning slice. A dedicated slice keeps domain boundaries honest and gives the pure, unit-testable computation core a clear home. Alternatives considered: placing it in one of the owning slices (rejected — blurs boundaries, forces cross-slice imports); placing it in `lib/` as a domain-agnostic utility (rejected — balance is domain logic, not a generic helper).

> **#123 — Sharing as a dedicated `features/sharing/` slice.** Access management logic — the `property_access` member-list query, Zod schemas, the four Server Actions (`inviteToProperty`, `removePropertyAccess`, `changePropertyRole`, `leaveProperty`), and the active-owner-count helper — lives in a dedicated `features/sharing/` slice, not inside `features/properties/`. The code was first implemented inside `features/properties/` and extracted before Step 3a landed.
>
> Alternatives considered: keeping it in `features/properties/` (where it was first prototyped).
>
> Rationale: access management is a self-contained feature with its own invariants (last-owner protection, role change constraints) and is expected to grow in v2 (accept/decline flow, email invitations, pending state). Drawing the slice boundary while the code is small is cheaper than after it spreads. Mirrors the ledger reasoning (#122): cohesive feature logic gets its own slice.
> Note the intentional asymmetry with ledger worth recording: ledger was extracted because it is _cross-domain_ (combines bills + payments + tariffs + readings); sharing was extracted despite being _single-domain_ (`property_access` only), on growth-anticipation grounds. Both extractions are correct, but for different reasons.
>
> Dependency direction: `features/sharing/` imports `requirePropertyRole` and `propertyByIdForUser` from the properties access helpers. This direction — sharing depends on properties, not vice versa — is correct and expected; it is not a circular boundary smell.

> **#124 — i18n error-code surfacing pattern: two-tier namespace within the feature namespace.** Sharing was the first feature to surface server-side error codes in the UI, establishing the standard used by all subsequent features.
>
> **The pattern as implemented in Step 3b:**
>
> All translations for a feature live under a single next-intl namespace (e.g. `sharing`, called via `useTranslations("sharing")`). Error messages are split into two tiers by display context:
>
> - **Feature-level errors** (`sharing.errors.CODE`): codes that surface as sonner toast notifications and are not specific to a single form field. The i18n key name matches the server error code verbatim in SCREAMING_SNAKE_CASE (e.g. `sharing.errors.OWNER_PROTECTED`, `sharing.errors.LAST_OWNER`). The component reads `result.error.message` directly and calls `t("errors.OWNER_PROTECTED")`.
> - **Component-level errors** (`sharing.<componentName>.errors.camelCaseName`): codes that surface as inline validation messages inside a specific component. Keys are camelCase descriptors, not the raw server code (e.g. `sharing.inviteModal.errors.userNotFound`, `sharing.inviteModal.errors.alreadyHasAccess`). The component maps the raw code to the key in a local `if/else if` chain and stores the resolved string in component state for inline rendering.
>
> The choice between tiers is driven by display location: toast → feature-level, inline field error → component-level. A catch-all `generic` key handles unknown codes in both tiers.
>
> Alternatives considered: none were formally weighed — the pattern was established ad hoc during Step 3b implementation and is now ratified as the project standard for all features that surface server error codes.

> **#125 — Settings preferences persistence: session-carried DB value with cookie priority.** Locale and theme follow the model: DB (`users.locale` / `users.theme`) is the durable preference, the cookie is the SSR/anonymous carrier, and both the Settings page and the header controls write to DB and cookie together. The non-obvious part is how the stored DB value reaches a request. Rather than writing the cookie from the DB at login — which is awkward because cookies cannot be written from Server Components or Auth.js callbacks, only from Server Actions, Route Handlers, or middleware — the `callbacks.session` callback projects `users.locale` / `users.theme` into the session on every request. Resolution order is `cookie → session → default` (in `i18n/request.ts` for locale, and in the root layout's server-side theme resolution feeding an inline `<head>` sync script that prevents FOUC).
>
> **Consciously accepted consequence — partial cross-device sync.** Because the cookie has priority over the session-carried DB value, a preference changed on one device does not propagate to another device that already holds an older cookie: the stale cookie wins until it is overwritten. Cross-device sync therefore works only toward a device that has no cookie yet. This is accepted for MVP — theme and language are changed rarely and almost always on a single device — and is logged as v2 tech debt rather than fixed now.
>
> Alternatives considered: (a) hydrating the cookie from the DB at login via a Route Handler or middleware step — rejected as more moving parts and Edge Runtime constraints for no MVP-meaningful gain; (b) flipping the resolution order to `session → cookie` so the DB value wins for logged-in users (cookie leading only for anonymous) — the correct fix if/when full cross-device sync is wanted in v2, recorded here so the lever is known.
> **#126 — Russian locale is opt-in, hidden by default.** A `users` flag (default off) controls whether `ru` appears in the language list; `en` and `uk` are always shown. The user's currently active language is always listed regardless of the flag, so enabling/disabling `ru` can never lock a user out of the language they are on. The available-locale list is built in one place (`getAvailableLocales`), consumed by both the header switcher and the Settings select. Public surface is unaffected (landing is English-only). Rationale: the project is built in Ukraine — Russian stays available for those who need it (the author's family) but is not presented by default. A generalised per-language visibility system was rejected as YAGNI; this is a single intentional flag for `ru`.

> **#127 — `users.lastLoginAt` added to back the admin "Last login" column.** The admin Users oversight screen lists Last login, but no source existed (`users` had no such field; sessions are hard-deleted on expiry and don't cover inactive users). Added a nullable `lastLoginAt`, written in the existing sign-in callback alongside `systemRole` (#116), on sign-in events only (not on session refresh — it is last login, not last activity). Alternatives considered: deriving from the most recent session (rejected — unreliable for inactive users, sessions expire and are deleted); dropping the column for MVP (rejected — the field is genuinely useful for a users-oversight view and is near-free given the existing callback). Cost is one nullable column and one extra field on an update that already runs.

> **#128 — admin restore cascade is scoped by the soft-delete event timestamp.** Soft-deleting a property stamps the property and every cascaded child row with one shared `deletedAt`. Restore un-deletes exactly the rows whose `deletedAt` equals the property's `deletedAt` — and only those. Rows soft-deleted independently _before_ the property cascade (an earlier `deletedAt`) stay deleted; restore must not resurrect them. Alternatives considered: blanket "un-delete everything currently deleted under this property" (rejected — resurrects independently-deleted children, discards user intent); a dedicated cascade/batch-id column (rejected — extra schema for a problem the shared timestamp already solves at this scale).
> **#129 — admin restore / hard-delete modals reconciled to the #117 confirmation pattern.** The scaffold built them as intercepting-route (`@modal` slot) modals; #117 classifies destructive confirmations as local `<ConfirmDialog>` driven by `useState`, because a refresh should cancel a destructive confirm and these have no shareable identity. Converted to `<ConfirmDialog>`, reusing the existing dialog content components; state lifted into a feature-level context (`createSafeContext`) where triggered from table row actions. Intercepting-route scaffolding for these two removed. Correction in the spirit of #114.

> **#130 — admin dashboard "recent activity" derived from `createdAt`, not an event table.**
> The dashboard's recent-activity feed has no backing audit/event table (consciously, per #25).
> For MVP it is derived: the 20 most recent `createdAt` events across the core domain entities
> (property, service, bill, payment, reading, user), newest first, rendered as localized
> one-liners, display-only (no drill-down). Deletions and edits are excluded — deletions would
> flood the feed via the soft-delete cascade (#128) and are already surfaced by the soft-deleted
> stat and the Properties oversight list; `updatedAt` edits are uninformative without a diff we
> don't store. Plumbing entities (contracts, tariffs, providers, account/payment details) are
> excluded as low-signal. Alternatives: a real event/audit table (rejected — scope creep against
> #25); leaving the feed mocked (rejected — cheap to derive and makes the dashboard real). Scale
> note: at MVP volume the union + sort is trivial; a `createdAt` index per source table is the
> lever if data grows, not MVP work.

> **#131 — admin dashboard "soft-deleted" stat counts soft-deleted properties only, not all `deletedAt` rows.** Summing every `deletedAt`-bearing table is inflated and misleading: the soft-delete cascade (#128) stamps one shared `deletedAt` across a property and all its descendants, so a single property deletion would add the whole subtree to the count (100+ rows for one deletion), conflating "one property deleted" with "N rows deleted." The admin's only soft-delete management surface is property-level (restore / hard-delete, Step 2), so the actionable, non-inflated unit is the property. The stat counts soft-deleted properties; the card is relabeled to name that unit ("Deleted properties"). Alternatives considered: sum all `deletedAt` tables (rejected — cascade-inflated, conflates one deletion with hundreds of rows, counts rows the admin cannot manage); count a curated subset of top-level entities (rejected — still cascade-inflated via the property cascade, and no admin surface manages them in MVP). Corrects the original Step 3a spec, which had said "sum across every table carrying a `deletedAt`."

> **#132 — Landing CMS schema realized as five singleton-row tables (closes deferred #60, realizes #97).** The Phase-6.5 CMS data model was deferred; the admin CMS UI shipped on in-memory state with no tables. Built the five tables (`home_hero`, `about_hero`, `project_hero`, `features`, `links`) as single-row, fixed-column records matching the fixed landing layout — field set derived from the scaffold's `INITIAL_*` forms (authoritative) and cross-checked against the `UI_ARCHITECTURE` breakdown. Two conscious convention exceptions: (a) **no `deletedAt`** — these are singleton configuration, not lifecycle data, like `service_types` and the auth tables; (b) **no locale dimension** — landing content is English-only in MVP (#88). Singleton-ness is enforced at the DB level via a `oneRow boolean NOT NULL DEFAULT true` lock column with `UNIQUE` + `CHECK (oneRow = true)`. Delivered via migration `0016` (create + idempotent baseline seed of the current scaffold content), per #118. Alternatives (key-value store, JSON-per-page blob) were already rejected at #97; this is its realization, not a re-open.

> **#133 — public landing reads CMS via unguarded slice readers; visibility flags honored; status/works-with as plain multiline; flag caching resolved to path-based revalidation.** The public pages were wired to the CMS tables through named unguarded read wrappers in `features/landing-cms` (reusing the `_query*` helpers, no `requireAdmin`), replacing i18n/hardcoded content for CMS-editable fields only (chrome, stack chips, and schema tree stay non-CMS). The four `links` visibility flags now drive nav-link presence (`*NavVisible`) and direct-URL access (`*UrlAccessible` false → `notFound()`, #108), as independent flags. Multiline CMS fields (`worksWith`, `status`) render as plain paragraphs (no rich text; post-MVP per #99). Caching: rely on the existing `revalidatePath` from the CMS save actions (#4b) — path-based, closing the open "landing visibility flag cache" question; `unstable_cache`+`revalidateTag` noted as the only-if-needed alternative. SEO metadata and the demo entry points are deliberately out of this step (L2 and the Demo step respectively).

> **#134 — public SEO: per-page metadata derived from CMS via cached reads; sitemap honors visibility flags; robots is minimal.**
> Each public page (`/`, `/about`, `/project`) exports `generateMetadata` sourcing `title` and `description` from the existing CMS hero fields — no new SEO-specific columns. The four public readers (`getPublicHome`, `getPublicAbout`, `getPublicProject`, `getPublicLinks`) are wrapped in React `cache()` so `generateMetadata` and the page body share a single DB round-trip per request (Drizzle reads are not request-deduped automatically via `fetch`; `cache()` is what does it). The root layout sets a `"%s · Utility Bills CRM"` title template and a `metadataBase` from `NEXT_PUBLIC_SITE_URL` with `http://localhost:3000` fallback — the production domain is never hardcoded. The home page uses `title: { absolute: ... }` to bypass the template. Open Graph and Twitter tags are text-only; OG image and JSON-LD/structured data are post-MVP. `sitemap.ts` always includes `/`; `/about` and `/project` are included only when `links.aboutUrlAccessible` / `links.projectUrlAccessible` are not false — pages that `notFound()` must not appear in the sitemap. `robots.txt` has no `Disallow` list: private app routes are already kept out of search by auth + 404; enumerating them would only leak path structure, which undercuts #62 (obscure admin prefix) and #108 (404 hides existence). If `noindex` is needed on specific auth pages, it is set via `robots` metadata on those pages, never in `robots.txt`.

> **#135 — landing CMS presentation fields support a minimal inline-markup subset (bold + code), and the seeded stub content is replaced with the real copy.** Moving landing copy to plain-text CMS fields dropped the bold lead-ins (#3) and inline `code` (#4) the hardcoded content had, and the rows held placeholder stubs. Fixed with the minimum that achieves parity: a render-time parser supporting exactly `**bold**` → `<strong>` and `` `code` `` → `<code>`, everything else escaped. Storage stays plain text; no editor, block elements, links, italic, or raw HTML — full rich-text/WYSIWYG remains post-MVP (#99). Scope limited to landing CMS presentation fields; entity `notes` stay plain text per 3.20. The real landing copy (recovered from the pre-L1 i18n strings, with `<strong>`/`<code>` translated to markers) is written into the singleton rows by a one-time content-population migration, replacing the stubs; `0016` is not edited. Personal `links` URLs are left as placeholders for the owner to set via the CMS (Code can't know them).

> **#136 — demo sign-in via a session-creating route handler, not a Credentials provider.** A visitor becomes the demo user through `/auth/demo`, a route handler that find-or-creates the persistent demo user, creates a database session row, sets the Auth.js session cookie, and redirects to `/dashboard`. A Credentials provider was rejected because it forces the JWT session strategy, which conflicts with the project's database sessions (#6). The route handler creates a session exactly as the adapter does on an OAuth callback, so the rest of the app reads it normally via `auth()`. One persistent demo user backs many concurrent visitor sessions (each gets its own session row pointing at the same user); shared data is safe because mutations are blocked in demo mode (D3).

> **#137 — `isDemo` boolean on `users` table marks demo accounts; demo data excluded from admin activity feed; Demo badge shown in admin UI.**
> `users.isDemo` (migration `0019`, default `false`) is the single marker for all demo-related filtering. The `seed:demo` script sets it when upserting demo users; `/auth/demo` sets it on every find-or-create so the flag survives accounts created before the migration. Admin activity feed excludes demo data with a `notInArray(properties.id, demoPropertyIds)` subquery across all six UNION ALL branches and a direct `eq(users.isDemo, false)` guard on the users branch. Admin users and properties list/detail pages show a blue "Demo" badge alongside the existing Deleted badge.
>
> **#138 — demo dataset shape: 3 properties, 24 months of seasonal data, temporal contract history, three ledger states.**
> The `seed:demo` script produces a dataset sufficient to showcase the full app architecture: **Квартира** (apartment, 7 services including 2-zone electricity, internet provider change at month 12); **Будинок** (house, 5 services, strong winter gas peak); **Дача** (cottage, seasonal electricity only). Consumption is generated from per-service seasonal factor arrays × YoY drift (4%/year). Temporal complexity: tariff change within one contract (apartment electricity, house gas), provider change = two separate contracts (apartment internet). Ledger states: apartment electricity has 22/24 payments (debt in last 2 months), house gas has an extra 2500 UAH advance at month 6 (overpayment), all other services are balanced. Sharing: family user is an editor on the apartment. Total data: ~290 bills, ~289 payments, 192 readings.
>
> **#139 — `seed:demo` script: self-contained data-definition module, idempotent reseed via wipe-then-rebuild inside a single transaction.**
> The script at `lib/db/seeds/demo.seed.ts` creates its own pool+db connection (module-level, so the `TTx` type can be derived from `typeof db`) and wraps all work in a single transaction. Idempotency: (1) find all `isDemo` users → find their owned properties → delete properties (FK cascade removes all children: services, contracts, tariffs, meters, readings, bills, payments, property_access) → delete providers; (2) upsert users by email; (3) rebuild full graph. Non-demo data is never touched. Running `npm run seed:demo` twice yields identical row counts. Rejected alternative: query-and-skip (patchy, error-prone on schema changes); wipe-and-rebuild is the correct baseline for a deterministic fixture.
>
> **#140 — Demo enforcement: `DemoModeError` returned as `Result`, `isDemo` projected into session, `requireMutableUser` guard at Server Action boundary.**
> All 14 mutating Server Action files use a shared `requireMutableUser()` guard (`lib/auth/guards.ts`) that returns `err(new DemoModeError())` for demo users. `DemoModeError extends DomainError` with `name = "DEMO_MODE_BLOCKED"` — discriminated the same way as `NotFoundError`/`ForbiddenError` via `error.name`. `isDemo` is projected into the Auth.js session in `callbacks.session` (same pattern as `locale`, `theme`, `ruLocaleEnabled`) so actions pay zero extra DB round-trips. The guard throws (not returns) on unauthenticated — that path is a bug caught by middleware, not a user-facing condition. Rejected: throw instead of return (breaks the frontend Result-interception pattern in D3b); middleware-level block (too coarse, bypasses the Result contract).
>
> **#141 — 13 local `requireAuth` helpers replaced by shared `requireMutableUser` in `lib/auth/guards.ts`.**
> Every mutating action file contained an identical local `requireAuth` function. Consolidated into one shared guard that adds demo enforcement as a first-class concern. `features/profile/actions.ts` had an inline auth check (no named helper) — migrated to the same pattern. Rejected: keep per-file helpers (perpetuates duplication and requires 13 touch-points for any future auth policy change); middleware only (can't return a typed Result to the calling action).
>
> **#142 — Demo theme/locale = cookie-only (DB write skipped); `setRuLocaleEnabled` = full block.**
> `setTheme` and `setLocale` write the preference cookie (so the UI reflects the change immediately) but skip the `db.update` when `session.user.isDemo` is true. This preserves the presentational demo experience without persisting state to a shared demo account. `setRuLocaleEnabled` is a settings action (not presentational) — it uses `requireMutableUser` and returns `err(DemoModeError)` like all other mutations. Rejected: no carve-out for all three (theme/locale changes would silently fail to apply during the demo); cookie-only for all three (locale enable/disable has no cookie, only DB state).
>
> **#143 — Demo-blocked feedback: info toast (not modal), single shared i18n key, persistent banner.**
> Overrides #96 (which proposed a friendly frontend modal): a toast avoids modal-over-modal stacking and requires less code. Toast type is `info` not `error` — the demo user is exploring, not encountering a failure; the modal is intentionally left open. All 9 mutating form hooks share a single `useActionErrorHandler` hook (`lib/hooks/use-action-error-handler.ts`) that intercepts `DemoModeError` and shows `common.demoBlocked`. This is a deliberate deviation from the per-feature #124 i18n norm: the error class is global (same guard, same `DemoModeError`) so it belongs in a shared namespace. A `DemoBanner` component in the app shell (`app/(app)/layout.tsx`) shows the demo context on every page while signed in as the demo user; it is always visible and not dismissible.

> **#144 — All demo CTAs (`/`, `/auth/login`, `/project`) route to `/auth/demo`; the dead `liveDemoUrl` field is removed end to end.**
> The three public entry points to the demo all navigate to the internal `/auth/demo` route handler, which creates a session and redirects to `/dashboard` (Decision #136). The `/` home hero gained a "Try demo →" CTA (previously had none). The `/project` links section now always shows a "Live demo" card pointing to `/auth/demo` — previously conditional on a CMS-managed external URL. The `liveDemoUrl` field (`links` table column, `globalSchema`, admin Global tab input, `INITIAL_GLOBAL` constant, public `LinksSection` prop, and related tests) is removed in full; migration `0020` drops the column. There is no external demo URL — the app is the demo.

> **#145 — "Payment deadline approaching" alert not implemented in MVP.**
> No due-date is stored for any bill or service. Approximating one (e.g., a fixed calendar day) would duplicate the outstanding-debt signal already present in the attention block. The readings signal in the attention block is binary: "reading for {month} not yet submitted" — a binary present/absent check, not a date-based countdown. Payment deadline countdown is deferred to a future stage when payment due dates are a first-class data field.

> **#146 — Monthly expense aggregation extends `features/ledger/`; a separate dashboard-specific query layer was rejected.**
> The query groups bills by service type and month, which is a pure financial aggregation — the same responsibility as `balancesForProperties` and `balancesForServices` already in the ledger slice. Alternatives: a standalone `features/dashboard/` query module (wrong — dashboard owns no entity; it composes from other slices) or inlining inside `features/bills/` (wrong — bills does not aggregate cross-service views). Ledger extension is the correct home.

> **#147 — Dashboard charts standardised on Recharts via `chart.tsx`; hand-rolled SVG bar/pie/line removed.**
> The three prior SVG chart components were ad-hoc implementations with hardcoded dimensions, no accessible tooltips, and no connection to the design system's color tokens. Recharts with the existing shadcn `chart.tsx` wrapper provides `ChartContainer` (CSS token injection), `ChartTooltip`, `ChartLegend`, and responsive sizing out of the box. The alternative (keeping and iterating on the SVG approach) was rejected: the SVG components carried significant layout and tooltip complexity with no reusability benefit.

> **#148 — Drill-down targets bills list's real nuqs params (`services` semicolon array, `dateFrom`/`dateTo`); bar stack range is that single month.**
> Dashboard chart params intentionally share the same URL param names as the bills list (`dateFrom`, `dateTo`, `propertyId`, `services` with semicolon encoding) so that drill-down URLs are just bills-list URLs with pre-filled filters — no extra mapping layer. Pie segment click sets `services=[code]` over the full dashboard date range. Bar segment click sets `services=[code]` with `dateFrom=first-of-month` and `dateTo=last-of-month` for the clicked month. Line chart tooltip-only; no drill-down (no single-month semantics apply to a trend view).

> **#149 — Production DB driver strategy: `node-postgres` Pool against Neon's pooled endpoint; migrations against the direct endpoint; deferred serverless path is `neon-serverless` (WebSocket), not `neon-http`.**
> The production runtime keeps the existing `node-postgres` `Pool` (`lib/db/client.ts`), pointed at Neon's **pooled** connection endpoint (PgBouncer) via `DATABASE_URL`. Migrations (`db:migrate`) run against Neon's **direct** (unpooled) endpoint, since DDL and the migration session don't go through the transaction pooler. If connection pressure on serverless ever warrants it, the deferred upgrade is `drizzle-orm/neon-serverless` (the WebSocket `Pool` from `@neondatabase/serverless`), which preserves interactive transactions. `neon-http` (`drizzle-orm/neon-http`) is rejected as the upgrade path: it has no interactive transaction support, and Server Actions and `seed:demo` compose Drizzle `tx`. No runtime change ships now — this records the chosen direction. The Node runtime is pinned to the 22 LTS line (`engines.node`, `.nvmrc`) to keep local and Vercel builds aligned.

> **#150 — Beyond v1 direction: OCR cut, working order set, Telegram reframed.**
> Three direction-level decisions for post-MVP work. **(1) OCR permanently cut** — OCR on scanned/photographed bills is removed from the project entirely, not deferred or roadmapped: near-zero value for low-volume monthly manual entry across two properties, high cost (per-provider layout parsing, an external model, error correction), and a weak portfolio signal (mostly glue around a third-party API). **(2) Working order fixed** — the actual Beyond-v1 build sequence is **Telegram notifications → Google Drive file storage → remaining roadmap items**, distinct from the categorized v2/v3/v4 menu. **(3) Telegram reframed** — from signal/deadline-driven alerts (reading-deadline, payment-deadline, debt) to **user-authored monthly recurring self-reminders**: the user creates reminders per service (anchor = a specific day of the month or N days before month-end, plus required text), delivered as a single daily Telegram digest. The system is a dumb scheduler that computes no signals; this **removes the feature's dependency on Decision #145** (the dashboard "payment deadline approaching" signal stays deferred and is unrelated). The detailed Telegram design (entity shape, anchors, delivery, linking, gating) is logged stage-by-stage when the feature is actually built.

> **#151 — Integration tests share the dev/demo database; side-effecting tests must be mocked or scoped.** There is no isolated test DB — the test setup loads `.env.local`, so tests hit the same Postgres as `npm run dev`. Two consequences: `npm test` re-seeds demo data (the seed is wipe-and-rebuild, #139), so demo content "drifts" after a run — re-seeding, not corruption; and a test must never run a side-effecting pipeline against it (a cron test that did was fixed by mocking the pipeline, lesson 0008). The seed has no environment guard: only the URL pointing at localhost protects prod. A dedicated test DB plus a fail-closed seed guard are a deferred task; until then run targeted files, not the full suite.

> **#152 — Telegram linking: two tables separated by lifetime, fail-closed webhook, per-user delivery channel.** Realizes #150's linking stage. A bot cannot message first, so linking is user-initiated: a one-time token and deep-link, with a webhook binding the sender's chat id. Durable channels and transient tokens are separate tables because their lifetimes differ; both hard-delete — operational data with no audit value (the sessions precedent, not the soft-delete norm). The webhook is fail-closed on a shared secret, and anything else is acknowledged without binding so Telegram does not retry. Binding logic stays out of the `"use server"` module, which would expose it as a public RPC endpoint. Delivery resolves a user's channel before claiming, so a channel-less user is skipped without a phantom claim.

> **#153 — Migrations auto-apply on production deploy via a build-time step; additive-only is a project rule.** Closes the manual-migration gap that broke prod once (lesson 0010). The Vercel build migrates before building, gated to production, against the direct (unpooled) endpoint; failure aborts the build so the previous deployment stays live. Chosen over a GitHub Action for correct ordering with no new infrastructure — a decoupled migrate-then-deploy pipeline is the upgrade path if CI arrives; a naive Action racing Vercel's git deploy was rejected outright. **Additive-only:** during build→promote the old code briefly serves the new schema, so destructive or narrowing changes must use expand/contract across deploys. Preview deploys share the prod DB (accepted: solo dev, login unavailable on preview URLs) — which is why the migrate gate is production-only.

> **#156 — Metered tariff zones unified on one canonical vocabulary; rate-zone count derived from the meter; contiguity enforced at the DB.** The same concept rendered across ~16 surfaces with conflicting labels and semantics, so input forms contradicted read surfaces for the same meter; separately, a hardcoded three-or-one rate-field count made two zones unreachable. Resolved with one count-aware vocabulary in a single cross-cutting source (the strings live in code, not a tracker doc), one shared controlled rate input used by both forms, and a zone-count rule derived from the service's meter. **Count source stays context-local:** historical tariff reads count zones from their own rates, because deriving labels from the current meter would mislabel history across meter replacements. A DB check makes zone shape an invariant rather than a convention.

> **#157 — Bill and Payment get real read-view pages; detail is page-only; "view" is an explicit action; no per-record payment status.** Before this, payment detail redirected to the edit form and bill detail did not exist — notes and periods were unreadable and viewers were sent to an edit page. **(1) Page-only detail**, no intercepted detail modal; editing from detail is intercepted as a modal by the existing slot, so no new route is needed. **(2) Header actions are role-gated on the server** and passed down as a boolean, because the role helper lives in the DB-heavy access module and must not enter a client bundle (lesson 0009). **(3) Row-click navigation rejected** — a clickable row is not a real link (no keyboard focus, no Cmd/middle-click, breaks text selection) and would push navigation into the shared, domain-agnostic data-table; row menus gain an explicit View item instead. **(4) No per-record paid/unpaid status** and no bill↔payment linkage: payment status is aggregate at service level, where balance is defined.

> **#158 — Public landing made a statically prerendered, CDN-cached shell** (two per-surface root layouts, client-side auth islands, static English public shell). **REVERTED IN FULL — see #159.** Recorded, not deleted, so the approach is not re-attempted: the problem it solved was misdiagnosed.

> **#159 — #158 reverted in full: the anonymous DB traffic was misdiagnosed.** The queries came from the landing CMS reads — wrapped in React `cache()`, which dedupes within a request but not across requests — not from the session: under database sessions (#6) an anonymous request queries nothing. #158's own verification recorded this and the conclusion was not drawn, so the static split bought TTFB, not zero-DB. Its cost compounded: two roots forced client auth islands, which flashed the header for signed-in visitors, which forced a full-document sign-out to hide the flash.
> **Kept:** the sitemap revalidation in `saveGlobalCms` — the sitemap prerenders and gates pages on the CMS visibility flags (#134), so it was the one surface with a real cache to invalidate. **Dropped:** the `FatalError` / `NotFoundContent` extractions, each single-consumer once the dual root is gone.
> **Corrects #133:** `revalidatePath` on a dynamic page is inert — the landing cache it claimed to resolve never existed.
> **Next (own task):** cache the CMS reads (`unstable_cache` + `revalidateTag`), single root untouched. `"use cache"` is the documented successor but needs app-wide `cacheComponents`, which changes rendering and navigation across the CRM — a deliberate migration, not a side effect of a landing fix.
> **Tech debt:** `error.tsx` and `global-error.tsx` duplicate the fatal-error block (pre-existing). Lesson `0024`.

## Open Questions

Carried forward to Phase 7 (implementation) and beyond.

**For Phase 7 (implementation):**

- Test database strategy: dedicated Neon branch vs. in-memory alternatives.
- Translation workflow: author, wife, AI-assisted, review process.
- ~~Error code catalog structure in i18n files.~~ Resolved by Decision #124.
- Cron job for expired session cleanup (timing, location).
- ~~Seed script for `service_types` catalog and landing CMS baseline content.~~ Resolved: catalog in migration (#118); CMS baseline in migration `0016` (#132); landing copy in migration `0017` (#135).
- ~~Demo account seed: one-time deployment pipeline, idempotent re-seed procedure.~~ Resolved: `seed:demo` script, wipe-then-rebuild inside a transaction, scoped to `isDemo` users (Decision #139).
- Exclusion constraint specifics with `btree_gist` extension — concrete SQL for all temporal entities.
- Indexing strategy for common dashboard queries (balance computation, monthly aggregation).
- ~~Sentry integration: deferred within Phase 7 — timing and error policy TBD when integration begins.~~ Resolved: instrumentation-based Sentry with PII scrubbing and a correlation-id tag (Decision #154).

**For future versions (v2+):**

- `gas_delivery` transition to metered: when legislation changes, execute manual admin migration per Approach A. May require creating Meter entities for services that previously had none.
- `payment_details` possibly needing structured fields (IBAN, bank, recipient) in v4+ for QR/integration use cases.
- Landing content multi-language support (currently English-only).
- Recorded video demo as alternative to live demo.
- Public integration API extraction if mobile app or third-party integrations are planned.

## Roadmap

### v1 (MVP) — Complete, deployed to production

- Public landing page (SEO, portfolio showcase)
- Authenticated CRM with full domain
- Google OAuth
- Multi-user sharing with roles and invite flow
- Admin section with property oversight, recovery, hard delete, and landing CMS
- Multi-language (en/uk/ru), light/dark theme

See earlier sections for details. The next stage is onboarding the first real user — the only remaining MVP criterion ("real users in active use").

**Working order (Beyond v1).** The categorized v2/v3/v4 lists below are a menu, not the build sequence. The actual next sequence is: **Telegram notifications → Google Drive file storage → remaining items**.

### v2 — Extensions

- Email/password authentication alongside Google
- Telegram notifications — user-authored monthly recurring self-reminders, one per service (anchored to a specific day of the month or N days before month-end, plus a required text), delivered as a single daily digest. A dumb scheduler, not signal-driven; does not depend on Decision #145.
- Google Drive integration for bill photos and receipts

### v3 — Convenience and analytics

- Custom user-defined services
- Data export (CSV / Excel / PDF)
- Full-text search
- Device-level session management

### v4+ — Automation

- Email bill parsing
- Integrations with provider APIs
- Structured bill components for provider reconciliation

### Possibly someday

- Mobile service tracking (per family member)
- Multi-currency
- Other countries / localizations

## Getting Started

### Prerequisites

- Node.js 22 LTS
- npm
- A Neon PostgreSQL project (free tier)
- Google OAuth credentials
- Sentry project (optional for local development)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in:
#   DATABASE_URL=...             PostgreSQL connection string
#   AUTH_SECRET=...              openssl rand -base64 32
#   AUTH_GOOGLE_ID=...
#   AUTH_GOOGLE_SECRET=...
#   ADMIN_EMAILS=...             comma-separated, gets systemRole='admin' on first sign-in
#   SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN   optional locally (no DSN → SDK no-ops); set in prod
#   SENTRY_ORG / SENTRY_PROJECT / SENTRY_AUTH_TOKEN   prod source-map upload only (CI/Vercel secret)

# 3. Apply the database schema (migrations — same path in dev and prod)
#   npm run db:migrate           apply pending migrations
#   npm run db:generate          generate a new migration after a schema change

# 4. Start dev server
npm run dev
```

### Common commands

```bash
npm run dev           # start dev server
npm run build         # production build
npm run start         # run production build locally

npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run typecheck     # TypeScript check
npm run format        # Prettier write
npm run format:check  # Prettier check (used in CI)

npm run test          # Vitest
npm run test:ui       # Vitest UI

npm run db:generate   # generate Drizzle migration from schema changes
npm run db:migrate    # apply migrations
npm run db:studio     # Drizzle Studio
```

## Project Structure

> `features/` is the target home for domain logic (components + hooks + schema + types per domain). Currently `payments/` and `properties/` are migrated. Legacy layers (`components/feature/`, `lib/actions/`, `lib/validation/`) have been cleared.

```
app/
  (public)/             public landing pages (/, /about, /project)
    _components/        co-located page components
  (auth)/               login, error
  (app)/                authenticated CRM
    dashboard/
    properties/[id]/
      meters/[mid]/
      services/[sid]/
      sharing/
    bills/
    payments/
    meters/
    settings/
    _components/        co-located page components (per route)
    _data/              data-fetching helpers (per route)
  (admin)/art-admin/    admin-only section
    landing/
    properties/[id]/
    users/[id]/
    _components/
    _data/
  api/auth/             Auth.js route handler
components/
  ui/                   shadcn/ui components (Radix-based, locally owned)
  feature/              domain-agnostic reusable components
    data-table/         TanStack Table system with URL-synced filters, sorting, pagination
    properties/         property form and modal (→ will migrate to features/properties/)
  app-nav/              authenticated app navigation
  admin-nav/            admin section navigation
  ...                   shared primitives (modal, form-field, icon-badge, etc.)
features/               vertical feature slices — target for all domain logic
  payments/             components + hooks + schema + types
lib/
  actions/              server actions (→ will move into features/ slices)
  auth/                 Auth.js config and helpers
  constants/            shared constants (service colors, icons, routes)
  db/                   Drizzle schema, client, migrations
  format/               currency and date formatters
  hooks/                shared hooks
  locale/               next-intl helpers
  logger/               pino setup: redaction + correlation-id context (ALS)
  observability/        Sentry shared init options + event scrubbing
  routes.ts             centralized route configuration
  types/                shared TypeScript types
  utils/                shared utilities
  validation/           Zod schemas (→ will move into features/ slices)
messages/               i18n translation files (en, uk, ru)
db/                     database documentation and schema reference
docs/                   project documentation
```

## Development Workflow

### Branching

- `main` — protected, always deployable.
- Feature branches for all work, merged via PR.
- No direct commits to `main`.

### PR requirements

- CI passes (lint, typecheck, format, build).
- All conversations resolved.
- Branch up to date with `main` before merge.

### Commit style

- Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`).
- Keep commits focused and reviewable.

## Deployment

The application is deployed and live in production.

### Hosting

- **App:** Vercel — deploys automatically (push to a feature branch → preview deployment; merge to `main` → production deployment). Preview deployments currently **share the production database** — `DATABASE_URL` is scoped to Production + Preview and no Neon↔Vercel branch integration is installed. Per-preview isolated Neon branches are a future enhancement (#153).
- **Database:** Neon (serverless Postgres) for production.

### Database connection — pooled vs. direct

A single `DATABASE_URL` drives both the runtime and migrations — `lib/db/client.ts` and `drizzle.config.ts` read the same variable. The pooled-vs-direct distinction is operational (which connection string `DATABASE_URL` holds in each context), not two separate variables:

- The deployed app's `DATABASE_URL` points at Neon's **pooled** endpoint (PgBouncer), suited to serverless function connections.
- **Migrations** run against Neon's **direct** (unpooled) endpoint — DDL and the migration session do not go through the transaction pooler. The build-time migrator reads `MIGRATE_DATABASE_URL` (the direct endpoint), falling back to `DATABASE_URL`. When the runtime `DATABASE_URL` is the pooled endpoint, set `MIGRATE_DATABASE_URL` to the direct one in Vercel.

See Decision #149 for the driver strategy and the deferred `neon-serverless` upgrade path, and Decision #153 for build-time auto-migrate.

### Production environment variables

Set in the Vercel dashboard (names only):

- `DATABASE_URL` — Postgres connection string (pooled endpoint in production)
- `MIGRATE_DATABASE_URL` — direct (unpooled) endpoint for the build-time migrator; optional, falls back to `DATABASE_URL` (#153)
- `AUTH_SECRET` — Auth.js signing key
- `AUTH_URL` — canonical site URL; drives secure-cookie selection and the Google OAuth redirect (required in production)
- `NEXT_PUBLIC_SITE_URL` — public site URL for `metadataBase`, sitemap, and robots
- `ADMIN_EMAILS` — comma-separated emails promoted to `systemRole = 'admin'` on sign-in
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth credentials
- `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` — Sentry error-tracking DSN (server + browser); without them the SDK no-ops
- `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` — production source-map upload; the auth token is a build-time secret (#154)

### Schema and data in production

- **Schema:** production deploys **auto-apply pending migrations** during the Vercel build. `vercel.json` sets `buildCommand` to `npm run db:migrate:deploy && npm run build`; the migrator (`scripts/migrate-deploy.ts`) gates on `VERCEL_ENV === "production"` and runs against the **direct** endpoint (`MIGRATE_DATABASE_URL`, falling back to `DATABASE_URL`). A failed migration aborts the build, so the previous deployment stays live. Preview and local builds never migrate the prod DB. The `service_types` catalog and the landing CMS baseline content ship inside migrations, so they need no separate seed step. (`npm run db:migrate` remains the local/manual command — see Decision #153.)
- **Migration policy — additive-only by default (project rule):** between a migration applying and the new deployment being promoted, the **old code briefly serves against the new schema**. That is only safe for **additive, backward-compatible** changes: new tables, new nullable columns, new indexes. Destructive or narrowing changes (`DROP`, rename, adding `NOT NULL` to an existing column, type narrowing) must be split across deploys via **expand/contract**: (1) deploy code tolerant of both old and new schema, (2) apply the additive part, (3) deploy code that uses the new schema, (4) contract in a later migration. Auto-migrate makes additive migrations safe; this policy is what keeps destructive ones safe.
- **Demo data:** `npm run seed:demo` (optional, opt-in) populates the demo account's dataset against whatever `DATABASE_URL` resolves to.

## Contributing

This is a personal project. Not open to contributions at this time.

## License

Private. Not licensed for public use.
