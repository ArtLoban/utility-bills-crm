# Utility Bills CRM — MVP Definition

> Final product definition document.
> Assembled from the outcomes of domain discovery, user research, product definition, architecture, data model, and UI design phases.
> The source of truth for what we are building in v1.

---

## 1. About the product

A web application for tracking and managing utility bills across multiple properties — apartments, houses, summer homes. Users log meter readings, record bills and payments, and see balances, debts, and consumption analytics over time.

**Not a commercial product.** A personal application for the author's family and close circle. Simultaneously — a growth playground for reaching senior/architect-level frontend engineering, and a portfolio piece for demonstrating skill breadth to potential employers.

### Project goals (in priority order)

1. **Grow as a frontend/architect-level engineer.** The project is primarily a practice ground. Every decision is made with senior-level rigor. The stack and architecture reflect practices to internalize, not the fastest path to features.
2. **Serve as a portfolio piece.** The project must look and work like a serious, shippable product — useful for demonstrating skill breadth to potential employers.
3. **Deliver a useful product.** The first real user is the author's wife, who currently tracks bills for two apartments by hand. Real users keep scope honest and quality high.

### Historical note: scope pivot mid-design

An earlier framing of this MVP was "wife stops using the paper notebook" — a minimum product that replaces manual tracking. This framing was **explicitly rejected mid-design** because it was systematically under-scoping features that serve the learning and portfolio goals.

Examples of what the old framing pushed out of MVP unnecessarily: multi-user sharing, admin section, public landing page. Re-ordering priorities (growth → portfolio → product) resolved this tension and produced the coherent scope documented below.

The full record of the pivot is in `README.living.md` → Decision Log, under "Scope pivot: from product-first to portfolio-first."

---

## 2. MVP readiness criterion

**"A project that demonstrates senior/architect-level frontend engineering and is fully functional end-to-end, with real users in active use."**

This criterion unifies the three goals. A piece of work is in MVP if and only if it serves at least one of:
- A senior-level engineering practice that the author is internalizing.
- A portfolio signal that communicates skill to an informed reviewer.
- A capability that an actual user needs to use the system for its stated purpose.

Everything that does not serve any of these three goes to the roadmap.

---

## 3. What is in the MVP

### 3.1. Application surfaces

The application has **four distinct surfaces** with different access models:

- **Public** — SEO-indexed landing page and marketing pages, accessible without authentication. Doubles as the developer's portfolio.
- **Authenticated app** — the CRM itself, accessible to any signed-in user.
- **Admin** — restricted to users with `systemRole === 'admin'`. Defense-in-depth via middleware and layout checks.
- **Auth** — sign-in, sign-out, error pages.

All four are live in v1 and share a common design system.

### 3.2. Users and multi-tenancy

The system is **multi-user from day one**. Any user can sign up with a Google account, create properties, and invite others to collaborate.

**Two orthogonal role dimensions:**

- `users.systemRole`: `'user' | 'admin'` — application-level privilege. Admins access the admin section and bypass normal tenant filters in dedicated admin views.
- `propertyAccess.propertyRole`: `'owner' | 'editor' | 'viewer'` — per-property role granted to a user.

**Rules:**
- A property can have multiple users with any combination of roles (multi-owner supported for family scenarios).
- Only owners can invite users or change roles.
- Owners can remove editors and viewers, but cannot remove other owners (soft protection for family setups).
- Each property must have at least one owner at all times.
- Users can always remove themselves from a property.

The data model is multi-tenant at its core: every relevant entity carries an owner reference, every query filters by access through typed helpers like `accessibleProperties(userId)`.

### 3.3. Authentication

**Google OAuth** is the only sign-in method in v1. Auth.js v5 handles the OAuth flow; sessions are stored in the database (not JWT) to allow sliding expiration and immediate revocation.

**Session policy:**

| Scenario              | Inactivity timeout | Absolute cap |
| --------------------- | ------------------ | ------------ |
| Without "Remember me" | 1 hour             | —            |
| With "Remember me"    | 7 days             | 30 days      |

