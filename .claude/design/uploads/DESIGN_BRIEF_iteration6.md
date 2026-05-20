# Design Brief — Iteration 6 (Public Landing)

Three public pages: `/` (CRM showcase), `/about` (developer gateway), `/project` (technical deep-dive).

**Continuation of Iterations 1–5.** Visual language is locked: shadcn New York, Zinc base, Violet primary accent, Inter typography, 0.5rem radius, light + dark modes, 200ms loading delay pattern.

---

## What's different from previous iterations

Previous iterations were the **app surface** (CRM, modals, auth). This iteration is the **public surface** — landing pages.

Visual language: **"Variant B" — shared base, distinct landing flavor.**

This means:

- **Same** typography, palette, accent, radius, shadcn components.
- **Different** rhythm: larger whitespace, bigger headings, alternating section backgrounds for vertical rhythm, room for subtle gradients in hero.
- **Larger** screenshots and mockups than typical app density.
- **Less** information density — landing pages breathe, app pages don't.

Reference vibe: Linear's marketing site, Vercel's docs landing, Resend's homepage. **Not** Stripe-style maximalist gradients, **not** generic SaaS happy-people-laptops.

---

## Screenshots policy

The `/` page contains two screenshots — one of the CRM Dashboard, one of Property detail.

**Use stylized mockups, not pixel-perfect copies of previous iteration screens.**

Stylized means: recognizable structure of the screen (top bar, the right panels in the right places, charts as charts), but simplified — fewer real numbers, lighter visual weight, larger typography, more whitespace. The goal on a landing page is "you can read the silhouette of the app from across the room", not "you can read the actual data".

Real screenshots from Iteration 1 are perfect for documentation but too dense for hero showcases.

Frame each in a subtle browser chrome (just three dots + a thin URL bar — not a full Chrome window).

---

## Deliverables expected from this iteration

Please generate these one at a time, pausing between each for feedback:

1. `/` — full page, light mode
2. `/` — full page, dark mode
3. `/about` — full page, light mode (dark mode optional, generate only if budget allows)
4. `/project` — full page, light mode
5. `/project` — full page, dark mode

