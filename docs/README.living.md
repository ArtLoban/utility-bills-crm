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
| URL state         | nuqs                            |
| Date utilities    | date-fns                        |
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
| Error tracking    | Sentry (planned, not yet integrated)     |

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

### 2026-05 — Phase 7: Implementation

| #   | Decision                                                                                                               | Alternatives considered                                                                                         | Outcome                             |
| --- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 111 | URL state sync: nuqs                                                                                                   | useSearchParams + manual sync                                                                                   | nuqs                                |
| 112 | Date utilities: date-fns                                                                                               | dayjs, Intl API only                                                                                            | date-fns                            |
| 113 | Co-located page components: `_components/` convention per route                                                        | top-level `components/` for everything                                                                          | `_components/` per route            |
| 114 | @base-ui/react → Radix UI (tech debt correction)                                                                       | keep @base-ui despite known issues                                                                              | Radix (aligns with decision #7)     |
| 115 | Sentry integration: deferred within Phase 7                                                                            | integrate from scaffold                                                                                         | deferred                            |
| 116 | Admin auth: `ADMIN_EMAILS` env var, seeded on first sign-in                                                            | DB flag set manually; separate admin setup flow                                                                 | env-based seed                      |
| 117 | Modal implementation: hybrid — intercepting routes for entity modals, local `<ConfirmDialog>` for confirmations        | All via intercepting routes; all via Zustand store; all via local `useState`                                    | Hybrid                              |
| 118 | `service_types` catalog delivered via migration `INSERT`; no separate production-seed mechanism                        | Dedicated `seed:prod` script; one idempotent seed with env-gated dev part                                       | Catalog in migration                |
| 119 | Global `/providers` catalog page; provider management not limited to contract-form inline only                         | Provider management inline within the contract form only (no dedicated page)                                    | Dedicated `/providers` page         |
| 120 | List-page filtering, sorting, and pagination run on the backend; URL is the source of truth for query state            | Client-side data operations via TanStack Table row models                                                       | Backend-driven, URL-synced          |
| 121 | List-page filtered totals: domain aggregate separate from pagination                                                   | Extending `pagination` with the sum                                                                             | `totals: { amount }` separate       |
| 122 | Ledger as a dedicated `features/ledger/` slice                                                                         | Inside `features/bills/` or `features/payments/`; in `lib/` as utility                                          | Dedicated slice                     |
| 123 | Sharing as a dedicated `features/sharing/` slice                                                                       | Inside `features/properties/`                                                                                   | Dedicated slice                     |
| 124 | i18n error-code pattern: two-tier namespace within feature namespace                                                   | Flat error namespace; HTTP-status-based surfacing; ad hoc per component                                         | Two-tier feature namespace          |
| 125 | locale/theme persistence: DB durable value carried via session callback; resolution order `cookie → session → default` | hydrate cookie from DB at login (via middleware / route handler); DB-wins resolution order (`session → cookie`) | session-carried, cookie-priority    |
| 126 | Russian locale hidden by default; opt-in per user via Settings                                                         | keep all three locales equally visible; remove `ru` entirely                                                    | opt-in flag, hidden by default      |
| 127 | `users.lastLoginAt` added to back the admin "Last login" column                                                        | derive from most recent session (unreliable); drop the column for MVP                                           | nullable column, written on sign-in |

> **#122 — Ledger as a dedicated `features/ledger/` slice.** Balance, expected amount, and current debt computations live in their own feature slice, not inside `features/bills/` or `features/payments/` and not in `lib/`. Rationale: balance is a cross-domain concept — it arithmetically combines bills and payments and draws on tariffs and readings — and belongs to neither owning slice. A dedicated slice keeps domain boundaries honest and gives the pure, unit-testable computation core a clear home. Alternatives considered: placing it in one of the owning slices (rejected — blurs boundaries, forces cross-slice imports); placing it in `lib/` as a domain-agnostic utility (rejected — balance is domain logic, not a generic helper).

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

> **#127 — `users.lastLoginAt` added to back the admin "Last login" column.** The admin Users oversight screen lists Last login, but no source existed (`users` had no such field; sessions are hard-deleted on expiry and don't cover inactive users). Added a nullable `lastLoginAt`, written in the existing sign-in callback alongside `systemRole` (#116), on sign-in events only (not on session refresh — it is last login, not last activity). Alternatives considered: deriving from the most recent session (rejected — unreliable for inactive users, sessions expire and are deleted); dropping the column for MVP (rejected — the field is genuinely useful for a users-oversight view and is near-free given the existing callback). Cost is one nullable column and one extra field on an update that already runs.

> **#126 — Russian locale is opt-in, hidden by default.** A `users` flag (default off) controls whether `ru` appears in the language list; `en` and `uk` are always shown. The user's currently active language is always listed regardless of the flag, so enabling/disabling `ru` can never lock a user out of the language they are on. The available-locale list is built in one place (`getAvailableLocales`), consumed by both the header switcher and the Settings select. Public surface is unaffected (landing is English-only). Rationale: the project is built in Ukraine — Russian stays available for those who need it (the author's family) but is not presented by default. A generalised per-language visibility system was rejected as YAGNI; this is a single intentional flag for `ru`.

## Open Questions

Carried forward to Phase 7 (implementation) and beyond.

**For Phase 7 (implementation):**

- Test database strategy: dedicated Neon branch vs. in-memory alternatives.
- Translation workflow: author, wife, AI-assisted, review process.
- ~~Error code catalog structure in i18n files.~~ Resolved by Decision #124.
- Cron job for expired session cleanup (timing, location).
- Seed script for `service_types` catalog and landing CMS baseline content (CMS data model is implemented; seed content is pending).
- Demo account seed: one-time deployment pipeline, idempotent re-seed procedure.
- Exclusion constraint specifics with `btree_gist` extension — concrete SQL for all temporal entities.
- Indexing strategy for common dashboard queries (balance computation, monthly aggregation).
- Cache strategy for landing visibility flags (considered: `unstable_cache` in Next.js).
- Sentry integration: deferred within Phase 7 — timing and error policy TBD when integration begins.

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
#   DATABASE_URL=...             PostgreSQL connection string
#   AUTH_SECRET=...              openssl rand -base64 32
#   AUTH_GOOGLE_ID=...
#   AUTH_GOOGLE_SECRET=...
#   ADMIN_EMAILS=...             comma-separated, gets systemRole='admin' on first sign-in
#   SENTRY_DSN=...               optional, not yet integrated

# 3. Apply database schema
#   Dev (push directly):   npm run db:push
#   Prod (migrations):     npm run db:migrate

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
  logger/               pino setup with correlation IDs
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

### Deployment

- Push to feature branch → Vercel preview deployment with isolated Neon branch.
- Merge to `main` → production deployment.

## Contributing

This is a personal project. Not open to contributions at this time.

## License

Private. Not licensed for public use.