The 30-day absolute cap forces periodic conscious re-authentication, even for active users — a small UX cost that materially improves security hygiene.

Sign-out is available everywhere; "sign out of all devices" is available in Settings with a confirmation modal. Forced sign-out occurs on explicit logout or OAuth withdrawal.

### 3.4. Properties

A user creates and manages property records. A property is an apartment, house, cottage, or any similar unit with utility services.

**When creating a property, only name and type are required** (apartment / house / cottage / other). Services, providers, meters, tariffs — all filled in progressively as needed. An empty property without services is a valid state. The system invites completion gently rather than blocking on incomplete setup.

### 3.5. Services

Each property has its own set of connected services, chosen from a catalog. The set can be arbitrary, down to a single service (e.g., a cottage with only electricity).

**Service type catalog (MVP, 11 entries):**

*Metered:*
- Electricity
- Gas
- Cold water
- Hot water
- Gas delivery (treated as a distinct service type; currently fixed-amount in Ukraine, may transition to metered later)

*Fixed:*
- Heating (central, without a meter)
- Building maintenance
- Garbage collection
- Internet
- Intercom
- HOA fees

**User-defined custom services are post-MVP.** In v1, only catalog types are available. The catalog is seeded once at deployment and has no admin UI in v1.

### 3.6. Providers, tariffs, account numbers — temporal

Each service on a property is tied to a provider and has a tariff, an account number, and payment details. **All of these are stored temporally — with change history over time.**

The model groups these into a **Contract** aggregate:

- A Contract binds a Service to a Provider over a period `[validFrom, validTo)`.
- Within a Contract, **tariffs, account numbers, and payment details are themselves temporal** with their own `validFrom` / `validTo` intervals.
- **Provider change = new Contract.** The old Contract is closed, a new one opens with the new provider.
- **Tariff / account / payment detail change = new temporal record inside the current Contract.** No new Contract needed.

This design allows the system to correctly compute amounts for any past period (using the tariff that was valid then) and to display the full history of every attribute without losing data.

Providers are a per-user catalog, not global. Sharing propagates provider visibility through contracts.

### 3.7. Meters

A meter is a **first-class entity** belonging to a **Property** (the physical device), with properties for serial number, installation and removal dates, zone count (single / two-zone / three-zone), and notes.

A meter is linked to a ServiceType (semantically matches the service it measures) but is not directly owned by a Service instance — the physical device exists independently of how it's used.

**Meter replacement flow:** the old meter is closed (`removedAt` set), a new one is opened. Reading history is preserved. A dedicated page `/properties/[id]/meters/[mid]` shows meter metadata, readings table, and consumption visualization.

**Meter photos are post-MVP** (gated behind file storage, which is also post-MVP).

### 3.8. Readings

**User flow:** open a service or a meter, see the previous reading value, enter a new one, add a note optionally.

**In the model:** Reading is an independent entity with a date, a value (or multiple values for multi-zone meters), an optional note, and a reference to a Meter. Multi-zone readings use multi-value fields (`valueT1`, `valueT2`, `valueT3`) rather than a row per zone.

Readings live independently of bills. A single reading may participate in computations for multiple billing periods. Monotonicity (new value ≥ previous) is enforced as a UX warning, not a DB constraint.

### 3.9. Bills

**User flow:** pick a month and a service, enter the amount shown on the paper or digital bill, optionally add a note.

**In the model:** Bill is a record with a period, an amount, a reference to a service and property, and optional note. Period is stored as a hybrid: `periodStart`, `periodEnd`, and `periodMonth` (the first day of the month). In the v1 UI, bills are month-only; arbitrary custom ranges are post-MVP.

The input is deliberately minimal — no structured components like "debt", "recalculation", "allowance". Those are post-MVP and would overload the UX for features that real users rarely need day to day.

