# UI Architecture — Utility Bills CRM

> Output of Phase 6 (UI Design).
> This document is the single source of truth for the UI structure: routes, layouts, patterns, screens, and cross-cutting UX decisions.
> It is the direct input for Phase 7 (Build MVP).

## Table of Contents

1. [Application Structure](#application-structure)
2. [Design System](#design-system)
3. [Layout Conventions](#layout-conventions)
4. [Navigation & Headers](#navigation--headers)
5. [Site Map](#site-map)
6. [Shared Patterns](#shared-patterns)
7. [Shared States](#shared-states)
8. [Core App Screens](#core-app-screens)
9. [Admin Section](#admin-section)
10. [Public Landing](#public-landing)
11. [Authentication](#authentication)
12. [Demo Mode](#demo-mode)
13. [Cross-cutting UX Decisions](#cross-cutting-ux-decisions)
14. [Deferred Features](#deferred-features)

---

## Application Structure

The application has **four distinct surfaces** organized as Next.js App Router route groups:

| Group | URL prefix | Access | Visual identity |
|-------|-----------|--------|-----------------|
| `(public)` | `/`, `/about`, `/project` | Anonymous + authenticated | Public landing, SEO-friendly |
| `(auth)` | `/auth/*` | Anonymous | Fullscreen centered card |
| `(app)` | `/dashboard`, `/properties`, `/bills`, etc. | Authenticated users | Standard app with top bar |
| `(admin)` | `/art-admin/*` | Admin users only (`systemRole === 'admin'`) | Amber accent + "Admin" badge |

The admin URL prefix `/art-admin` is deliberately non-standard (not `/admin`) as a light security-through-obscurity measure. Real protection is via middleware + layout check against `systemRole`.

---

## Design System

### Base

- **Component library:** shadcn/ui, **New York** style
- **Styling:** Tailwind CSS v4
- **Base palette:** Zinc (neutral grays)
- **Primary accent:** Violet (provisional — may be revisited)
- **Admin accent:** Amber (for admin section only)
- **Typography:** Inter
- **Radius:** 0.5rem

### Elevation

- **Light mode:** `shadow-sm` on cards, `shadow-md` on hover for clickable cards
- **Dark mode:** `border border-border` instead of shadows, `border-primary/30` on hover for clickable

### Icons

lucide-react, semantic choices per context (e.g., `Zap` for electricity, `Droplets` for water, `Home` for property, `AlertTriangle` for warnings).

### Service type icons

| Service | Icon |
|---------|------|
| Electricity | `Zap` |
| Gas | `Flame` |
| Cold water, Hot water | `Droplets` |
| Heating | `Flame` or `Thermometer` |
| Internet | `Wifi` |
| Other fixed services | Contextual |

---

## Layout Conventions

### Max content width

- `max-w-screen-2xl` (~1536px) for `(app)` and `(admin)`
- `max-w-screen-xl` (~1280px) for `(public)`
- Full-width allowed for specific data-dense screens (long tables)

### Horizontal padding

- Mobile: `px-4`
- Tablet: `sm:px-6`
- Desktop: `lg:px-8`

### Page structure (app & admin)

Every page follows:

```
Top bar (sticky)
Breadcrumbs (optional, only for deep pages)
Page header (non-sticky)
  - Title (h1/h2)
  - Optional subtitle with metadata
  - Optional actions aligned right
Page content (varies by pattern)
```

### Content patterns

Reusable page content patterns:

1. **Single card/form** — centered form for creation, editing (`max-w-2xl`)
2. **List with filters** — filter bar + table, full width
3. **Dashboard grid** — cards at different sizes via CSS Grid
4. **Tabs / sections** — nested content under tab navigation
5. **Split view** — two columns on desktop, stacked on mobile (used sparingly)
6. **Empty state** — centered illustration + text + CTA

### Footer

- **Public pages:** minimal footer with navigation links and copyright
- **Authenticated zones (`(app)`, `(admin)`):** no footer

---

## Navigation & Headers

Three distinct header variants, all sharing the same base structure (height, sticky behavior, backdrop blur, typography).

### Public header

- Logo + app name (left, clickable → `/`)
- Nav center: `About`, `Project` (conditional on `visibility.*VisibleInNav`)
- Right:
  - `Sign in` (anonymous) / `Open CRM` (authenticated) / `Open CRM` + `Admin` (admin)
  - Theme toggle
  - No language switcher (landing is English-only in MVP)
- Mobile: hamburger → `<Sheet>` drawer

### App header

- Logo + app name → `/dashboard`
- Primary nav: `Dashboard | Properties | Bills | Payments | Settings`
- Active link has subtle underline in accent color
- Right:
  - Language switcher (globe → `en / uk / ru`)
  - Theme toggle (sun/moon → `light / dark / system`)
  - User avatar dropdown (name, email, Settings, Admin panel if admin, Sign out)
- Mobile: hamburger → `<Sheet>` with all items + user info

### Admin header

- Amber accent line (2-3px) at the very top
- `[Admin]` badge next to logo
- Primary nav: `Dashboard | Properties | Users | Landing`
- No language switcher
- User dropdown includes `Switch to user view` → `/dashboard`
- Same mobile pattern

---

## Site Map

```
(public)
├── /                  — CRM showcase + navigation to other pages
├── /about             — About the developer (minimal gateway page)
└── /project           — Technical deep-dive

(auth)
├── /auth/login        — OAuth login with "Remember me"
├── /auth/error        — Auth error page
└── /auth/demo         — Demo sign-in endpoint (no screen)

(app)
├── /dashboard                                    — Overview + charts
├── /properties                                    — Property card grid
├── /properties/new                                — Create property
├── /properties/[id]                               — Property detail (tabs)
├── /properties/[id]/edit                          — Edit property
├── /properties/[id]/services/new                  — Create service
├── /properties/[id]/services/[sid]                — Service detail
├── /properties/[id]/meters                        — Meters list
├── /properties/[id]/meters/[mid]                  — Meter detail + readings
├── /properties/[id]/sharing                       — Sharing tab
├── /bills                                         — Global bills list
├── /payments                                      — Global payments list
└── /settings                                      — Profile + preferences

(admin)  [URL prefix: /art-admin]
├── /art-admin                           — Admin dashboard
├── /art-admin/properties                — All properties (incl. soft-deleted)
├── /art-admin/properties/[id]           — Admin property detail
├── /art-admin/users                     — All users
├── /art-admin/users/[id]                — Admin user detail
└── /art-admin/landing                   — Landing CMS
```

---

## Shared Patterns

### Modal forms

All entity creation/editing uses modals, not dedicated pages. Used for:

- Submit Reading
- Add / Edit Bill
- Record / Edit Payment
- Invite person (sharing)
- Edit notes
- Confirmation modals (delete, leave, role change)

**Structure:**
- Header: title + close X
- Body: form content
- Footer: Cancel (left, `variant="outline"`) + Primary action (right, `variant="default"`)
- Width: `max-w-md` to `max-w-lg`
- Closes on Esc, outside click, or X
- First input auto-focused on open

### Data tables with filters

Used for: Bills list, Payments list, Admin properties, Admin users, etc.

**Structure:**
- Page header with title + count + primary action
- Filter bar: horizontal row of `<Select>` dropdowns + Clear filters link
- Table (TanStack Table + shadcn `<Table>` primitives)
  - Sortable column headers
  - Row hover state
  - Row click opens detail modal
  - Actions column with `⋮` dropdown
- Footer: aggregate total + pagination + per-page selector

**Mobile:** table collapses to card list. Filters move to bottom sheet.

**URL sync:** all filter state stored in searchParams for shareability and refresh-safety.

### Empty states

Two categories with different CTAs:

**First-time empty** ("nothing yet"):
- Icon (64px, muted)
- h3 "No X yet"
- Muted paragraph
- Primary CTA to create

**Filtered empty** ("no matches"):
- Different icon (filter/search-off)
- h3 "No X match your filters"
- Muted paragraph
- Secondary CTA to clear filters

### Type-to-confirm for destructive admin actions

For hard delete in admin, user types "DELETE" to enable button. Prevents accidental clicks.

### Rich tooltip on hover (charts)

Stacked bar charts use custom tooltips showing per-service breakdown + total. Right-aligned numbers for readability.

### Clickable legend filtering (charts)

Click on legend item hides that series. Active/inactive visual state. Enables user to isolate subsets without complex UI.

---

## Shared States

### Loading

Three levels:

1. **Page-level:** `loading.tsx` in App Router, skeleton screens
2. **Component-level:** `<Suspense>` boundaries with per-component skeletons
3. **Client action:** button shows spinner + "Submitting..." label

**Loading feedback duration policy:**
- <200ms: no skeleton (prevents flicker)
- 200ms–1s: skeleton with default styling
- >1s: skeleton + subtle pulse animation

Implemented via CSS `animation-delay: 200ms` on skeletons.

### Error

- **Expected errors** (validation, not found, forbidden): returned as typed `Result` from Server Actions, surfaced inline or as toast
- **Unexpected errors**: thrown in Server Components, caught by `error.tsx`, logged to Sentry
- **Error page UX:** icon + "Something went wrong" + [Try again] + [Go home]
- **Never shown:** stack traces, raw error messages

### Not found

- Global `app/not-found.tsx` + route-specific variants
- "Not found" pattern: icon + message + [Go home]
- Admin URL access by non-admin returns 404 (not 403) to hide existence

### Unauthorized

- Middleware redirects to `/auth/login?returnTo=<path>` for authenticated routes
- Toast notifies about session expiration before redirect
- After sign-in, redirects back to `returnTo`

### Toast notifications

- Library: `sonner`
- Position: bottom-right
- Duration: 4s default
- Used for: success confirmations, non-critical errors, background action feedback
- **Not used for:** form validation errors (inline), critical errors (error boundary)

---

## Core App Screens

### Dashboard (`/dashboard`)

**Purpose:** answer "Do I need to act?" → "What's my state?" → "How are trends?"

**Composition:**
1. **Attention block** (conditional) — amber-accented card with actionable alerts
2. **Balance summary** — total debt/overpayment + breakdown by property
3. **Charts section:**
   - URL-synced filters (Period / Property / Service)
   - **Pie chart** — expenses by service (proportions, 40-45% of widget width)
   - **Stacked bar chart** — monthly expenses with rich tooltip + clickable legend
   - **Line chart** with toggle:
     - **Expenses mode** (default) — multi-line, all services, Y in UAH
     - **Consumption mode** — single service selected, Y in physical units (kWh, m³)

**Default period:** Last 12 months.

**Async behavior:** money mode loaded with page; consumption mode loads on-demand via `<Suspense>` when user switches.

**Drill-down:** click on pie segment or bar → navigate to `/bills?service=X&period=Y`. Line chart uses tooltip, no drill-down click.

**Empty state (first-time user):** full-page welcome with "Add first property" CTA.

**Greeting:** "Hi, {firstName}" or fallback "Hello!"

### Properties list (`/properties`)

**Pattern:** card grid (1/2/3 columns responsive).

**Card contents:**
- Type icon + name
- Address
- Service count
- Balance (colored)
- Shared badge + role (for non-owners)
- [Open →] CTA (whole card clickable)

**Empty state:** welcome + [Add property] CTA.

### Property detail (`/properties/[id]`)

**Pattern:** tabs.

**Tabs:** Overview (default) | Meters (if metered services) | Sharing

**Page header:**
- Title (property name) + subtitle (address · N services · Created date)
- Actions: [Edit] [Share] [⋮]
- Actions hidden/disabled for viewers

**Overview tab:**
- Services list, one row per service
- Each row: icon + name + provider + last reading date + balance
- Row clickable → service detail
- [+ Add service] CTA

**Empty state:** "No services yet" + CTA.

### Service detail (`/properties/[id]/services/[sid]`)

**Pattern:** hybrid (single page with sections + drawers for history).

**Blocks:**
1. **Balance** — large number, breakdown, [View bills] [View payments]
2. **Current contract** — provider, since, account, tariff, payment details + [Update contract] [View history]
3. **Meter** (if metered) — serial, zones, last reading + [View meter] [Submit reading]
4. **Recent activity** — interleaved bills + payments
5. **Notes**

**Quick actions at bottom:**
- Metered: [Submit reading] (primary) + [Add bill] + [Record payment]
- Fixed: [Add bill] (primary) + [Record payment]

**Update contract flow:** modal with choice of what's changing (tariff / account / payment details / provider). Each choice opens appropriate form. System handles temporal logic (close old, open new).

**Contract history:** side drawer (`<Sheet>`) showing full timeline of contracts and nested temporal attributes.

### Service creation (`/properties/[id]/services/new`)

**Pattern:** wizard-style form with sections.

**Sections:**
1. Service type (card grid, metered/fixed determined automatically)
2. Initial contract (provider, start date, account number, payment details)
3. Initial tariff (rates for metered, fixed amount for fixed services)
4. Meter (optional checkbox; if checked, meter fields appear)

**Adaptive:** form changes based on service type (metered shows zones, fixed shows single amount).

### Meters list (`/properties/[id]/meters`)

**Sections:**
- **Active meters** (cards, always shown)
- **Historical meters** (collapsible section, hidden by default)

**Card contents:**
- Service icon + type + serial number
- Zones + installed date
- Last reading or "No readings yet"
- [View details →]

### Meter detail (`/properties/[id]/meters/[mid]`)

**Pattern:** single column scrolling (not split view).

**Sections top to bottom:**
1. Metadata (serial, zones, installed, notes)
2. Readings table with [+ Submit reading] button
3. Consumption chart (line chart of raw reading values; consumption per month is v2+)

**Readings table:**
- Columns: Date | Value (T1, T2, T3 if applicable) | Edit icon
- Click edit icon → Submit reading modal in edit mode
- Adaptive columns based on zone count

**Replace meter flow:** modal with date + new meter data. System closes old meter (validTo = replacement date), opens new (validFrom = replacement date), preserves reading history.

### Submit reading modal

Opens from: Meter detail (primary action), Service detail (quick action), Dashboard attention block.

**Fields:**
- Reading date (default: today)
- Value(s) per zone with "Last reading was X on date" hint
- Notes (optional)

**Zone layout:** side-by-side on desktop, stacked on mobile for 2+ zone meters.

**Value decrease warning:** non-blocking, amber-tinted hint if new value is lower than previous.

### Add meter form

Modal. Fields: service type (filtered to services without active meter), serial, zone count, installed at, active since, notes.

### Bills list (`/bills`)

**Purpose:** global list of all bills across properties with filters.

**Pattern:** data table with filters.

**Filters:** Property | Service | Period (default: Last 12 months) | Clear filters

**Table columns:** Date | Property | Service | Period | Amount | Actions

**Amount color:** `text-destructive` (bills are expenses).

**Footer:** Total (filtered) + pagination.

**Mobile:** card list with same info. Filters in bottom sheet.

**Empty states:**
- No bills at all: "Record your first bill" + CTA
- Filtered empty: "No bills match" + [Clear filters]

### Add bill modal

Opens from: /bills, Service detail, quick actions.

**Fields:**
- Property (preselected if opened from service detail)
- Service (filtered by selected property)
- Month (dropdown with recent months + Custom option)
- Amount with "Expected: X UAH" hint (computed from tariff/readings for metered, from fixedAmount for fixed)
- Notes

**Under the hood:** sets `periodStart` (first of month), `periodEnd` (last of month), `periodMonth` (first of month) automatically. Explicit custom ranges come in v2+.

### Payments list (`/payments`)

Structural copy of `/bills`. Differences:
- No "Period" column (payments are events, not ranges)
- Amount color: `text-green-600` (payments are income)
- Footer: "Total paid (filtered)"

### Record payment modal

Similar to Add bill but:
- Payment date (not month)
- "Current debt for this service: X UAH" hint (instead of expected amount)
- Amount validation: > 0

### Sharing tab

**Access:** via Property detail tab or `/properties/[id]/sharing`.

**Content:**
- List of users with access (cards)
  - Each card: avatar, name, email, role badge (dropdown for owners), metadata (joined/added by)
  - "You" indicator for current user
  - Actions vary by role matrix
- [+ Invite person] button below list

**Invite modal:**
- Email input
- Role radio (Viewer / Editor / Owner)
- Note: person must have an account

**Simplified flow (MVP):** access granted immediately if email matches existing user, no accept step.

**Role change:** confirmation toast before applying.

**Remove user / Leave property:** confirmation modal, destructive button.

**Last-owner protection:** explicit modal "Cannot leave as the last owner" with guidance.

**Subtle banner on first login after being invited:** "You have access to a new property: {name}".

### Settings (`/settings`)

Three sections, each with independent Save button.

1. **Profile:** name (editable), email (read-only, managed by Google), avatar (not editable in MVP)
2. **Preferences:** language, theme (light/dark/system), timezone (disabled in MVP, shows Europe/Kyiv)
3. **Account:** "Signed in with Google" + [Sign out of all devices]

---

## Admin Section

All admin screens use amber accent and `[Admin]` badge. URL prefix `/art-admin`.

### Admin dashboard (`/art-admin`)

- Stats row: 4 cards (Users / Properties / Bills / Soft-deleted items)
- Recent activity: last 20 actions across system

### Admin properties (`/art-admin/properties`)

**Purpose:** view all properties including soft-deleted. Perform recovery or hard delete.

**Filters:** Owner | Status (Active / Soft-deleted / All) | Type.

**Table columns:** Name | Owner(s) | Type | Status | Services | Created | Actions.

**Soft-deleted row styling:** opacity-60 + strikethrough on name + "Deleted" badge.

**Actions (active):** View details | Go to property.
**Actions (soft-deleted):** View details | Restore | Delete permanently.

**Hard delete confirmation:** type-to-confirm "DELETE" pattern.

### Admin property detail (`/art-admin/properties/[id]`)

Read-only view with admin-specific info (metadata, audit info).

For soft-deleted: banner at top with restore / hard delete actions.

### Admin users (`/art-admin/users`)

**View-only in MVP.**

**Table columns:** Email | Name | Role | Properties | Created | Last login | Actions.

**Actions:** View details (only).

### Admin user detail (`/art-admin/users/[id]`)

Read-only. Shows email, role, properties with access (clickable to filter admin properties).

### Admin Landing CMS (`/art-admin/landing`)

Single screen with 4 tabs: Home | About | Project | Global.

**Home tab:** hero title/description, 4 feature cards, 2 screenshot captions, tech highlights line.

**About tab:** hero greeting/description, "What I work with" content.

**Project tab:** hero title/description, 6 architecture highlights, current status text.

**Global tab:** external URLs (LinkedIn, GitHub, project repo, demo) + visibility toggles (About/Project × NavVisible/URLAccessible).

**Per-tab save** with unsaved changes protection.

**No preview in MVP.**

---

## Public Landing

Visual language: "Variant B" — shared design system with CRM, but more visual freedom (larger whitespace, subtle gradients allowed in hero, larger mockups, bigger typography in headings).

### `/` — CRM showcase

**Sections:**
1. **Hero** — title + 2-paragraph description, no CTA
2. **Screenshot showcase** — large Dashboard mockup with browser frame + caption
3. **Feature highlights** — 2×2 grid of 4 feature cards
4. **Second screenshot** — Property detail mockup + caption
5. **Tech highlights** — stack one-liner + [Project details →] link
6. **Footer** — navigation links to `/about`, `/project` (conditional on visibility) + copyright

### `/about` — minimal gateway

Three sections. Minimal content.

**Decisions:**
- Name: "Art" only (no surname)
- No level self-labeling (not "middle" or "senior")
- No full-stack mention (positioned as pure frontend)
- No contact information (email intentionally not shown)
- No "open to remote roles" signal
- Single contact path: LinkedIn (via "See more" section)

**Sections:**
1. **Hero** — "Hi, I'm Art." + role + location/format
2. **What I work with** — React, TypeScript, Next.js + domain specialty
3. **See more** — links to LinkedIn, GitHub, `/project`

### `/project` — technical deep-dive

**Sections:**
1. **Hero** — title, description, [View on GitHub →] CTA
2. **Stack at a glance** — two columns (Frontend / Backend), clickable items. Infrastructure intentionally omitted (status metadata, not core stack)
3. **Architecture highlights** — 6 cards (Next.js full-stack / PostgreSQL temporal / Drizzle / Auth.js / Ledger / Multi-tenant)
4. **Schema visualization** — text tree of main entities + link to full documentation
5. **Current status + roadmap** — current phase + v1 scope + v2+ preview + hosting one-liner
6. **Links / CTA** — GitHub, docs, About me

---

## Authentication

### Login (`/auth/login`)

Fullscreen centered card.

**Contents:**
- Logo + app name
- Title + subtitle
- [Continue with Google] primary CTA
- [ ] Remember me for 30 days
- "or" divider
- [Try demo →] secondary CTA
- Back to home link

### Auth error (`/auth/error`)

Same layout as login. Dynamic message based on `reason` query param.

[Try again] button + Back to home link.

### Demo endpoint (`/auth/demo`)

No UI. Server endpoint that creates a demo session and redirects to `/dashboard`.

### Sign out flows

- **Regular sign out:** one-click in user dropdown → clear session → redirect to `/`. No confirmation modal.
- **Sign out all devices:** from Settings, with confirmation modal.

### Return-to redirects

Unauthenticated access to protected route → redirect to `/auth/login?returnTo=<path>`. After sign-in, redirect back.

---

## Demo Mode

### Purpose

Allow HR / recruiters / potential collaborators to view the live CRM without creating their own account. Sample data pre-loaded.

### Access

Three entry points:
- [Try demo →] CTA on `/` landing
- [Try demo →] CTA on `/auth/login`
- [View live demo →] CTA on `/project`

All navigate to `/auth/demo` → create demo session → redirect to `/dashboard`.

### User experience

- **Persistent banner** at the top: "Demo mode · Sign in with Google for full access"
- **All UI controls visible** (no conditional hiding)
- **Mutations blocked:**
  - Backend: Server Actions reject with `DEMO_MODE_BLOCKED` error
  - Frontend: intercepts the error and shows friendly modal instead of generic error
- **Modal content when trying a blocked action:** "Demo mode. To try this, sign in with your own Google account." + [Got it] + [Sign in with Google →]
- **Sharing mutations:** also blocked (view-only)
- **Sign out** from demo → redirect to `/` (public landing)

### Demo data

- Seeded **once at initial deploy**
- 3 properties (apartment, house, cottage) with varied services
- Realistic bills, payments, readings spanning ~12 months
- Tariffs with temporal history (demonstrates senior feature)
- One additional demo user as editor on one property (demonstrates sharing UI read-only)
- No nightly re-seed in MVP

### Demo user identity

- Email: `demo@art-crm.local` (or similar fake domain)
- `systemRole: 'user'`
- Standard auth flow internally (same Auth.js session), just bypassing OAuth

---

## Cross-cutting UX Decisions

### Money color coding

- Debt / expenses (negative): `text-destructive` (red-ish)
- Payments / overpayment (positive): `text-green-600` (green-ish)
- Zero: neutral

Applied consistently in balances, bill amounts, payment amounts, summaries.

### Date display

- Short format ("Oct 15, 2024") in lists, tables, headers
- Full format ("October 15, 2024") only where legally/contextually important
- Relative ("Last reading: 5 days ago") avoided — may confuse across timezones

### Currency

- UAH only in MVP (hardcoded)
- Right-aligned in tables, tabular-nums font feature for vertical alignment

### Navigation behavior

- Breadcrumbs: only on deep pages (level 2+)
- Back button: always through breadcrumbs, not browser back
- "You have unsaved changes" prompts on form navigation

### Forms

- Required fields marked with asterisk
- Inline validation errors below fields
- Server-side validation always performed (client validation is UX only)
- First-input auto-focus in modals
- Submit button disabled during submission with spinner

### Accessibility baseline

- Semantic HTML
- Keyboard navigation works throughout
- ARIA attributes where needed
- Not targeting WCAG AAA, but not ignored either

### Internationalization

- All user-facing strings via `t('key')` from next-intl
- Three languages: en (default), uk, ru
- Cookie-based strategy (URL unchanged between languages)
- Landing pages English-only in MVP

---

## Deferred Features

Documented here so they're not lost for future phases.

### Visual / UX features deferred to v2+

- Dashboard charts: consumption per month (currently raw line values)
- Stacked / Grouped toggle for bar charts (explicitly decided NOT to include)
- Export chart as PNG / data as CSV
- Preview mode in Landing CMS
- Draft / Published states for CMS
- Section reordering in CMS
- Multi-language landing content
- Rich text formatting in CMS
- Offline mode detection banner
- Recent activity widget on Dashboard

### Domain features deferred to v2+

- Email / password authentication
- Telegram notifications for deadlines and debts
- Google Drive integration for bill photos
- Custom user-defined services
- Accept/decline invitation flow
- Device-level session management (list of active sessions, revoke specific)
- Structured payment_details fields (IBAN, bank, recipient)
- Bill components (debt, overpayment, recalculation) for provider reconciliation

### Admin features deferred to v2+

- User blocking / suspension
- Password reset / force logout
- Admin role assignment via UI (currently via env variable)
- Bulk operations
- Audit log viewer
- System health monitoring
- Growth charts (users / properties / bills over time)

### Infrastructure deferred to v3+

- Mobile app
- Public integration API
- Email bill parsing
- OCR for scanned bills
- Provider API integrations
- Multi-currency
- Full-text search
- Data export (CSV / Excel / PDF)

---

## Iteration Progress

### Claude Design visualized

**Iteration 1 (complete):**
- Dashboard — full data state, empty state, dark mode
- Properties list — full and empty states
- Property detail — Overview tab with services, empty state
- Accent color chosen: Violet

**Iteration 1.1 refinements (applied):**
- Card shadows in light mode / borders in dark mode
- Pie chart resized to 40-45% with compact legend
- Stacked bar chart with rich tooltip + clickable legend

**Iteration 2 (partial):**
- Submit Reading modal (single-zone)
- Submit Reading modal (two-zone)
- Bills list with data (156 records)

**Iteration 3 (complete):**
- Service detail — metered electricity with full layout: balance, current contract (two-zone tariff), meter card, recent activity, notes, quick actions
- Update contract modal — "what's changing" radio selector with "Tariff changed" expanded form
- Contract history drawer — timeline of contract eras with nested tariff periods
- Light and dark mode for the main view

**Iteration 4 (complete):**
- Sharing tab — owner's view with three users (owner, editor, viewer)
- Sharing tab — editor's view (role matrix demonstrated via paired comparison)
- Invite modal — email + role radio (Viewer / Editor / Owner)
- Last-owner protection modal — guidance without destructive action
- Remove user confirmation modal — standard destructive confirm pattern
- Light mode only

**Iteration 5 (complete):**
- Login — Google OAuth, Remember me, Try demo, Back to home
- Auth error — "Sign-in didn't complete" variant (access_denied scenario)
- Both screens in light and dark mode
- Shared `(auth)` route group layout established

### Design decisions from iterations 3–5

These decisions emerged during visualization and are locked for implementation. Not previously in the main document body.

- **Legal footer note below auth card** ("By signing in you agree to Terms of Service and Privacy Policy") — added to Login layout during iter 5.
- **Google `G` icon does not invert in dark mode** — brand guideline. The Google button keeps its light background with brand colors even when the rest of the page is dark.
- **Contract history timeline uses visual nesting** (indent + lighter visual weight) to show tariff periods inside provider eras — confirmed pattern for displaying temporal data with nested attributes.
- **Sharing role matrix is expressed through action visibility** (buttons appear/disappear), not disabled states. Editors and viewers don't see management controls at all, rather than seeing greyed-out ones.
- **Paired comparison proved more valuable than theme variants** for role-sensitive screens. When we get to admin vs regular views, use the same approach — show the same screen from different user perspectives rather than light/dark variants.

### Deferred visualizations

Remaining after iterations 3–5:

- Bills empty states
- Add Bill modal
- Meter detail + readings (+ Replace meter modal)
- Payments screens — intentionally covered by description rather than a separate mockup (structural copy of Bills with documented differences)
- Settings
- Admin screens (amber accent application across dashboard, properties, users, landing CMS)
- Landing `/`, `/about`, `/project` — "Variant B" visual language, visually unverified
- CMS admin

**Closed by iterations 3–5:** Service detail, Sharing tab + invite modal, Login screen + error.
