# Design Brief — Utility Bills CRM (Iteration 1)

Brief for Claude Design covering the first three screens: **Dashboard**, **Properties list**, **Property detail**. Goal of this iteration: establish the visual language, pick the accent color, and validate the layout patterns on real screens.

---

## Project context

Multi-tenant web application for tracking utility bills across multiple properties (apartments, houses, cottages). Users log meter readings, record bills and payments, see balances and consumption analytics.

Target user for screens in this brief: authenticated user with 2–3 properties, managing electricity / gas / water / heating / internet / etc.

---

## Design system base

- **Component library:** shadcn/ui, **New York** style
- **Styling:** Tailwind CSS v4
- **Base palette:** **Zinc** (neutral grays)
- **Primary accent color:** **TBD — decide during this iteration.** Please generate 2–3 variants to compare. Candidates: Indigo, Violet, Teal. Criteria: professional, modern, CRM-appropriate, not generic "Facebook blue."
- **Admin accent (reserved for admin section, not in this iteration):** Amber
- **Typography:** Inter
- **Radius:** 0.5rem (shadcn default)
- **Theme:** support light and dark modes
- **Density:** medium (shadcn default)

### Key principle

This is a **serious product for senior-level portfolio**. Polished, restrained, professional. Not playful. Not "SaaS landing page happy". Should look at home next to tools like Linear, Raycast, Vercel dashboard.

---

## Layout conventions (all screens)

- **Max content width:** `max-w-screen-2xl` (~1536px) for authenticated app
- **Horizontal padding:** `px-4` mobile, `sm:px-6` tablet, `lg:px-8` desktop
- **Top bar:** sticky, `h-16` desktop / `h-14` mobile, `bg-background/80 backdrop-blur`, `border-b`
- **Page header:** non-sticky, contains title (h1/h2) + optional subtitle + optional actions aligned right
- **Vertical rhythm:** sections separated by `gap-8` or `space-y-8`
- **Cards:** shadcn `<Card>` with standard padding (`p-6`)
- **No footer** in authenticated zones

---

## Adaptive header (authenticated app variant — used in this iteration)

```
Desktop:
┌────────────────────────────────────────────────────────────────┐
│ UtilityBills  │  Dashboard  Properties  Bills  Payments       │
│               │  Settings                              🌐 🌙 👤│
└────────────────────────────────────────────────────────────────┘

Mobile:
┌──────────────────────────────────┐
│ UtilityBills               ≡     │
└──────────────────────────────────┘
```

### Structure

- **Left:** Logo + app name (clickable → /dashboard)
- **Center:** Primary nav — active link has subtle underline (2px, accent color) + `text-foreground`; inactive links `text-muted-foreground hover:text-foreground`
- **Right side:**
  - Language switcher (globe icon → dropdown: English, Українська, Русский)
  - Theme toggle (sun/moon icon → dropdown: Light, Dark, System)
  - User avatar dropdown

### User avatar dropdown contents

```
[Avatar] Anna Loban
         anna@example.com
────────────────────────────
⚙  Settings
────────────────────────────
🚪 Sign out
```

Avatar uses `<Avatar>` with fallback to initials if no Google profile image.

### Mobile

Hamburger opens a `<Sheet>` from the right containing: user info → nav links → language → theme → sign out.

---

## Screen 1: Dashboard (`/dashboard`)

**Purpose:** Answer three user questions within 5 seconds of landing: "Do I need to do something?" → "What's my state?" → "How are trends?"

### Page header

```
Hi, Anna
```

Simple h2, no actions. If user's name isn't available: "Hello!".

### Composition (top to bottom)

#### 1. Attention block — conditional

Shown only when there are debts or pending actions. Hidden completely when everything is fine.

Visual: shadcn `<Card>` with amber-tinted left border (4px, `border-l-4 border-amber-500`). Icon: `AlertTriangle` from lucide.

```
⚠️ Attention required

• Debt: 1,240 UAH total (2 services)
  [ View details → ]

• Submit readings by Oct 25 (3 meters)
  [ Go to meters → ]
```

Each bullet is an actionable item. Inline CTAs are subtle links, not buttons.

#### 2. Balance summary — always shown

Two-level summary. shadcn `<Card>`.

```
Current balance
─────────────────────────────────────────

Total debt              Total overpayment
-1,240 UAH              +350 UAH
across 2 services       across 1 service

─────────────────────────────────────────
By property

🏠 Apartment on Main St        -890 UAH  →
🏠 Mom's apartment             -350 UAH  →
🏕️ Summer house                +350 UAH  →
```

**Color coding:**

- Debt (negative): `text-destructive`
- Overpayment (positive): `text-green-600` (or equivalent success color)
- Zero: neutral

Property rows are fully clickable (hover state), navigate to `/properties/[id]`.

