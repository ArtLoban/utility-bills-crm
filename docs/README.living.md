# Utility Bills CRM

A multi-tenant web application for tracking utility bills across multiple properties. Built primarily as a senior-level engineering playground, with a real product target (my wife, replacing her paper notebook) and serving as a portfolio piece.

> This is a living document. It evolves with the project. Decisions are explained where they happen, deviations from plan are tracked, and open questions are held here until resolved.

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
13. [Contributing](#contributing)

---

## Project Background

Three goals in priority order:

1. **Grow as a frontend/architect-level engineer.** The project is primarily a practice ground. Every decision is made with senior-level rigor. The stack reflects practices I want to internalize, not the fastest path to features.
2. **Serve as a portfolio piece.** The project should look and work like a serious, shippable product — demonstrating skill breadth to potential employers.
3. **Deliver a useful product.** The first user is my wife, who currently tracks utility bills for two apartments by hand in a notebook. Real users keep scope honest and quality high.

Goal ordering matters. An earlier version of this README framed the MVP around "wife stops using the notebook" as the primary criterion. That framing was explicitly rejected mid-design because it led to under-scoping features that serve the learning and portfolio goals. The scope pivot is recorded in the [Decision Log](#decision-log).

## MVP Scope

MVP is defined as a **minimum viable portfolio piece** — a project that demonstrates senior/architect-level frontend engineering and is functional end-to-end.

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
- File storage (Google Drive integration)
- Telegram notifications
- Custom user-defined services
- Data export
- Search

## Application Structure

The application has **three distinct surfaces** with different access models:

- **Public** — SEO-indexed landing page and marketing pages, accessible without authentication. Doubles as the developer's portfolio.
- **Authenticated app** — the CRM itself, accessible to logged-in users.
- **Admin** — restricted to users with `systemRole === 'admin'`. Defense-in-depth via middleware + layout checks.

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
| Runtime   | Node.js (LTS)                             |
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
| Theming           | next-themes                     |
| i18n              | next-intl                       |

### Quality, testing, observability

| Layer             | Choice                                   |
| ----------------- | ---------------------------------------- |
| Testing runner    | Vitest                                   |
| Component testing | @testing-library/react + user-event      |
| Linting           | ESLint (Flat Config) + TypeScript ESLint |
| Formatting        | Prettier + prettier-plugin-tailwindcss   |
| Git hooks         | Husky + lint-staged                      |
| Logging           | pino (structured)                        |
| Error tracking    | Sentry                                   |

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

- **Structured logging with `pino`** — correlation-ID-tagged, ready for aggregation.
- **Correlation ID in middleware** — every request tagged, propagated through logs and Sentry.
- **Sentry** for unhandled errors — free tier is sufficient.
- **No metrics, no tracing in MVP** — added only if real need emerges.

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

| #   | Decision                                                              | Alternatives considered                                               | Outcome                      |
| --- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------- |
| 44  | Enum implementation: text + CHECK                                     | Native PostgreSQL ENUM types                                          | text + CHECK                 |
| 45  | Temporal interval type: two `timestamptz` columns                     | Single `tstzrange`; two `date` columns                                | Two `timestamptz`            |
| 46  | Numeric precision: rates `(12,4)`, amounts `(12,2)`, meter `(12,3)`   | Uniform precision across all numerics                                 | Per-purpose                  |
| 47  | Bill date semantics: `date` (calendar), not `timestamptz`             | `timestamptz` for periods                                             | `date`                       |
| 48  | Providers: per-user catalog, not global                               | Global catalog with admin moderation                                  | Per-user                     |
| 49  | `gas_delivery` as a distinct ServiceType                              | Merging with `gas`                                                    | Distinct type                |
| 50  | Future `measurementType` evolution (e.g., gas_delivery → metered)     | Change-type in place; new ServiceType; Contract-level measurementType | Change in place (Approach A) |
| 51  | `PropertyAccess` has own `id` PK                                      | Composite `(propertyId, userId)` PK                                   | Own `id`                     |
| 52  | `PropertyAccess` uniqueness via UNIQUE partial index                  | UNIQUE over composite key                                             | Partial UNIQUE               |
| 53  | `service_types` catalog is seeded, no UI management in MVP            | Admin UI for service types catalog                                    | Seeded only                  |
| 54  | Meter has separate `installedAt`/`removedAt` vs `validFrom`/`validTo` | Single validity pair for both physical and system                     | Separate pairs               |
| 55  | Reading monotonicity: UX warning, not DB constraint                   | DB-enforced non-decreasing                                            | UX warning only              |
| 56  | Multiple bills per period permitted                                   | UNIQUE/exclusion on `(serviceId, periodMonth)`                        | Multiple allowed             |
| 57  | Expected amount not stored; computed at query time                    | Materialized on bill                                                  | Computed                     |
| 58  | `payment_details` as plain text blob                                  | Structured fields (IBAN, bank, recipient)                             | Plain text                   |
| 59  | `createdBy` on user-generated entities (readings, bills, payments)    | Omitted in MVP                                                        | Tracked                      |
| 60  | Landing CMS data model: deferred to Phase 6.5                         | Designed alongside core schema                                        | Deferred                     |

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

## Open Questions

Carried forward to Phase 7 (implementation) and beyond.

**For Phase 7 (implementation):**

- Test database strategy: dedicated Neon branch vs. in-memory alternatives.
- Translation workflow: author, wife, AI-assisted, review process.
- Error code catalog structure in i18n files.
- Cron job for expired session cleanup (timing, location).
- Seed script for `service_types` catalog and landing CMS baseline content.
- Demo account seed: one-time deployment pipeline, idempotent re-seed procedure.
- Exclusion constraint specifics with `btree_gist` extension — concrete SQL for all temporal entities.
- Indexing strategy for common dashboard queries (balance computation, monthly aggregation).
- Cache strategy for landing visibility flags (considered: `unstable_cache` in Next.js).
- Sentry integration specifics: which errors to alert on vs. log silently.
- Loading skeleton implementation: CSS `animation-delay: 200ms` pattern concrete.

**For Claude Design (remaining visualizations):**

- Bills list empty states (both variants)
- Add Bill modal
- Service detail
- Meter detail + readings history
- Payments screens (can likely be inferred from Bills)
- Sharing tab + invite modal
- Settings page
- Admin screens (dashboard, properties, users, landing CMS) with amber accent
- Public landing pages (`/`, `/about`, `/project`)
- Login screen + error variant

**For future versions (v2+):**

- `gas_delivery` transition to metered: when legislation changes, execute manual admin migration per Approach A. May require creating Meter entities for services that previously had none.
- `payment_details` possibly needing structured fields (IBAN, bank, recipient) in v4+ for QR/integration use cases.
- Landing content multi-language support (currently English-only).
- Recorded video demo as alternative to live demo.
- Public integration API extraction if mobile app or third-party integrations are planned.

## Roadmap

### v1 (MVP) — Current scope

- Public landing page (SEO, portfolio showcase)
- Authenticated CRM with full domain
- Google OAuth
- Multi-user sharing with roles and invite flow
- Admin section with property oversight, recovery, hard delete, and landing CMS
- Multi-language (en/uk/ru), light/dark theme

See earlier sections for details.

### v2 — Extensions

- Email/password authentication alongside Google
- Google Drive integration for bill photos and receipts
- Telegram notifications for reading deadlines, payment deadlines, debts

### v3 — Convenience and analytics

- Custom user-defined services
- Data export (CSV / Excel / PDF)
- Full-text search
- Device-level session management

### v4+ — Automation

- Email bill parsing
- OCR for scanned bills
- Integrations with provider APIs
- Structured bill components for provider reconciliation

### Possibly someday

- Mobile service tracking (per family member)
- Multi-currency
- Other countries / localizations

## Getting Started

> Will be populated when the project is scaffolded.

### Prerequisites

- Node.js (LTS)
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
#   DATABASE_URL=...
#   AUTH_SECRET=...              (openssl rand -base64 32)
#   AUTH_GOOGLE_ID=...
#   AUTH_GOOGLE_SECRET=...
#   SENTRY_DSN=...               (optional locally)

# 3. Apply database schema
npm run db:push

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
npm run db:push       # push schema directly (dev only)
npm run db:studio     # Drizzle Studio
```

## Project Structure

> Will be documented once the initial scaffold is in place.

Rough plan:

```
app/
  (public)/             public landing, SEO pages
  (auth)/               login, logout
  (app)/                authenticated CRM
  (admin)/              admin-only section
  api/                  route handlers if needed
components/
  ui/                   shadcn/ui components (owned locally)
  feature/              feature-specific components
lib/
  db/                   Drizzle schema, client, queries
  auth/                 Auth.js config and helpers
  access/               access-control helpers (tenant isolation)
  i18n/                 next-intl config and messages
  errors/               domain error hierarchy
  logger/               pino setup
features/               vertical slices per domain area
  properties/
  services/
  readings/
  bills/
  payments/
  sharing/
  dashboard/
  admin/
  landing/
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

### Deployment

- Push to feature branch → Vercel preview deployment with isolated Neon branch.
- Merge to `main` → production deployment.

## Contributing

This is a personal project. Not open to contributions at this time.

## License

Private. Not licensed for public use.
