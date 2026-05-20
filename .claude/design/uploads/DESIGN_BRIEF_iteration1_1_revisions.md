# Design Revisions — Iteration 1.1

Refinements on top of Iteration 1 work. Keep everything else as-is; apply these three changes.

---

## Revision 1 — Add visual depth (shadows / borders)

Cards / widgets need subtle elevation to feel alive. Current flat look reads as "wireframe-like".

**Light mode:**

- Cards: `shadow-sm` (subtle soft shadow)
- Hover state on clickable cards: `shadow-md`

**Dark mode (important — shadows don't work well in dark):**

- Cards: `border border-border` (subtle edge-based elevation)
- Hover: `border-primary/30` (tint on hover to signal interactivity)
- No `shadow-*` in dark mode

Transition: `transition-shadow` (light) / `transition-colors` (dark), 150ms ease.

Apply to: all `<Card>` instances on Dashboard, Properties list cards, Property detail tabs.

---

## Revision 2 — Expenses by service (pie chart widget)

**Current issue:** pie is too small (~30% of widget width), legend is stretched across unused horizontal space. Lots of empty feel.

**Changes:**

- **Pie size:** scale up to occupy ~40–45% of widget width. The chart should feel like the main focal point, not a small accessory.
- **Total label in center of donut:** scale font size proportionally — larger pie deserves larger total number.
- **Legend layout:** compact. Each row should have service name and percentage on the same line with tight horizontal spacing (not stretched edge-to-edge).

Target layout:

```
┌─────────────────────────────────────────────────────┐
│ Expenses by service                                 │
│ Last 12 months                                      │
│                                                     │
│        ┌─────────┐                                  │
│       ╱           ╲    ● Electricity        32%    │
│      │    TOTAL    │   ● Gas                16%    │
│      │  26,380 UAH │   ● Heating            23%    │
│      │             │   ● Cold water          7%    │
│       ╲           ╱    ● Hot water          10%    │
│        └─────────┘     ● Internet           11%    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Pie on left (~40-45%), legend column on right (~40-45%), remaining space is symmetric breathing room.

---

## Revision 3 — Monthly expenses (stacked bar chart)

**Current issue:** stacked bars are hard to read for users not used to charts. Hard to answer "how much did I spend on electricity in December" at a glance.

**Keep:** stacked layout as default. The whole point of this chart is seeing monthly structure across services.

**Add:**

### a) Rich tooltip on hover

When user hovers over any bar, show a detailed breakdown:

```
December
──────────────────────────
● Electricity      820 UAH
● Gas              680 UAH
● Heating        1,240 UAH
● Cold water       120 UAH
● Hot water        180 UAH
● Internet         200 UAH
──────────────────────────
Total            3,240 UAH
```

Tooltip appearance: shadcn-style popover, dark background in light mode / light background in dark mode (inverted for contrast), generous padding, values right-aligned for scan-ability, total row separated and emphasized (`font-semibold`).

Recharts `<Tooltip>` component supports custom content — use it.

### b) Clickable legend for service toggle

Click on a service in the legend → hide that service from all bars (filter).
Click again → show it back.
Visual state of legend item:

- Active: full color dot + normal text
- Inactive: grayed-out dot + `line-through` or `text-muted-foreground`

This gives users a way to compare subsets without a complex UI. E.g., click "hide all except Electricity and Gas" takes 4 clicks but the result is crystal clear.

Recharts supports this out of the box via legend click handler.

### c) Do NOT add

- No "Stacked vs Grouped" toggle — intentionally omitted. Stacked + tooltip + legend filter is sufficient; adding grouped mode is feature bloat.
- No service switcher that shows one service at a time — that use case is already covered by the Line Chart's money mode.

---

## Scope

These three revisions apply only to Dashboard in its data-full state. Empty states, Properties list, Property detail don't change.

After these revisions, iteration 1 is considered final. Next iteration will start on new screens (Services, Meters, Readings).