When a reading is available for a bill's period, the system computes an **expected amount** (consumption × tariff for metered, fixed amount for fixed services) and surfaces it next to the input as a hint. The expected amount is not stored; it's derived on read.

### 3.10. Payments

**User flow:** record that an amount was paid on a specific date for a specific service.

**In the model:** Payment is an independent ledger event — it has `paidAt`, an amount, and a reference to a service. There is no "this payment pays that bill" relationship in the model.

### 3.11. Balance, debt, overpayment

The balance follows a **ledger approach**:

- If sum of payments = sum of bills → balance is zero.
- If less → there's a debt.
- If greater → there's an overpayment (or advance payment).

Balance is computed on read per service, per property, and in total across all properties accessible to the user.

### 3.12. Dashboard

The main screen after sign-in. Its purpose is to answer three questions in order: "Do I need to act?" → "What's my state?" → "How are trends going?"

**Composition (top to bottom):**

**Attention block** (conditional, amber accent):
- Reading submission deadline approaching.
- Outstanding debt.
- Payment deadline approaching.

*In MVP these alerts live on the dashboard only. Telegram/email reminders are post-MVP.*

**Balance summary:**
- Total debt across all properties.
- Breakdown by property.

**Charts section:**
- URL-synced filters (Period / Property / Service).
- **Pie chart** — expense structure by service for the selected period.
- **Stacked bar chart** — monthly expenses stacked by service, with rich tooltip and clickable legend for series isolation.
- **Line chart** with two modes via toggle:
  - **Expenses mode** (default) — multi-line, one line per service, Y-axis in UAH.
  - **Consumption mode** — single service selected, Y-axis in physical units (kWh, m³). Loaded on-demand via `<Suspense>`.

Drill-down: click a pie segment or a bar stack → navigate to `/bills?service=X&period=Y`. Line chart uses tooltip only.

Default period: last 12 months.

**First-time empty state:** full-page welcome with "Add your first property" CTA.

### 3.13. Screens

Beyond the Dashboard:

- **Properties list** — card grid of all properties accessible to the user.
- **Property detail** — tabs pattern (Overview / Meters / Sharing), with services list, balances, quick actions.
- **Meters page** under each property — active and historical meters.
- **Meter detail** — metadata, readings history, consumption chart, Replace-meter flow.
- **Service detail** — balance, current contract, meter card, recent activity, notes. Update-contract flow with temporal semantics handled under the hood.
- **Global Bills list** (`/bills`) — data table with filters (property, service, period), URL-synced.
- **Global Payments list** (`/payments`) — structural copy of the Bills list.
- **Sharing tab** — user list with roles, invite flow, last-owner protection, self-removal.
- **Settings** — profile, preferences (language, theme, timezone placeholder), account (sign out of all devices).

### 3.14. Admin section

A dedicated area at URL prefix `/art-admin` (deliberately non-standard as a light defense-in-depth measure). Restricted to `systemRole === 'admin'`. Visual identity: amber accent line and `[Admin]` badge.

**Included in v1:**

- **Admin dashboard** — basic stats (user count, property count, bills, soft-deleted items) and recent system activity.
- **Properties oversight** — all properties across the system, including soft-deleted, with restore and hard-delete.
- **Users view** — read-only user list in v1 (full user management is post-MVP).
- **Landing content CMS** — edit the public landing pages' content without deploying code.

**Hard delete** is admin-only and only works on already-soft-deleted records. It enforces the two-phase lifecycle (active → soft-deleted → hard-deleted). Hard-delete confirmation uses type-to-confirm ("DELETE").

### 3.15. Public landing

SEO-friendly public pages that double as the author's portfolio:

- `/` — CRM showcase with hero, screenshots, feature highlights, tech stack teaser.
- `/about` — minimal developer gateway page. Minimal information by design — no surname, no level self-labeling, no email, single contact path (LinkedIn).
- `/project` — technical deep-dive: stack overview, architecture highlights, schema visualization (text tree), status and roadmap, links to GitHub.

