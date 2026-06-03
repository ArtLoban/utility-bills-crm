# Design Brief — Admin Landing CMS

The final screen of the Admin section. A single-screen CMS with four tabs for editing the public landing pages' content without deploying code.

## CRITICAL — visual language

This project has an established **Design System & UI Kit**, located in this project at `/Design System.html`. It was built together across Iterations 1–7 and is the **authoritative source of truth** for the project's visual language — palette, typography, spacing, components, light/dark treatment.

**Before generating anything, reference `/Design System.html`.** All components, colors, and patterns must come from it. Iterations 1–7 are the accepted stylistic foundation; the Design System codifies them.

The Admin section adds the **amber accent chrome** on top of that base — 3px amber line at the top, `[Admin]` badge by the logo, amber underline on the active nav item. Everything else identical to the regular app.

## Deliverables

Generate one at a time, pausing for feedback between each:

1. Landing CMS — Home tab, light mode
2. Landing CMS — Home tab, dark mode
3. Landing CMS — About tab, light mode
4. Landing CMS — About tab, dark mode
5. Landing CMS — Project tab, light mode
6. Landing CMS — Project tab, dark mode
7. Landing CMS — Global tab, light mode
8. Landing CMS — Global tab, dark mode

**Single-variant rule:** one version of each. No comparison alternatives.

Mobile: the tab bar and forms stack predictably; show a mobile render of the Home tab at minimum.

---

## Screen shell (shared across all four tabs)

URL: `/art-admin/landing`

### Admin chrome

Standard admin header — 3px amber line, logo + wordmark, `[Admin]` badge, nav `Dashboard | Properties | Users | Landing` with `Landing` active (amber underline).

### Page header

- Title (h1): **Landing content**
- Subtitle (muted): `Edit the public landing pages. Changes publish immediately.`

### Tab bar

Four tabs below the page header: **Home · About · Project · Global**. shadcn `<Tabs>` styling, consistent with tabs used elsewhere in the project. Active tab on each respective deliverable.

### Per-tab save

Each tab has its **own Save button**, bottom-right of the tab content. Label: `Save changes`. Disabled when no edits are pending in that tab.

Unsaved-changes protection: switching tabs or leaving the page with pending edits triggers a confirm dialog. The mockup doesn't need to render the dialog — but the per-tab save button should be visible on every tab.

Content width inside tabs: forms constrained to roughly `max-w-2xl`, consistent with the Settings page.

---

## Tab 1 — Home

Edits the `/` landing page. Fields, top to bottom:

### Section: Hero

- **Hero title** — text input. Value: `Utility Bills CRM`
- **Hero description** — textarea, ~4 rows. Value: `A multi-tenant web application for tracking utility bills across multiple properties — apartments, houses, summer homes. Log meter readings, record bills and payments, see balances and consumption analytics over time.`

### Section: Screenshot captions

- **Dashboard caption** — textarea, 2 rows. Value: `Dashboard. Balance summary across all properties, expense breakdown by service, monthly trends, and consumption analytics with switchable money/units view.`
- **Property detail caption** — textarea, 2 rows. Value: `Property detail. Each property holds its own services with full contract history — provider changes, tariff changes, account number changes, all preserved.`

### Section: Feature cards

Four feature cards, each with a title and a body. Render as four sub-groups (a light visual grouping — a bordered block or a labelled fieldset per card).

- **Card 1 — title** input: `Properties and people` · **body** textarea: `Track multiple properties — apartments, houses, summer homes — and share access with family at owner, editor, or viewer level.`
- **Card 2 — title** input: `Tariffs change. History stays.` · **body** textarea: `Every tariff, account number, and payment detail is stored with its validity period. Recompute past months correctly even after rates change.`
- **Card 3 — title** input: `Bills and payments as a ledger` · **body** textarea: `Bills and payments are independent records. Balance is derived. No forced "this payment pays that bill" links — just the math, the way real households do it.`
- **Card 4 — title** input: `From numbers to trends` · **body** textarea: `Pie, stacked bar, and line charts show where money goes, how consumption shifts month to month, and whether things are getting better or worse.`

### Section: Tech highlights

- **Tech highlights line** — text input. Value: `Built with Next.js, TypeScript, PostgreSQL, Drizzle ORM, Auth.js, shadcn/ui, and Tailwind.`

`Save changes` button bottom-right.

---

## Tab 2 — About

Edits the `/about` page. Fields:

### Section: Hero

- **Hero greeting** — text input. Value: `Hi, I'm Art.`
- **Hero description** — textarea, 2 rows. Value: `Frontend developer. React, TypeScript, complex UIs. Working remotely, based in Ukraine.`

### Section: What I work with

- **Content** — textarea, ~8 rows (this section holds three paragraphs). Value, with the three paragraphs separated by blank lines:

  `Day-to-day: React with TypeScript, Next.js, modern data tables and visualizations, design systems.`

  `Comfortable with: state management at scale (Redux Toolkit, RTK Query), forms and validation, authentication, role-based access.`

  `Most of the last few years went into building a payment orchestration platform — a large back-office admin panel that grew to 50+ pages and a few thousand TypeScript files. This CRM is the next thing I'm building.`

