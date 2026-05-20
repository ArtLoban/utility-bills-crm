# Design Brief — Iteration 8a (Admin: foundation + Properties)

Opens the Admin section. Establishes the amber accent treatment, paired comparisons against user-facing views, and the patterns for soft-deleted records and destructive admin actions.

**Continuation of Iterations 1–7c.** Visual language is locked: shadcn New York, Zinc base, Violet primary accent, Inter typography, 0.5rem radius, light + dark modes. **Admin section adds amber accent** for visual distinction.

---

## Deliverables expected from this iteration

Please generate these one at a time, pausing between each for feedback:

1. Admin dashboard (light mode)
2. Properties list — paired comparison: **user card grid (left) vs admin table (right)**
3. Admin property detail — soft-deleted property (with restore + hard delete banner)
4. Property detail — paired comparison: **user view (left) vs admin view (right)** of the same active property
5. Hard delete confirmation modal (type-to-confirm "DELETE" pattern)

Dark mode for Admin dashboard — generate only if budget allows after the rest is done.

Mobile variants — optional. Admin section is desktop-first by intent (it's data-dense oversight, not on-the-go).

**Single-variant rule:** generate one version of each screen. No side-by-side comparisons except where explicitly listed as "paired comparison" — in those cases, the comparison **is** the deliverable, both panels in one rendered artifact.

---

## Visual language for Admin section

This is the **first iteration where admin chrome is rendered**. The treatment must be consistent across all admin screens in 8a, 8b, 8c.

### Admin header

Same base structure as the app header, with two distinguishing additions:

- **Amber accent line** at the very top — full-width, 2–3px tall. Color: `bg-amber-500` (or `bg-amber-600` if 500 looks too soft against the rest of the chrome). This is the visual anchor that says "you are in admin".
- **`[Admin]` badge** next to the logo + wordmark on the left. Use shadcn `<Badge>` with `variant="outline"` styled in amber: amber border, amber text, no background fill in light mode; in dark mode it can have a faint amber-tinted background.
- **Primary nav** changes for admin: `Dashboard | Properties | Users | Landing` (no Bills, no Payments, no Settings — those don't make sense in admin).
- **Right side:** no language switcher. User dropdown includes a `Switch to user view` option that points at `/dashboard`.

The amber treatment should feel like a quiet, confident "you have powers here" — not "you are in danger". It's a context signal, not a warning.

### Admin URL prefix

All admin routes are under `/art-admin`. Render this in breadcrumbs and any visible URL bars on mockups (when browser-frame is shown). For example: `art-admin / properties / Main apartment`.

### When to use the amber accent beyond the header

- Any admin-only badge or callout: amber border + amber text.
- Destructive admin actions: still use `variant="destructive"` (red) for the action button itself. The amber is for context, not for danger.
- Soft-deleted indicators: NOT amber. Soft-deleted uses muted/strikethrough treatment (defined below).

---

## Screen 1: Admin dashboard

URL: `/art-admin`. Landing page when admin enters the admin section.

**Page header:**

- Title (h1): **Admin dashboard**
- Subtitle (muted): `System-wide overview.`

**Body:** two stacked sections.

### Section 1 — Stats row

A 4-column grid of stat cards. On tablet, 2×2; on mobile, 1 column.

Each card: small icon top-left, big number, label below, optional trend indicator (skip the trend in MVP — these are absolute counts, not deltas).

**Card 1 — Users**

- Icon: `Users`
- Number: `12`
- Label: Total users

**Card 2 — Properties**

- Icon: `Home`
- Number: `28`
- Label: Active properties

**Card 3 — Bills**

- Icon: `Receipt`
- Number: `1,847`
- Label: Bills recorded

**Card 4 — Soft-deleted**

- Icon: `Archive`
- Number: `7`
- Label: Soft-deleted items
- Icon color: `text-amber-600` (the only card with non-default icon color — subtle signal that this is "what admin specifically deals with")

Cards: same `<Card>` component as the rest of the app. Numbers in `text-3xl font-semibold tabular-nums`.

### Section 2 — Recent activity

Section heading: **Recent activity** with a small muted note: `Last 20 actions across the system.`

Below: a simple feed of activity rows. Each row:

- Small icon on the left (semantic: `UserPlus` for new user, `Trash2` for soft delete, `RotateCcw` for restore, `Receipt` for bill recorded, `KeyRound` for sharing change, etc.)
- Middle: action description
- Right: relative timestamp in muted text

Render 8–10 rows of realistic activity:

> **New user joined** — alex.kovalenko@example.com signed in with Google · 12 minutes ago
> **Property created** — Olena Petrenko added "Summer cottage" · 47 minutes ago
> **Property soft-deleted** — Mykhailo Tkachenko removed "Old apartment" · 2 hours ago
> **Bill recorded** — Art Loban recorded electricity bill for Main apartment · 3 hours ago
> **Sharing changed** — Olena Petrenko added Iryna Petrenko as editor on "Summer cottage" · 5 hours ago
> **Property restored** — Admin restored "Vacation house" · yesterday
> **Property created** — Iryna Shevchenko added "Studio downtown" · yesterday
> **Bill recorded** — Mykhailo Tkachenko recorded gas bill for Family home · 2 days ago

Use Ukrainian-flavored names (Olena, Mykhailo, Iryna, Bohdan, Kateryna) — this is a Ukrainian product, the data should feel Ukrainian.

Each row hoverable, but not clickable in MVP (we're not yet building activity drill-downs).

---

## Screen 2: Properties list — paired comparison

**This is one rendered artifact with two panels side-by-side.** Left panel: user view at `/properties`. Right panel: admin view at `/art-admin/properties`. Same data shown two ways.

The point of the comparison: the two views are different products built on the same data. User cares about "my properties at a glance"; admin cares about "all properties, with status, including the deleted ones".

### Left panel — User view (`/properties`)

This view exists from Iteration 1, **just for visual reference.** Don't redesign it.

- Header: `Properties` h1 + `[ + Add property ]` button on the right
- 3-column card grid. 4 cards visible.
- Each card: type icon + name + address + service count + balance + (where applicable) Shared badge + role
- Cards are owned by "Art Loban" — this is the user's personal view, scoped to what they have access to.

Render with:

1. Main apartment (4 services, balance: 2,184 UAH owed)
2. Summer cottage (2 services, balance: 0)
3. Family home (5 services, balance: 350 UAH overpaid, "Shared · Editor" badge)
4. Studio downtown (3 services, balance: 1,420 UAH owed)

### Right panel — Admin view (`/art-admin/properties`)

The admin equivalent. Different paradigm: a **table**, not a card grid.

**Header:**

- Title (h1): **All properties**
- Subtitle (muted): `28 active · 7 soft-deleted`
- Right: filter pills (not actions): `[ Owner: All ▾ ]` `[ Status: All ▾ ]` `[ Type: All ▾ ]`

**Table columns:**

| Name               | Owner(s)              | Type      | Status      | Services | Created  | Actions |
| ------------------ | --------------------- | --------- | ----------- | -------: | -------- | ------- |
| Main apartment     | Art Loban             | Apartment | Active      |        4 | Mar 2024 | ⋮       |
| Summer cottage     | Olena Petrenko        | Cottage   | Active      |        2 | Apr 2024 | ⋮       |
| ~~Old apartment~~  | Mykhailo Tkachenko    | Apartment | **Deleted** |        3 | Jan 2024 | ⋮       |
| Family home        | Iryna Shevchenko (+1) | House     | Active      |        5 | Jun 2024 | ⋮       |
| Studio downtown    | Bohdan Kovalenko      | Apartment | Active      |        3 | Aug 2025 | ⋮       |
| ~~Vacation house~~ | Kateryna Lysenko      | House     | **Deleted** |        4 | Feb 2024 | ⋮       |
| Sea-view condo     | Olena Petrenko        | Apartment | Active      |        3 | Sep 2025 | ⋮       |
| Forest cabin       | Mykhailo Tkachenko    | Cottage   | Active      |        2 | Oct 2024 | ⋮       |

8 rows total: 6 active, 2 soft-deleted (mixed). Render the soft-deleted state with **opacity-60 + strikethrough on the name + a "Deleted" `<Badge variant="outline">` in the Status column with muted/destructive coloring**.

**Owner column:** for properties with multiple owners, show "Iryna Shevchenko (+1)" — the +N indicates additional owners.

**Actions column (`⋮` overflow):**

- For active rows: `View details`, `Go to property` (opens user view at `/properties/[id]`)
- For soft-deleted rows: `View details`, `Restore`, `Delete permanently`

Note: in this paired comparison, render the panel header chrome too — the user panel has the regular app header (no amber, violet accent on active nav link), the admin panel has the amber line + `[Admin]` badge + admin nav. The visual distinction between the two should be **immediately clear from the chrome alone**.

### Layout note

The two panels can be stacked vertically if side-by-side becomes too cramped at the rendering width. In that case: user view on top with a clear separator + label, admin view below with another label. Whatever reads cleaner.

---

## Screen 3: Admin property detail — soft-deleted

URL: `/art-admin/properties/[id]`. Property: "Old apartment" (Mykhailo Tkachenko's, soft-deleted).

**Page chrome:** admin header with amber line + `[Admin]` badge.

**Breadcrumbs:** `art-admin / properties / Old apartment`

**Top of page — destructive banner.** Render before the page header. A prominent `<Alert>` styled with destructive coloring (amber-tinted is wrong here — this is an actual recoverable-or-final-action state). Use:

- Icon: `Trash2` (or `AlertCircle`)
- Title: **This property is soft-deleted**
- Body: `Soft-deleted on March 12, 2026. The owner sees this property as gone. You can restore it or delete it permanently.`
- Actions on the right of the banner: `[ Restore ]` (`variant="outline"`) + `[ Delete permanently ]` (`variant="destructive"`)

**Page header (below banner):**

- Title (h1): **Old apartment** — with strikethrough on the name itself, opacity-70 on title color
- Subtitle (muted): `Apartment · Kyiv, Velyka Vasylkivska 142, apt 7 · 3 services`

**Body:** two stacked cards.

### Card 1 — Property info

Read-only label/value grid. Two columns on desktop.

- **Owner(s):** Mykhailo Tkachenko
- **Type:** Apartment
- **Address:** Kyiv, Velyka Vasylkivska 142, apt 7
- **Services:** 3 (Electricity, Cold water, Internet)
- **Created:** January 8, 2024
- **Last activity:** February 28, 2026
- **Soft-deleted at:** March 12, 2026
- **Soft-deleted by:** Mykhailo Tkachenko (the owner)

No edit buttons. No action menu on individual fields.

### Card 2 — Sharing snapshot

Read-only list of users who had access at the time of soft-delete:

- Mykhailo Tkachenko · Owner
- Tetiana Tkachenko · Editor

Small note below: `These users no longer see this property. Restoring it brings access back.`

### Bottom of page — small admin metadata

A muted footer block below the cards:

> Property ID: `prop_2hX9kL3mNqRtY7vBcZ`
> Internal record. For support reference only.

`text-xs text-muted-foreground font-mono` for the ID.

---

## Screen 4: Property detail — paired comparison

**Same property in both panels: "Main apartment" (active, owned by Art Loban).** Side-by-side comparison of how user and admin see the same property.

### Left panel — User view (`/properties/[id]`)

This view exists from Iteration 1 (Property detail with Overview tab). **Don't redesign it.**

- Regular app header (violet accent, no amber)
- Tabs visible: Overview (active) | Meters | Sharing
- Page header: "Main apartment" + subtitle + actions (`[Edit]`, `[Share]`, `[⋮]`)
- Overview tab content: services list with balances, `[+ Add service]` CTA at bottom

### Right panel — Admin view (`/art-admin/properties/[id]`)

Same property, admin paradigm.

**Page chrome:** admin header (amber + badge).

**Breadcrumbs:** `art-admin / properties / Main apartment`

**Page header:**

- Title (h1): **Main apartment**
- Subtitle (muted): `Apartment · Kyiv, Velyka Vasylkivska 142, apt 7 · 4 services · Active`
- Right side: NO action buttons. Admin doesn't edit content; admin observes.

**No tabs** — admin view is one scrollable page, not tabbed. Tabs are a user-affordance for "switch what I'm working on"; admin sees everything at once. This is a deliberate divergence from the user view.

**Body:** four stacked cards.

#### Card 1 — Property info (admin metadata)

Read-only grid, slightly more detailed than user view:

- **Owner(s):** Art Loban (the only owner)
- **Type:** Apartment
- **Address:** Kyiv, Velyka Vasylkivska 142, apt 7
- **Services:** 4
- **Created:** March 8, 2024 by Art Loban
- **Last activity:** April 18, 2026
- **Status:** Active

#### Card 2 — Services

Read-only list of services on the property. Each row: icon + name + provider + last reading date + balance. Same layout as user's Overview tab, **but without** the row-click navigation and without the `[+ Add service]` CTA. Admin observes; admin doesn't add services on behalf of a user.

Render 4 services:

- Electricity · DTEK Kyiv Electric Networks · last reading Apr 15 · 1,210 UAH owed
- Cold water · Kyivvodokanal · last reading Apr 15 · 0
- Gas · Kyivgaz · last reading Apr 15 · 974 UAH owed
- Internet · Kyivstar · — · 0

#### Card 3 — Sharing snapshot

Read-only list of users with access:

- Art Loban · Owner
- Olena Loban · Editor

Note: `Sharing changes are made by the owner, not by admin.`

#### Card 4 — Audit info

Same admin metadata footer as Screen 3:

> Property ID: `prop_4kP2nQ8tBxYwM5vZdR`
> Internal record. For support reference only.

### What the comparison should make obvious

- Different chrome (violet vs amber accent)
- Different paradigm (tabs vs single scroll)
- Different action surface (user has Edit/Share/⋮, admin has nothing — observation only)
- Different metadata (admin sees creation history, audit info, sharing snapshot)
- Same content (services, balances) — admin doesn't see hidden user data, just additional context

This paired comparison is the **clearest visible argument** for the architectural decision that "admin is a different product on the same data, not a permissions-flipped version of the user app".

---

## Screen 5: Hard delete confirmation modal

Triggered from the `[ Delete permanently ]` button on the soft-deleted property banner (or from the row's `⋮` menu in the admin properties list).

**Modal structure:**

- Header: title **Delete property permanently** with destructive-toned icon (`AlertTriangle` in `text-destructive`)
- Body: form
- Footer: `[ Cancel ]` (left, `variant="outline"`) + `[ Delete permanently ]` (right, `variant="destructive"`, **enabled in this mockup because the input is filled**)
- Width: `max-w-md`

**Body content:**

Block 1 — what's about to happen, in plain text:

> You're about to permanently delete **Old apartment** (owned by Mykhailo Tkachenko). This deletes 3 services, 47 readings, 18 bills, and 14 payments forever.
>
> External files (if any) won't be touched — we don't own them.
>
> **This cannot be undone.**

Property name in `font-semibold`. The "This cannot be undone" line in `text-destructive font-medium`.

Block 2 — type-to-confirm gate:

> To confirm, type `DELETE` below.

A text input below. **In the mockup, render the input filled with `DELETE`** so the enabled state of the button is visible. This is the mockup's "moment of truth" frame — the system has accepted the input and the destructive action is one click away.

The text input gets a subtle success border (or inline checkmark icon) when the value matches.

---

## Out of scope for this iteration

- Bulk operations (post-MVP)
- Audit log viewer (post-MVP — Recent activity is just the last 20)
- Filtering/searching the activity feed
- Restore confirmation modal (simpler than hard delete, can be inferred)
- Soft-deleted property detail when hard delete is clicked but cancelled (same screen, no state change)
- Admin notifications / banners on the user side ("an admin viewed your property") — we don't do this

---

## Final note

8a sets three visual patterns that 8b and 8c will reuse:

1. **Admin chrome** (amber line, badge, admin nav) — identical in 8b and 8c.
2. **Soft-deleted treatment** (opacity + strikethrough + Deleted badge in lists, destructive banner on detail) — same patterns used for users in 8b if applicable.
3. **Type-to-confirm** for irreversible admin actions — only place this appears in MVP is hard-delete property; mention here for the record.

The two paired comparisons (Properties list, Property detail) are the most expensive items in this brief — they're worth it. They're the visible, takeaway-worthy demonstration of "user app and admin section are different products built on the same data, not the same product with permission flags".