All landing content is **CMS-editable** via the admin section. Five singleton-row tables (one per page section: home hero, about hero, project hero, and two config tables for features and links) drive the content. English-only in MVP; landing multilingualism is post-MVP.

**Visibility toggles:** each landing page has two independent flags — visible in nav, URL-accessible. Allows hiding pages without deleting their content.

### 3.16. Demo mode (for portfolio)

A persistent demo account (`demo@art-crm.local`) lets recruiters and collaborators **view** the CRM without creating a Google account. They click "Try demo" on the landing or login page, are signed in as the demo user, and see pre-seeded realistic data across three properties with ~12 months of bills, payments, and readings — including temporal tariff history to demonstrate the senior-level feature.

All mutations are blocked in demo mode (both backend and frontend). Attempts to mutate trigger a friendly modal pointing to "Sign in with Google for full access." Demo data is seeded once at initial deployment; there is no nightly re-seed in MVP.

Full UX details live in `UI_ARCHITECTURE.md` → Demo Mode section.

### 3.17. Unit of account in the UI — the month

Users think in months, not in individual bills. The UI's primary slice is **month × service**: "for October for electricity — charged X, paid Y, balance Z".

The word "Bill" exists in the data model but does not surface as a navigational term in the UI. In conversation, users see "October", "electricity", "to pay", "submit reading".

### 3.18. Multilingual support

Three languages in MVP, all for the authenticated CRM:

- **English** (default)
- **Ukrainian**
- **Russian**

Implementation: `next-intl` with cookie-based locale detection. Every user-facing string goes through `t('key')` from day one — zero hardcoded text in the app surface. Language selection is available in the user menu and persists across sessions.

Landing pages are **English-only** in MVP.

### 3.19. Themes

- **Light** and **dark** themes.
- Default: follows system preference (`prefers-color-scheme`).
- Override: available in user Settings.
- Implementation: `next-themes`.

### 3.20. Notes

A `notes` field is available on all key entities: Property, Service, Contract, Meter, Reading, Bill, Payment.

**Plain text, multiline.** No formatting, no Markdown, no rich text. Rich-text is explicitly post-MVP.

### 3.21. Currency and units

- **Currency: UAH (Ukrainian hryvnia)**, hardcoded. Multi-currency is post-MVP.
- **Units** are hardcoded to the Ukrainian standard:
  - Electricity — kWh
  - Gas, water — m³
  - Heating — Gcal (if applicable)

### 3.22. Timezone and dates

- All timestamps are stored in **UTC** in the database.
- Display is in the user's timezone.
- In MVP the user's timezone is hardcoded to **Europe/Kyiv** (a Settings placeholder is shown but disabled).
- Every entity carries `createdAt` and `updatedAt` at minimum.

### 3.23. Deletion

**Soft delete everywhere.** Every primary entity carries a `deletedAt` timestamp. Deleted records do not appear in the UI by default but remain in the database.

- **User-initiated soft delete** cascades to related entities in one transaction (deleting a property marks services, contracts, tariffs, meters, readings, bills, and payments as deleted). Users see "This action cannot be undone" — because from their perspective it cannot.
- **Admin** can view, restore, or hard-delete soft-deleted records.
- **External file storage** (Google Drive, post-MVP) is never touched by any deletion operation — the app owns references, not files.

### 3.24. Security baseline

- **HTTPS everywhere.**
- **Rate limiting** on the API (~100 req/min per IP, baseline).
- **CORS** — restricted to frontend domains.
- **Logs** — no personal data (emails, amounts, account numbers are not logged).
- **Database** — standard access control and password protection on backups. No per-field encryption.
- **Forbidden responses use 404** — admin routes accessed by non-admins return 404 (not 403), hiding the existence of the admin section.

### 3.25. Accessibility

Baseline level:
- Semantic HTML throughout.
- Keyboard navigation works.
- ARIA attributes where needed.
- Not targeting WCAG AAA, but not ignored either.

### 3.26. Observability