#### 3. Charts section

**Filters bar** (sticky within this section? — decide visually):

- Period dropdown: Current month / Last 3 / Last 6 / **Last 12 (default)** / All time / Custom range
- Property dropdown: All / specific / multi-select
- Service dropdown (only affects line chart in consumption mode)

Filters are URL-synced (e.g. `?period=6m&property=abc`).

**Chart grid layout:**

```
Desktop (md+):
┌─────────────────────┬─────────────────────┐
│                     │                     │
│ Pie Chart           │ Stacked Bar Chart   │
│ Expenses by service │ Monthly expenses    │
│                     │                     │
├─────────────────────┴─────────────────────┤
│                                           │
│ Line Chart                                │
│ Consumption trend                         │
│ [ Expenses (₴) ] [ Consumption (physical)]│
│                                           │
└───────────────────────────────────────────┘

Mobile: all stacked single column
```

**Chart 1: Pie — "Expenses by service"**

- Proportions of spending across services in selected period
- Legend on side (desktop) / below (mobile)
- Hover → amount + percentage

**Chart 2: Stacked bar — "Monthly expenses"**

- X: months in selected period
- Y: UAH
- Stacked by service (each service = different color segment)
- Shared color coding with pie chart

**Chart 3: Line — "Consumption trend"**

Two modes, toggled by prominent switcher at top of chart:

**Mode A — Expenses (default):** multi-line, one line per metered service. Y-axis: UAH. Shows spending trend over time, all services overlaid.

**Mode B — Consumption:** single line for one selected service (dropdown next to toggle: Electricity / Gas / Cold water / Hot water). Y-axis: physical unit (kWh / m³). Service-specific physical consumption trend.

```
Expenses mode:
View: [ Expenses (₴) ●] [ Consumption (physical) ○ ]
─────────────────────────────────────────────────
[4 lines overlaid, different colors per service]
─────────────────────────────────────────────────
Legend: ● Electricity  ● Gas  ● Cold water  ● Hot water

Consumption mode:
View: [ Expenses (₴) ○] [ Consumption (physical) ●]
Service: [ Electricity ▾ ]
─────────────────────────────────────────────────
[1 line]
─────────────────────────────────────────────────
Y axis: kWh
```

#### 4. Recent activity — deprioritized

Optional block for later. Not in this iteration.

### Empty state — first-time user

No properties yet. Entire dashboard replaced by a single welcome card.

```
[ Home icon, 64px, muted ]

Welcome to UtilityBills!

Start by adding your first property
to track your utility bills.

[ + Add property ]
```

Centered, `max-w-md`, vertical padding generous.

### Loading state

Skeleton screens for each block. Use 200ms delay — if data loads in <200ms, skeleton shouldn't flicker. Attention block doesn't show skeleton (it may legitimately be empty).

---

## Screen 2: Properties list (`/properties`)

**Purpose:** User sees all properties they have access to, picks one to enter.

### Page header

```
My Properties                              [ + Add property ]
```

h2 on the left, primary button on the right.

### Main content — card grid

Responsive columns: 1 (mobile) / 2 (tablet) / 3 (desktop).

**Card structure:**

```
┌──────────────────────────┐
│ [🏠] Apartment            │  ← type icon + name
│ Main St 15               │  ← address (muted)
│                          │
│ ──────────────           │
│ 5 services               │  ← meta
│ ──────────────           │
│                          │
│ Balance                  │
│ -890 UAH                 │  ← balance, colored
│                          │
│ [ Open → ]               │
└──────────────────────────┘
```

**Visual treatment:**

- Card is fully clickable (entire card surface, not just button), navigates to `/properties/[id]`.
- Hover state: subtle lift (`hover:shadow-md transition`).
- Type icon uses lucide: Home (apartment), House (house), TreePine (cottage), Building (other).
- Balance color: destructive (negative), green (positive), neutral (zero).

### Shared property variant

If user has access to a property they don't own, add a badge and role indicator:

```
┌──────────────────────────┐
│ [🏠] Brother's house      │
│ Village X                │
│ [Shared]    Role: Editor │  ← shared badge, role shown only for non-owners
│                          │
│ ...                      │
└──────────────────────────┘
```

Badge: shadcn `<Badge variant="secondary">`.

### Empty state

```
[ Home icon, 64px, muted ]

No properties yet

Add your first property to start
tracking utility bills.

[ + Add property ]
```

Centered card, same treatment as dashboard empty state.

---

## Screen 3: Property detail (`/properties/[id]`)

**Purpose:** Central hub for managing everything related to one property.

### Breadcrumbs

```
Home  /  Apartment on Main St
```

Above page header, `text-sm text-muted-foreground`. Home is linkable to /dashboard.

### Page header

