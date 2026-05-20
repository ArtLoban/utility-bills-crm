# Design Brief — Iteration 2

Two pattern-setting screens that will establish reusable patterns for the rest of the app.

**Continuation of Iteration 1.** All visual language is locked in: shadcn New York, Zinc base, Violet accent, Inter typography, 0.5rem radius, light/dark modes, subtle shadows (light) / borders (dark), 200ms loading delay pattern.

Keep everything consistent with Iteration 1 screens.

---

## Deliverables expected from this iteration

Please generate these one at a time, pausing between each for feedback:

1. **Submit Reading modal** — single-zone variant (most common)
2. **Submit Reading modal** — two-zone variant
3. **Bills list screen** — with data, 156 records, filtered
4. **Bills list screen** — empty state (no bills)
5. **Bills list screen** — filtered-empty state
6. **Add Bill modal**

Dark mode variants for each — optional, generate only if budget allows.

Mobile variants for Bills list — required (adaptive card layout).

---

## Screen 1: Submit Reading modal

**Purpose:** User inputs a new meter reading. Opens from Meter detail, Service detail, or Dashboard attention block.

**Modal size:** medium (~480px wide on desktop, full-width on mobile)

### Structure — single-zone variant

```
┌──────────────────────────────────────────┐
│ Submit reading                      [✕]  │
├──────────────────────────────────────────┤
│                                          │
│ ⚡ Electricity meter · SN 012345          │
│ Apartment on Main St                     │
│                                          │
│ ──────────────────────────────           │
│                                          │
│ Reading date                             │
│ [ Oct 15, 2024                    📅 ]   │
│                                          │
│ Value (kWh)                              │
│ [ _____                             ]    │
│ Last reading was 12,512 on Sep 14        │
│                                          │
│ Notes (optional)                         │
│ [ Multiline textarea                ]    │
│                                          │
│ ──────────────────────────────           │
│ [ Cancel ]                   [ Submit ]  │
└──────────────────────────────────────────┘
```

### Structure — two-zone variant

Two zone values side-by-side on desktop, stacked on mobile:

```
Value T1 (day)            Value T2 (night)
[ _____ ]                 [ _____ ]
Last: 8,010 kWh           Last: 4,502 kWh
```

Three-zone variant (deferred, not needed in this iteration) — similar stacking.

### Key UX details

- **Modal header:** title + close icon (X, top-right). Subtle border below header.
- **Context block** (icon + meter info + property) — under header, before form. Muted text, smaller size. This grounds the user in "which meter am I working with."
- **Form fields** — standard shadcn `<Form>` layout. Label above input. Helper text below input (the "Last reading was..." hint).
- **Hint text** — `text-muted-foreground text-sm`. Helpful, not prescriptive.
- **Modal footer:** right-aligned actions with a subtle border above. Cancel as `variant="ghost"` or `variant="outline"`, Submit as `variant="default"` (primary/accent color).
- **Focus management:** first input auto-focused when modal opens.

### Warning state (optional visual for this iteration)

If input value is lower than the last reading, show subtle warning below the value field:

```
⚠️ This value is lower than the last reading (12,512).
   Is this correct? (replacement, input error, or rollover)
```

Color: `text-amber-600` (light) / `text-amber-400` (dark). Icon: `AlertTriangle` from lucide. Non-blocking — user can still submit.

### States to show

- Default (empty form)
- Single-zone variant with values entered
- Two-zone variant with values entered
- (Optional) Warning state with "lower than last" scenario

---

## Screen 2: Bills list (`/bills`)

**Purpose:** User reviews and searches bills across all properties. Pattern for all future data tables in the app (Payments list, Admin property list, reading history, etc.).

### Page structure

```
Top bar (as established in Iteration 1)
─────────────────────────────────────────────────
Page header:
─────────────
Bills                                  [ + Add bill ]
156 records · Current filter: Last 12 months · All properties
─────────────────────────────────────────────────

[ Filter bar — inline horizontal ]

Property: [ All ▾ ]   Service: [ All ▾ ]   Period: [ Last 12 months ▾ ]
                                                  [ Clear filters ]

─────────────────────────────────────────────────

[ Data table ]

Date ↓    Property              Service        Period    Amount     [ ]
──────────────────────────────────────────────────────────────────────
Oct 15    Apartment Main St     ⚡ Electricity  Oct 2024  -820 UAH  [⋮]
Oct 14    Apartment Main St     💧 Cold water   Oct 2024  -120 UAH  [⋮]
Oct 12    Mom's apartment       ⚡ Electricity  Oct 2024  -440 UAH  [⋮]
Oct 10    Apartment Main St     🔥 Gas          Oct 2024  -680 UAH  [⋮]
Sep 15    Apartment Main St     ⚡ Electricity  Sep 2024  -790 UAH  [⋮]
...

─────────────────────────────────────────────────
Total (filtered): 12,450 UAH
                                     [ 1 2 3 ... 8 ]  [ 25 per page ▾ ]
```