- **Structured logging with pino** — correlation-ID tagged, ready for aggregation.
- **Correlation ID middleware** — every request is tagged; the ID propagates through logs and Sentry.
- **Sentry** for unhandled errors (free tier). No metrics, no tracing in v1.

### 3.27. Quality baseline

- **Strict TypeScript.** `strict: true` plus `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.
- **Shared validation.** Zod schemas serve both forms (React Hook Form) and Server Action input validation. `drizzle-zod` generates validation schemas from the database schema to avoid duplication.
- **Error handling as Results.** Expected errors (validation, not found, forbidden) are returned as typed `Result` values, not thrown. Unexpected errors are thrown, caught by `error.tsx`, logged to Sentry.
- **Strategic testing.** Tests cover business logic (ledger computation, temporal tariff lookups, dashboard aggregations), critical Server Actions (bill and payment creation, contract transitions, sharing), and utility functions (currency and date formatting). Comprehensive UI and auth-flow testing are explicitly out of scope for v1.

---

## 4. What is NOT in the MVP (explicit non-goals)

### 4.1. Functional features

- **Email/password authentication** (Google OAuth only in v1).
- **Telegram or email notifications** for deadlines and debts.
- **File storage** (Google Drive integration) for bill photos, receipts, meter photos.
- **Custom user-defined service types** (catalog only in v1).
- **Mobile service** as a utility type with per-family-member breakdown.
- **Per-device session management** (list of active sessions, selective revocation).
- **Undo / restore UI for soft-deleted records** (soft delete is in the data model; user-facing restoration is admin-only).
- **Accept/decline invitation flow** — invitations in v1 grant access immediately to users who already have accounts.

### 4.2. Analytics and data operations

- **Data export** (CSV, Excel, PDF).
- **Data import** from external sources (spreadsheets, etc.).
- **Full-text search** across notes, amounts, periods.
- **Rich-text notes** (Markdown or WYSIWYG).
- **Year-over-year comparisons, forecasts, heatmaps.**

### 4.3. Automation

- **Email bill parsing** from providers.
- **OCR** on scanned or photographed bills.
- **Provider API integrations** (submit readings, fetch bills).
- **Automatic reconciliation** with provider ledgers through a "provider-reported debt" field.

### 4.4. Technical

- **Offline mode.**
- **Native mobile application** (only a responsive web app in v1).
- **Browser push notifications.**
- **Multi-currency.**
- **Full audit log** with per-version history (only `createdAt` / `updatedAt` in v1, no complete version trail).

---

## 5. Roadmap after MVP

The order is preliminary and will be adjusted based on MVP outcomes.

### v2 — Core convenience extensions

1. **Email/password authentication** alongside Google.
2. **Google Drive integration** for file storage — bill photos, receipts, meter photos. Connected at the property level by the owner.
3. **Telegram notifications** — reading deadlines, payment deadlines, debt alerts.
4. **Accept/decline invitation flow** for sharing, including email-based invitations to users without accounts.

### v3 — Analytics and polish

5. **Custom user-defined services.**
6. **Data export** (CSV / Excel / PDF).
7. **Full-text search** across the system.
8. **Per-device session management** with UI for active sessions.

### v4+ — Automation

9. **Email bill parsing.**
10. **OCR from scanned bills.**
11. **Integrations with provider portals** where APIs are available.
12. **Structured bill components** (debt, overpayment, recalculation, allowances) for provider reconciliation.

### Possibly someday

- Mobile service as a utility type.
- Multi-currency.
- Other country localizations.
- Native mobile app.
- Public API for integrations.

---

## 6. Architectural principles

These apply across all decisions, including the MVP.

**6.1. Multi-tenant from day one.**
Every entity carries an owner reference; every data query filters by access through typed helpers. No shortcuts.

**6.2. Temporal data for everything changeable.**
Tariffs, account numbers, payment details are stored with `validFrom` / `validTo` using half-open intervals `[validFrom, validTo)`. Old records are closed, not overwritten.

**6.3. Ledger approach to money.**
Bills and payments are independent records. Balance is derived. No forced "this payment pays that bill" relationship.

**6.4. Soft delete everywhere.**
Data does not disappear physically. Hard delete is admin-only and gated behind soft delete.

**6.5. i18n from day one.**
Every user-facing string through `t('key')`. No hardcoded text.

**6.6. UTC in the database, local time in the UI.**

**6.7. UI speaks the user's language, not the developer's.**
The UI does not surface terms like "Bill", "Contract", or "Meter" as navigation. Users see "October", "electricity", "submit reading", "to pay".

**6.8. Progressive disclosure.**
Mandatory fields at creation are minimal. The rest fills in as needed. The system does not block on incomplete configuration; it invites completion gently.

**6.9. Senior-level code quality.**
Type safety, readability, separation of concerns, explicit types, no magic. If something works but it is unclear why, it does not count as "working".

---

## 7. Core entities (conceptual)

*This is a conceptual list. The detailed schema lives in `README.living.md` and the Drizzle schema itself.*

- **User** — system user with a `systemRole`.
- **Property** — a unit being tracked (apartment, house, cottage).
- **PropertyAccess** — User ↔ Property relationship with a `propertyRole` (owner / editor / viewer).
- **Service** — a service attached to a property; references a ServiceType.
- **ServiceType** — catalog type (electricity, gas, internet, etc.). Seeded, not user-editable in v1.
- **Contract** — provider-bound agreement for a service over a period, grouping tariff / account / payment details with their own temporal histories.
- **Provider** — utility provider (per-user catalog).
- **Tariff** — rate effective over a period, within a Contract.
- **AccountNumber** — account number effective over a period, within a Contract.
- **PaymentDetails** — payment details effective over a period, within a Contract.
- **Meter** — physical device belonging to a Property.
- **Reading** — meter reading on a specific date.
- **Bill** — charge record for a period.
- **Payment** — payment event.
- **LandingContent** — five singleton-row tables (home / about / project / features / links) driving the CMS.

All entities carry `notes` (where relevant), `createdAt`, `updatedAt`, and `deletedAt` (for soft-deletable entities).

---

## 8. Open questions carried to implementation

These do not require answers now; they are recorded so they are not lost.

**Phase 7 (build MVP):**
- Test database strategy for the first real tests (in-memory substitute vs. a dedicated Neon/local branch).
- Translation workflow: author, wife, AI-assisted — and who reviews.
- Error code catalog structure in `i18n` files.
- Cron or scheduled job for expired session cleanup (timing, location).
- Seed scripts for `service_types` catalog and landing CMS baseline content.
- Demo account seed: one-time deployment pipeline, idempotent re-seed procedure.

**Data model refinements:**
- Exact exclusion constraint SQL for all temporal entities using `btree_gist`.
- Indexing strategy for the most common dashboard queries (balance aggregation, monthly rollups).
- Cache strategy for landing visibility flags.

**Deferred to v2+:**
- `gas_delivery` transition to metered: when legislation changes, execute a manual admin migration.
- `payment_details` potentially needing structured fields (IBAN, bank, recipient) for QR/integration use cases.
- Landing multi-language support.
- Recorded video demo as an alternative to the live demo.
- API extraction if a mobile app or third-party integrations are planned.

---

## One-paragraph summary

Utility Bills CRM v1 is a web application with a public landing page (SEO-friendly, doubling as the developer's portfolio), an authenticated CRM for tracking utility bills across multiple properties, multi-user sharing with roles and invitations, and an admin section with landing-content CMS. Users sign in via Google OAuth, create properties, connect services from a catalog, enter readings and bills and payments, and see a dashboard with balance, debts, and expense/consumption charts. Under the hood: a multi-tenant data model with temporal tariffs and ledger accounting, ready for v2 extensions (file storage, notifications, email/password auth). The goal is a portfolio-grade product with real users from day one.