`Save changes` button bottom-right.

---

## Tab 3 — Project

Edits the `/project` page. Fields:

### Section: Hero

- **Hero title** — text input. Value: `Utility Bills CRM`
- **Hero description** — textarea, 3 rows. Value: `A multi-tenant web application for utility bill tracking, built as both a real product and a senior-level engineering practice ground. The page below walks through the stack, architecture, and the decisions behind them.`

### Section: Architecture highlights

Six highlight cards, each title + body. Render as six sub-groups, same grouping treatment as Home tab's feature cards. Full body text:

- **Card 1 — title:** `Next.js full-stack with RSC` · **body:** `One codebase, no separate API layer. Server Components fetch from the database directly; Server Actions handle mutations with typed validation. No type duplication, no CORS, no version skew between services.`
- **Card 2 — title:** `PostgreSQL with temporal data` · **body:** `Tariffs, account numbers, payment details — anything that changes over time — is stored with validFrom / validTo intervals using half-open semantics [start, end). Past months recompute correctly using whichever rate was valid then.`
- **Card 3 — title:** `Drizzle ORM, not Prisma` · **body:** `Drizzle keeps SQL visible — schema-as-TypeScript, but queries that read like SQL. Better fit for the learning goal, better fit for serverless connection patterns, and drizzle-zod removes a whole class of schema/validation duplication.`
- **Card 4 — title:** `Auth.js with database sessions` · **body:** `Sliding expiration, immediate revocation, and a "Remember me" 30-day cap that forces conscious re-authentication. The OAuth flow is delegated to the library; sessions live in the database where revoking them takes one row update.`
- **Card 5 — title:** `Ledger-style accounting` · **body:** `Bills and payments are independent records. There is no "this payment pays that bill" relationship — balance is derived from sum(bills) − sum(payments). Matches how households actually think about their utilities and stays correct when amounts don't line up perfectly.`
- **Card 6 — title:** `Multi-tenant from day one` · **body:** `Every entity carries an owner reference. Every query filters by access through typed helpers like accessibleProperties(userId). Multi-tenancy is in the data model, not bolted on later — and that decision shapes auth, sharing, soft-delete, and admin all at once.`

### Section: Current status

- **Status text** — textarea, ~5 rows. Value: `The app is in active development. Architecture is finalized, the data model is implemented, the UI is being built screen by screen. The first real user — the author's wife — is testing flows as they ship.`

`Save changes` button bottom-right.

---

## Tab 4 — Global

Configuration shared across the landing — external links and page visibility. Fields:

### Section: External links

Four text inputs for URLs:

- **LinkedIn URL** — input. Value: `https://linkedin.com/in/artem-loban`
- **GitHub profile URL** — input. Value: `https://github.com/artloban`
- **Project repository URL** — input. Value: `https://github.com/artloban/utility-bills-crm`
- **Live demo URL** — input. Value: `https://utility-bills-crm.vercel.app`

(These are placeholder example URLs — real ones get filled in later.)

### Section: Page visibility

Two pages — About and Project — each with two independent toggles. Render as a small two-row layout, each row a page name with two switches.

- **About page**
  - `Visible in navigation` — toggle, ON
  - `URL accessible` — toggle, ON
- **Project page**
  - `Visible in navigation` — toggle, ON
  - `URL accessible` — toggle, ON

Below the toggles, a muted explanatory note: `"Visible in navigation" shows the page link in the public header. "URL accessible" controls whether the page can be opened directly. A page can be reachable by URL while hidden from the nav.`

`Save changes` button bottom-right.

---

## Logic and behavior

- Static screen, no backend. Field values come from the content above (the real Iteration 6 landing copy).
- Per-tab save: each tab's Save button is independent — saving Home doesn't touch About.
- Save button disabled until that tab has pending edits.
- Tab switching with unsaved edits triggers a confirm dialog (not rendered in the mockup).
- The CMS edits content only — it does not control layout or styling of the landing pages.

## Visual requirements

- **Light + Dark mode** — full parity, rendered for all four tabs.
- **Mobile-first** — start mobile. Tab bar may become horizontally scrollable or stacked on narrow screens; form fields go full-width; per-tab save button full-width at the bottom on mobile.
- **Admin chrome** — page lives inside the admin layout, doesn't render its own header.

## What's NOT on this screen

- No live preview of the landing pages (post-MVP — explicit decision).
- No draft / published states (changes publish immediately — post-MVP for draft workflow).
- No section reordering, no add/remove of feature cards (the card count is fixed in MVP).
- No rich-text formatting (plain text only).
- No multi-language content (landing is English-only in MVP).
- No image upload (screenshots are part of the code, not CMS-managed in MVP).