```
Apartment on Main St                           [ Edit ] [ Share ] [ ⋮ ]
Main St 15 · 5 services · Created Jan 2024
```

- Title: h1 or h2.
- Subtitle: muted, metadata separated by bullets.
- Actions right-aligned:
  - `[Edit]` — secondary button, navigates to `/properties/[id]/edit`
  - `[Share]` — secondary button, navigates to Sharing tab
  - `[⋮]` — icon button, dropdown (currently just future items, may be empty in v1)
- **Visibility:** Edit and Share hidden/disabled for users with `viewer` role.

### Tabs

shadcn `<Tabs>` component.

```
[ Overview ]  [ Meters ]  [ Sharing ]
```

Default: Overview.

**Meters tab** only shown if property has any metered services. Otherwise tab hidden.

### Tab: Overview (default)

Shows services list with quick-glance state.

```
┌─────────────────────────────────────────────┐
│ Services on this property                   │
│                              [+ Add service]│
├─────────────────────────────────────────────┤
│                                             │
│ ⚡ Electricity               -400 UAH    →  │
│    ДТЭК · Last reading: Oct 15              │
│                                             │
│ 🔥 Gas                       +50 UAH     →  │
│    Нафтогаз · Last reading: Oct 14          │
│                                             │
│ 💧 Cold water                -100 UAH    →  │
│    Київводоканал · Last reading: Oct 15     │
│                                             │
│ 🌐 Internet                  0 UAH       →  │
│    Kyivstar                                 │
│                                             │
└─────────────────────────────────────────────┘
```

Each row:

- Service type icon (left): use lucide icons — Zap (electricity), Flame (gas/heating), Droplets (water), Wifi (internet), etc.
- Service name and provider + last reading date (for metered) on one line set.
- Balance on the right (colored per convention).
- Entire row clickable → `/properties/[id]/services/[sid]`.
- Hover state: subtle background tint.

Divider between rows (`divide-y`).

### Tab: Meters

Placeholder for this iteration. Full design in next iteration.

For now, simple list of physical meters with serial, zone count, install date.

### Tab: Sharing

Placeholder for this iteration. Full design in later iteration.

### Empty states

**New property, no services:**

```
[ Lightbulb icon, muted ]

No services yet

Add services like electricity, water, or gas
to start tracking bills.

[ + Add service ]
```

**Has services but no bills/readings:**

Service list renders normally, but all balances = 0 and last readings = "never". Hint below list:

```
Add your first bill or reading to see balance data.
```

---

## Shared design tokens & patterns

### Loading feedback

- **<200ms:** no skeleton (avoid flicker)
- **200ms–1s:** skeleton via shadcn `<Skeleton>`
- **>1s:** skeleton + subtle pulse animation

Implementation: skeleton appears after 200ms CSS delay, so fast loads don't show it.

### Empty state pattern

Consistent across all empty screens:

- Centered content, `max-w-md`
- Icon (64px, `text-muted-foreground`)
- h3 title ("No X yet")
- Paragraph body (muted)
- Primary CTA button

### Error / Not Found patterns

Not needed for this iteration — deferred to later.

### Toast notifications

Library: `sonner`. Position: bottom-right. Duration: 4s default.

Used for:

- Success confirmations ("Property created")
- Error notifications ("Couldn't save. Try again")
- Not used for: form validation errors (inline), critical errors (full error boundary)

---

## Open design decisions for this iteration

These are decisions I'd like to make by seeing them visually, not by discussion:

1. **Accent color** — 2–3 variants (Indigo vs Violet vs Teal), compare side-by-side on Dashboard.
2. **Chart color palette** — how do service colors (Electricity, Gas, Water, etc.) work across pie, stacked bar, line? Should follow a consistent mapping.
3. **Filters bar styling** — inline horizontal bar vs. collapsible panel? Decide based on visual weight.
4. **Balance number emphasis** — how prominent should the main "total debt" number be? Big and bold, or understated?
5. **Card hover states** — how much lift on hover? Subtle (`hover:shadow-sm`) or more noticeable (`hover:shadow-lg`)?

---

## Out of scope for this iteration

To keep focused, please don't design in this round:

- Forms (add property, add service)
- Meters and readings screens
- Bills / Payments screens
- Sharing management UI
- Admin section (has its own accent color)
- Public landing page
- Auth login screen

These will come in subsequent iterations once the visual language is set.

---

## Deliverables expected from this iteration

1. Dashboard screen — full state (with data)
2. Dashboard screen — empty state (first-time user)
3. Properties list — with data (3 cards)
4. Properties list — empty state
5. Property detail — Overview tab with services
6. Property detail — empty state (no services)
7. Accent color decision — chosen and applied consistently

Mobile variants for all of the above (responsive behavior) are a plus but not required in this iteration.