Mobile variants: required for `/` (it's the entry point). Optional for `/about` and `/project` (their content is largely text and stacks predictably).

**Single-variant rule:** generate one version of each screen. Do not produce side-by-side alternatives for comparison. Visual experimentation (different gradient intensities, alternative chip styles, etc.) will happen later in code, where it costs nothing.

---

## Page 1: `/` — CRM showcase

Six sections, stacked vertically. Sections alternate background between `bg-background` and `bg-muted/30` for vertical rhythm.

### Section 1 — Hero

`bg-background`. Generous vertical padding (`py-24 sm:py-32`).

A very faint accent-tinted radial glow positioned roughly in the upper-right area of the hero. Low opacity, barely-there texture — not a feature.

**Content:**

> # Utility Bills CRM
>
> A multi-tenant web application for tracking utility bills across multiple properties — apartments, houses, summer homes. Log meter readings, record bills and payments, see balances and consumption analytics over time.
>
> Built as a portfolio piece and a real product. The first user is the author's wife, who's been tracking two apartments in a paper notebook for years.

No CTA buttons in the hero.

H1 should be large but not overwhelming — `text-5xl sm:text-6xl` range, `font-semibold` (not `font-bold`). Subtitle in `text-xl text-muted-foreground` with `max-w-2xl`.

### Section 2 — Screenshot showcase (Dashboard)

`bg-muted/30`.

Large stylized mockup of the **Dashboard**, centered, in a thin browser frame. Width: roughly 80–90% of container.

Caption directly below:

> **Dashboard.** Balance summary across all properties, expense breakdown by service, monthly trends, and consumption analytics with switchable money/units view.

Caption is muted, centered, `max-w-2xl`.

### Section 3 — Feature highlights

`bg-background`.

A 2×2 grid of four cards. On mobile: single column.

Each card: icon (24×24, `text-primary`), bold title, body paragraph. No CTA per card.

**Card 1 — `Users` icon**

> **Properties and people**
>
> Track multiple properties — apartments, houses, summer homes — and share access with family at owner, editor, or viewer level.

**Card 2 — `Clock` or `History` icon**

> **Tariffs change. History stays.**
>
> Every tariff, account number, and payment detail is stored with its validity period. Recompute past months correctly even after rates change.

**Card 3 — `Scale` or `Wallet` icon**

> **Bills and payments as a ledger**
>
> Bills and payments are independent records. Balance is derived. No forced "this payment pays that bill" links — just the math, the way real households do it.

**Card 4 — `BarChart3` or `TrendingUp` icon**

> **From numbers to trends**
>
> Pie, stacked bar, and line charts show where money goes, how consumption shifts month to month, and whether things are getting better or worse.

Cards have `border` and `shadow-sm` in light mode (consistent with app cards). No hover state needed (they're not interactive).

### Section 4 — Screenshot showcase (Property detail)

`bg-muted/30`.

Same treatment as Section 2. Stylized mockup of **Property detail** (Overview tab — services list with balances).

Caption:

> **Property detail.** Each property holds its own services with full contract history — provider changes, tariff changes, account number changes, all preserved.

### Section 5 — Tech highlights

`bg-background`.

Centered, single block. No mockup, no card — just text and a link.

> Built with **Next.js**, **TypeScript**, **PostgreSQL**, **Drizzle ORM**, **Auth.js**, **shadcn/ui**, and **Tailwind**.
>
> [ Architecture deep-dive → ]

Stack names in `font-medium`. The link styled as a `variant="link"` button or accent-colored link with `→`.

### Section 6 — Footer

`bg-muted/30`.

Minimal centered text. Two navigation links, copyright. No bordered band, no horizontal rule on top.

> [ About the developer → ] (conditional — visible only if `aboutVisibleInNav`)
>
> [ Architecture & code → ] (conditional — visible only if `projectVisibleInNav`)
>
> © 2026 · Utility Bills CRM

For this mockup, render both links (visibility flags are runtime). Stack vertically on mobile, horizontal on desktop.

---

## Page 2: `/about` — minimal gateway

Three short sections. Deliberately sparse. The whole page should feel like a quiet, confident introduction — not a CV.

### Section 1 — Hero

`bg-background`. Same vertical padding as `/` hero, but content is much shorter.

> # Hi, I'm Art.
>
> Frontend developer. React, TypeScript, complex UIs.
>
> Working remotely, based in Ukraine.

No avatar. No background imagery. No social links here. No CTA.

### Section 2 — What I work with

`bg-muted/30`.

A single content block, `max-w-2xl`, three short paragraphs separated by visible spacing.

> Day-to-day: React with TypeScript, Next.js, modern data tables and visualizations, design systems.
>
> Comfortable with: state management at scale (Redux Toolkit, RTK Query), forms and validation, authentication, role-based access.
>
> Most of the last few years went into building a payment orchestration platform — a large back-office admin panel that grew to 50+ pages and a few thousand TypeScript files. This CRM is the next thing I'm building.

No icons, no badges, no skills grid. Just text. The point is restraint.

### Section 3 — See more

`bg-background`.

Three links as a vertical list, each with a short caption.

> **LinkedIn** — full background, recommendations, work history.
>
> **GitHub** — code lives here.
>
> **About this project** — architecture, decisions, stack rationale.

Style each line: link in accent color, `font-medium`; caption in `text-muted-foreground`. Em-dash separator. On mobile, the caption should wrap below the link.

No email. No "open to roles" callout. No contact form.

---

## Page 3: `/project` — technical deep-dive

Six sections. Denser than `/about`, but still landing-paced (more whitespace than the app).

### Section 1 — Hero

`bg-background`.

> # Utility Bills CRM
>
> A multi-tenant web application for utility bill tracking, built as both a real product and a senior-level engineering practice ground. The page below walks through the stack, architecture, and the decisions behind them.
>
> [ View on GitHub → ]

The CTA button is `variant="default"` (filled, accent color) with a `Github` icon on the left or arrow on the right.

### Section 2 — Stack at a glance

`bg-muted/30`.

Two columns on desktop (Frontend / Backend), single column on mobile. Each column has a heading and a list of items.

Items render as small "chip" badges in a flowing layout (`flex flex-wrap gap-2`). **Outlined style — subtle border, no background fill.** Faint accent-colored ring on hover (they're clickable — link out to the library's site).

**Frontend column:**

> Next.js · TypeScript · Tailwind v4 · shadcn/ui · Radix · TanStack Table · React Hook Form · Zod · Recharts · next-intl · next-themes · sonner

**Backend column:**

> Next.js Server Components & Actions · PostgreSQL · Drizzle ORM · drizzle-zod · Auth.js v5 · pino · Sentry

No "Infrastructure" column — that's deployment metadata, not part of what the project _is_.

### Section 3 — Architecture highlights

`bg-background`.

A 2×3 grid of six cards on desktop. 2×3 → 1 column on mobile.

Each card: a small icon (optional but nice — pick semantic icons from lucide), bold title, body paragraph (~3 sentences).

**Card 1 — Next.js full-stack with RSC**

> One codebase, no separate API layer. Server Components fetch from the database directly; Server Actions handle mutations with typed validation. No type duplication, no CORS, no version skew between services.

**Card 2 — PostgreSQL with temporal data**

> Tariffs, account numbers, payment details — anything that changes over time — is stored with `validFrom` / `validTo` intervals using half-open semantics `[start, end)`. Past months recompute correctly using whichever rate was valid then.

**Card 3 — Drizzle ORM, not Prisma**

> Drizzle keeps SQL visible — schema-as-TypeScript, but queries that read like SQL. Better fit for the learning goal, better fit for serverless connection patterns, and `drizzle-zod` removes a whole class of schema/validation duplication.

**Card 4 — Auth.js with database sessions**

> Sliding expiration, immediate revocation, and a "Remember me" 30-day cap that forces conscious re-authentication. The OAuth flow is delegated to the library; sessions live in the database where revoking them takes one row update.

**Card 5 — Ledger-style accounting**

> Bills and payments are independent records. There is no "this payment pays that bill" relationship — balance is derived from `sum(bills) − sum(payments)`. Matches how households actually think about their utilities and stays correct when amounts don't line up perfectly.

**Card 6 — Multi-tenant from day one**

> Every entity carries an owner reference. Every query filters by access through typed helpers like `accessibleProperties(userId)`. Multi-tenancy is in the data model, not bolted on later — and that decision shapes auth, sharing, soft-delete, and admin all at once.

Cards: same shadcn `Card` styling as the app (border + `shadow-sm` light, border + faint hover ring dark). Inline code (`like this`) styled with `bg-muted px-1.5 py-0.5 rounded text-sm font-mono`.

### Section 4 — Schema visualization

`bg-muted/30`.

A heading "**Data model**", then a single `<pre>` block with the entity tree, then a one-line link.

```
User
├── PropertyAccess (role: owner / editor / viewer)
└── Property
    ├── Service (electricity, gas, water, …)
    │   ├── Contract (provider, period)
    │   │   ├── Tariff (rates over time)
    │   │   ├── AccountNumber (over time)
    │   │   └── PaymentDetails (over time)
    │   ├── Bill (period, amount)
    │   └── Payment (date, amount)
    └── Meter (physical device)
        └── Reading (date, value(s))
```

Tree: `font-mono`, `text-sm`, `bg-card`, `rounded-lg`, `border`, `p-6`, centered with `max-w-2xl`. In dark mode, `bg-card` already gives the right contrast.

Below the tree:

> Full schema in the GitHub repository — Drizzle definitions, exclusion constraints, indexes, the lot.

### Section 5 — Current status & roadmap

`bg-background`.

A heading "**Status**" and four short paragraphs. No card, no grid — just typographic hierarchy.

> **Where it is now.** The app is in active development. Architecture is finalized, the data model is implemented, the UI is being built screen by screen. The first real user — the author's wife — is testing flows as they ship.
>
> **v1 (in progress).** Public landing, authenticated CRM, multi-user sharing, admin section with landing CMS, three languages, light/dark theme.
>
> **Beyond v1.** File storage (Google Drive), Telegram notifications, custom services, export, OCR for scanned bills, provider integrations. Roadmap detail in the README.
>
> **Hosted on** Vercel (app) and Neon (database).

Each leading phrase in `font-semibold`. Body text in default weight.

### Section 6 — Links

`bg-muted/30`.

Three links, same vertical-list pattern as `/about` Section 3.

> **GitHub** — full source, README, decision log.
>
> **Live demo** — view-only, with sample data.
>
> **About me** — who built this.

---

## Public header (used on all three pages)

The public header was specified in `UI_ARCHITECTURE.md` and isn't redesigned here, but it must appear on the rendered mockups so the page feels complete.

- Sticky, with subtle backdrop blur on scroll.
- **Left:** logo mark + "Utility Bills CRM" wordmark, clickable → `/`.
- **Center (desktop only):** nav links to `About`, `Project` (both shown in mockup; visibility is a runtime concern).
- **Right:** `Sign in` button (`variant="ghost"` or `variant="outline"`) + theme toggle.
- **Mobile:** logo + theme toggle + hamburger that opens a `<Sheet>` with the nav links and Sign in.

No language switcher on public pages (landing is English-only in MVP).

---

## Out of scope for this iteration

- Sign-in page (already done in iter 5)
- Authenticated app screens (already done)
- Admin section (next iteration)
- Animation/scroll effects — mockups should look static
- Real-image illustrations (no stock photos, no generated AI art)
- Cookie banners, GDPR notices
- Footer "Terms of Service / Privacy Policy" links — not in scope for v1

---

## Final note on tone

This is a portfolio that should read as **honest, technical, and quietly confident**. Not loud. Not insecure. The person reading it should think "this person knows what they're doing, and isn't trying to sell me anything" — not "this person wants me to be impressed".

If a section feels like it's trying too hard, simpler always wins.
