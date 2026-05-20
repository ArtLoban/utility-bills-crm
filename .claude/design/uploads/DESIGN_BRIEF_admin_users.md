# Design Brief — Admin Users (list + detail)

Two screens for the Admin section: Admin users list + Admin user detail. Both read-only in MVP.

## CRITICAL — visual language

This project has an established visual language from **Iterations 1–7**. Those early iterations are the **accepted stylistic foundation** of the project — Zinc base palette, Violet primary accent, Inter typography, 0.5rem radius, shadcn New York components, light + dark modes.

**You must follow the Iteration 1–7 templates and visual style.** Do not invent a new style. Match the existing screens: same card treatment (thin border + subtle `shadow-sm` in light, border in dark), same table styling, same badges, same spacing rhythm, same header structure.

The Admin section adds one distinguishing element on top of that base: **amber accent chrome** — a 3px amber line at the very top of the page, an `[Admin]` badge next to the logo, and amber underline on the active nav item. Everything else is identical to the regular app.

## Deliverables

Generate one at a time, pausing for feedback between each:

1. Admin users list — light mode
2. Admin users list — dark mode
3. Admin user detail — light mode
4. Admin user detail — dark mode

**Single-variant rule:** one version of each screen. No side-by-side comparison alternatives.

Mobile: the users list must collapse to a card list on mobile (the table is too wide). User detail stacks predictably. Show the mobile layout for the users list at minimum.

---

## Admin chrome (both screens)

The admin header, consistent with the already-built admin pages:

- 3px amber line (`#f59e0b`) full-width at the very top.
- Logo mark + "UtilityBills" wordmark on the left.
- `[Admin]` badge — pill shape, amber border, amber text, no fill (light mode); faint amber-tinted fill (dark mode).
- Nav: `Dashboard | Properties | Users | Landing`. Active item (`Users` on both these screens) has an amber underline.
- Right side: user name + avatar. No language switcher.

Admin pages use a content max-width around 900–1100px, centered.

---

## Screen 1: Admin users list

URL: `/art-admin/users`

### Page header

- Title (h1): **All users**
- Subtitle (muted): `12 users · 1 admin`
- Right side: two filter pills — `Role: All ▾` and `Status: All ▾`.

### Table

Columns: **Email | Name | Role | Properties | Created | Last login | Actions**

Render these 12 rows:

| Email                          | Name               | Role  | Properties | Created        | Last login     |
| ------------------------------ | ------------------ | ----- | ---------- | -------------- | -------------- |
| art.loban@example.com          | Art Loban          | Admin | 3          | Mar 2024       | 2 minutes ago  |
| olena.loban@example.com        | Olena Loban        | User  | 1          | Mar 2024       | 12 minutes ago |
| olena.petrenko@example.com     | Olena Petrenko     | User  | 2          | Apr 2024       | 1 hour ago     |
| mykhailo.tkachenko@example.com | Mykhailo Tkachenko | User  | 2          | Jan 2024       | 3 hours ago    |
| iryna.shevchenko@example.com   | Iryna Shevchenko   | User  | 1          | Jun 2024       | yesterday      |
| bohdan.kovalenko@example.com   | Bohdan Kovalenko   | User  | 1          | Aug 2025       | yesterday      |
| iryna.petrenko@example.com     | Iryna Petrenko     | User  | 1          | Apr 2024       | 2 days ago     |
| tetiana.tkachenko@example.com  | Tetiana Tkachenko  | User  | 1          | Jan 2024       | 1 week ago     |
| nataliia.boyko@example.com     | Nataliia Boyko     | User  | 0          | Nov 2025       | 3 weeks ago    |
| dmytro.savchenko@example.com   | Dmytro Savchenko   | User  | 0          | Sep 2025       | 1 month ago    |
| kateryna.lysenko@example.com   | Kateryna Lysenko   | User  | 0          | Feb 2024       | 4 days ago     |
| alex.kovalenko@example.com     | Alex Kovalenko     | User  | 0          | 12 minutes ago | 12 minutes ago |

### Column behavior

- **Email** — primary identifier, `font-medium`. Sortable. (Email is what the OAuth model trusts as identity — stable and unique; name comes from Google and can change.)
- **Name** — secondary, default weight.
- **Role** — a `<Badge>`. `Admin` uses the amber-tinted variant (amber border, amber text — same treatment as the `[Admin]` chrome badge). `User` is plain — muted text or a low-key secondary badge.
- **Properties** — right-aligned, tabular numerals. A `0` is rendered in muted color (signals "registered, no properties yet").
- **Created / Last login** — muted, smaller text. Relative format for last login.
- **Actions** — `⋮` overflow menu. In MVP only one item: `View details`.

Default sort: by Last login, most recent first.

Row click opens `/art-admin/users/[id]`.

### Footer

Standard table footer: left side `12 users`, right side pagination (`1 / 1` — all fit on one page).

### Mobile

Table collapses to a card list. Each card: Email as the prominent line, Name below it, Role badge, then a muted line `3 properties · joined Mar 2024 · last seen 2 minutes ago`. Actions menu in the card corner.

---

## Screen 2: Admin user detail

URL: `/art-admin/users/[id]`

Render for **Olena Petrenko** — a regular user who owns two properties.

### Breadcrumbs

`art-admin / users / Olena Petrenko`

### Page header

- Title (h1): **Olena Petrenko**
- Subtitle (muted): `olena.petrenko@example.com · User · Joined April 2024`
- No action buttons on the right. This is a read-only observation view.

### Card 1 — User info

A card with a label/value grid (two columns on desktop, one on mobile). Same `InfoGrid` style as the Admin property detail screen — uppercase muted labels, value below.

- **Email:** olena.petrenko@example.com
- **Name:** Olena Petrenko
- **System role:** User
- **Created:** April 12, 2024
- **Last login:** 1 hour ago
- **Auth provider:** Google
- **Avatar:** small inline avatar (32px) next to the text `From Google`

No edit controls.

### Card 2 — Properties

Card with a heading **Properties** and a small muted note: `2 properties accessible to this user.`

A compact list, one row per property:

- Type icon (lucide — `Building` / `Home` / `Trees` style)
- Property name — clickable, links to `/art-admin/properties/[id]`
- Role badge (`Owner` / `Editor` / `Viewer`)
- Muted metadata: service count · status

Two rows:

- **Summer cottage** — `Owner` — 2 services · Active
- **Sea-view condo** — `Owner` — 3 services · Active

### Card 3 — Audit info

Same treatment as the Admin property detail footer:

`User ID: usr_8nQpL3kMtYx2vBcZdR5h` — in mono font, muted.
Below it, muted: `Internal record. For support reference only.`

---

## What is deliberately NOT on these screens

- No block / suspend / delete user actions (post-MVP).
- No role-change control (admin role is env-assigned in MVP, never via UI — a deliberate security decision).
- No password reset / send email (auth is fully Google-delegated; we don't own credentials).
- No per-user activity log (the dashboard's system-wide activity feed covers this in MVP).
- No bulk actions.

These absences are intentional — the screens read as "admin observes; admin does not fake control over things the system doesn't own".

---

## Out of scope

- Admin variant of the user detail page (structurally identical, only the Role badge differs — can be inferred).
- User detail with zero properties (same screen, Card 2 shows an empty state — inferred from existing empty-state patterns).
- Functional filter dropdowns (filter pills are shown as static UI in this iteration).