### Key visual patterns

**Page header:**

- Title (h2) left-aligned.
- Primary action button right-aligned (`variant="default"`).
- Meta-line under title: record count + filter summary, muted.

**Filter bar:**

- Row of dropdown selects, inline on desktop.
- Each filter is `<Select>` from shadcn.
- "Clear filters" as a subtle link (`text-muted-foreground underline`), shown only when any filter is active.

**Table:**

- TanStack Table powered (we use it in this project) — shadcn `<Table>` primitives.
- Sortable column headers (click to toggle asc/desc). Show sort arrow next to active column.
- Row hover state (subtle background tint).
- Row click → opens detail modal (out of scope for this iteration).
- Service icon prepended to service name for quick visual scan.
- Amount column right-aligned, monospace numeric or tabular-nums for clean vertical alignment.
- Amount colored `text-destructive` (since bills are expenses/negative).
- Actions column last, narrow, icon button `⋮` that opens a dropdown (Edit / Delete).

**Footer:**

- Aggregate "Total (filtered)" left side of footer, emphasized.
- Pagination right side.
- Per-page selector next to pagination.

### Mobile layout

Below `sm` breakpoint, table transforms into card list:

```
┌────────────────────────────────────────┐
│ Oct 15 · ⚡ Electricity                 │
│ Apartment on Main St · Oct 2024        │
│ -820 UAH                          [⋮]  │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Oct 14 · 💧 Cold water                  │
│ Apartment on Main St · Oct 2024        │
│ -120 UAH                          [⋮]  │
└────────────────────────────────────────┘
```

Filters on mobile — "Filters" button at top (near page header), opens a `<Sheet>` drawer from bottom with filter controls.

### Empty states

**State A — no bills at all (new user / first-time):**

```
[ Receipt icon, 64px, muted ]

No bills yet

Record your first bill to start
tracking expenses.

[ + Add bill ]
```

Centered card, consistent with Iteration 1 empty states.

**State B — filtered empty (has bills, current filters yield nothing):**

```
[ Filter icon or Search-off icon, muted ]

No bills match your filters

Try adjusting period, property,
or service filters.

[ Clear filters ]
```

Different CTA — this one resets filters, doesn't create a new bill.

---

## Screen 3: Add Bill modal

Same modal template as Submit Reading, but with different form fields.

```
┌──────────────────────────────────────────┐
│ Add bill                            [✕]  │
├──────────────────────────────────────────┤
│                                          │
│ Property                                 │
│ [ Select property ▾ ]                    │
│                                          │
│ Service                                  │
│ [ Select service ▾ ]                     │
│ (filtered by selected property)          │
│                                          │
│ Month                                    │
│ [ October 2024 ▾ ]                       │
│                                          │
│ Amount (UAH)                             │
│ [ _____ ]                                │
│ Expected based on your tariff: 432 UAH   │
│                                          │
│ Notes (optional)                         │
│ [ Multiline textarea ]                   │
│                                          │
│ ──────────────────────────────           │
│ [ Cancel ]                     [ Save ]  │
└──────────────────────────────────────────┘
```

### Notes

- Month selector — `<Select>` dropdown with options "October 2024", "September 2024" (last 6 months), plus "Custom month..." at bottom for opening a full picker. Default: current month.
- Expected amount hint — muted, below amount field. Only shown for metered services.
- For fixed services, hint would say "Expected based on your plan: {fixedAmount} UAH" instead.

### States to show

- Default (empty form)
- Form filled with Electricity + October + amount entered, hint showing

---

## Shared patterns across all modals

These apply to Submit Reading, Add Bill, and future modals:

- Modal width: `max-w-md` to `max-w-lg` (~480-512px desktop).
- Modal structure: header (with close X) / body (form content) / footer (action buttons).
- Subtle border between header and body, and between body and footer.
- Body padding: `p-6`.
- Header/footer padding: `px-6 py-4`.
- Primary action on right, Cancel on left with spacing.
- Primary action uses `variant="default"` (accent color).
- Cancel uses `variant="outline"` or `variant="ghost"`.
- Overlay: standard shadcn dialog overlay (semi-transparent backdrop with blur).
- Closing: Esc key, click outside (backdrop), or X button.

---

## Out of scope for this iteration

- Edit Bill (it's the same modal with pre-filled data)
- Delete Bill confirmation (short, standard)
- Bill detail view modal (clicking a row — can be inferred from the Add Bill pattern)
- Payments screens (identical pattern to Bills, only differences are sign/color — can be inferred)
- Meter detail page (has own iteration later)
- Dark mode variants (generate only if budget allows easily; otherwise skip)

---

## One thing I want to see visually

**Rich tooltip pattern** — not strictly part of any of these screens, but if you can add an example tooltip somewhere (e.g., on a legend item in a separate small demo), that would establish the tooltip style for future use. Completely optional — budget permitting.
