# Design Brief — Iteration 7b (Meters: detail + Add + Replace)

Closes the Meters domain. Three screens: Meter detail page (the most pattern-rich), Add meter modal, Replace meter modal.

**Continuation of Iterations 1–7a.** Visual language is locked: shadcn New York, Zinc base, Violet primary accent, Inter typography, 0.5rem radius, light + dark modes, 200ms loading delay pattern.

---

## Deliverables expected from this iteration

Please generate these one at a time, pausing between each for feedback:

1. Meter detail page — two-zone electricity meter with readings history (light mode)
2. Meter detail page — same, dark mode
3. Add meter modal — for an unmetered service on the property
4. Replace meter modal — replacing an active meter with a new one

Mobile variant for Meter detail — required (the readings table needs to adapt). Modals on mobile become fullscreen sheets, no separate variant needed.

**Single-variant rule:** generate one version of each screen. No side-by-side comparisons.

---

## Screen 1: Meter detail page (two-zone electricity)

URL: `/properties/[id]/meters/[mid]`. Reached from the Meters tab on Property detail, or from the Meters list page.

**Page structure** (single column scrolling, NOT split view — this was a deliberate decision in `UI_ARCHITECTURE.md`):

### Page header

- Breadcrumbs: `Properties / Main apartment / Meters / Electricity meter`
- Title (h1): **Electricity meter**
- Subtitle: `Two-zone · Serial NIK-12345 · Installed Mar 15, 2024`
- Right-aligned actions: `[ Replace meter ]` (`variant="outline"`) + `[ ⋮ ]` overflow (with "Edit details", "Remove meter")

### Section 1 — Metadata card

A `<Card>` with three rows of label/value pairs in a grid:

- **Service type:** Electricity (with `Zap` icon inline)
- **Property:** Main apartment
- **Serial number:** NIK-12345
- **Zones:** 2 (T1 day, T2 night)
- **Installed at:** March 15, 2024
- **Active since:** March 15, 2024
- **Notes:** Located in the entrance hall, behind the door panel.

Two columns on desktop, one on mobile. Labels in `text-muted-foreground text-sm`, values in default weight.

### Section 2 — Readings

Section heading: **Readings** with `[ + Submit reading ]` button on the right (`variant="default"`).

Below: a table with adaptive columns based on zone count. For this two-zone meter, render 8–10 rows of data:

| Date         |   T1 (day) | T2 (night) | Δ T1 | Δ T2 | Notes                  |
| ------------ | ---------: | ---------: | ---: | ---: | ---------------------- |
| Apr 15, 2026 | 24,847 kWh |  8,142 kWh | +312 |  +98 | —                      |
| Mar 15, 2026 | 24,535 kWh |  8,044 kWh | +287 | +101 | —                      |
| Feb 15, 2026 | 24,248 kWh |  7,943 kWh | +298 |  +95 | Took during cold spell |
| Jan 15, 2026 | 23,950 kWh |  7,848 kWh | +321 | +112 | —                      |
| Dec 15, 2025 | 23,629 kWh |  7,736 kWh | +275 |  +89 | —                      |
| Nov 15, 2025 | 23,354 kWh |  7,647 kWh | +268 |  +92 | —                      |
| Oct 15, 2025 | 23,086 kWh |  7,555 kWh | +245 |  +84 | —                      |
| Sep 15, 2025 | 22,841 kWh |  7,471 kWh | +231 |  +78 | —                      |
| Aug 15, 2025 | 22,610 kWh |  7,393 kWh |    — |    — | —                      |

The last row (oldest) has no delta — no previous reading to subtract from.

**Column behavior:**

- Date column: `text-sm`, sortable
- Value columns: `text-right tabular-nums font-medium`
- Delta columns: `text-right tabular-nums text-muted-foreground text-sm`, with `+` prefix
- Notes column: `text-sm text-muted-foreground`, truncates with ellipsis on overflow
- Each row has an inline edit icon at the far right (small `Pencil` icon, `text-muted-foreground hover:text-foreground`) — clicking opens Submit Reading modal in edit mode

**Mobile:** the table collapses to card list. Each card shows date as header, T1/T2 values as label-value pairs, delta inline next to each value as a small muted suffix (e.g., `24,847 kWh +312`).

### Section 3 — Consumption chart

Section heading: **Consumption**

A line chart showing **raw reading values over time**, one line per zone. Use Recharts via shadcn Charts. Two lines: T1 (day) in primary accent, T2 (night) in a muted secondary color (zinc-500 or similar).

X-axis: month/year ticks. Y-axis: kWh, right-aligned numbers.

Chart card has subtle border, no shadow on the chart itself.

> Note: this is raw reading values, not consumption-per-month. Consumption-per-month is v2+ — explicit decision in `UI_ARCHITECTURE.md`.

---

## Screen 2: Meter detail — dark mode

Same screen, dark mode. The chart line colors should remain visible against `bg-card` in dark — adjust if Recharts default colors clash.

---

## Screen 3: Add meter modal

Triggered from the Meters list `[ + Add meter ]` button (or from a Service detail when a metered service has no meter yet).

**Modal structure (shadcn `<Dialog>`):**

- Header: title "**Add meter**", close X
- Body: form
- Footer: `[ Cancel ]` (left, `variant="outline"`) + `[ Add meter ]` (right, `variant="default"`)
- Width: `max-w-md`

**Form fields, top to bottom:**

1. **Service type** — `<Select>`. Required. **Filtered to services on this property without an active meter.** Pre-select "Cold water" in the mockup. The dropdown options should look like:
   - `Cold water` (selected)
   - `Gas`

   (Note: services that already have an active meter are not in the list. The mockup shows the filtered state.)

2. **Serial number** — text input. Required. Placeholder: `e.g. NIK-12345`.

3. **Zones** — `<Select>` or radio group with three options: `Single zone`, `Two zones (day / night)`, `Three zones (peak / shoulder / off-peak)`. Pre-select **Single zone** (most common case for water). On the form, this affects nothing visible — but it tells the system how many value fields to show on Submit Reading.

4. **Installed at** — date picker. Required. Default: today.

5. **Active since** — date picker. Required. Default: today. Below the field, in muted small text: `When this meter started being used. Often the same as installation date.`

   The two separate dates (Installed / Active since) are deliberate — they correspond to two distinct temporal intervals: when the device physically exists vs. when it's the active meter for the service. In the common case they match; the system supports the case when they don't.

6. **Notes (optional)** — textarea. 3 rows. Placeholder: `Where it's located, anything worth remembering…`

**Field labels** above inputs in `font-medium text-sm`. Spacing `gap-4`.

---

## Screen 4: Replace meter modal

Triggered from the Meter detail page `[ Replace meter ]` button. This is the senior-level temporal-data action in this iteration.

**Modal structure:**

- Header: title "**Replace meter**", close X
- Body: form
- Footer: `[ Cancel ]` + `[ Replace ]` (right, `variant="default"`)
- Width: `max-w-md`

**Form fields, top to bottom:**

1. **Replacement date** — date picker. Required. Default: today. Below the field, in muted text: `When the new meter takes over.`

2. **New meter — serial number** — text input. Required. Placeholder: `e.g. NIK-67890`.

3. **New meter — zones** — `<Select>`. Required. Three options like in Add meter. Pre-select the **same zone count as the current meter** (since most replacements keep the same configuration). For this mockup: `Two zones (day / night)`.

4. **Initial reading(s)** — adaptive based on zone count. For two zones, show two number fields side-by-side on desktop, stacked on mobile:
   - **T1 (day)** — number input. Right-aligned.
   - **T2 (night)** — number input. Right-aligned.

   Below both: in muted text, `Starting values shown on the new meter when installed. Usually 0.`

5. **Notes (optional)** — textarea. 3 rows.

### Information block (below the form, above the footer)

A muted info block explaining what the system does — styled as a subtle `<Alert>` with `Info` icon (lucide), `border` only, no background fill (so it doesn't shout), `text-sm`.

> **What happens when you replace a meter**
>
> The current meter will be marked as removed on the replacement date. All its readings stay attached to it for history. The new meter starts fresh from this date forward.

Three short lines. Tone: informative, calm, not warning-styled.

---

## Out of scope for this iteration

- Submit reading modal (already done in Iteration 2)
- Edit meter details (small modal, can be inferred)
- Remove meter (rare action, standard confirm modal)
- Meters list page on Property detail tab (can be inferred from list patterns)
- "Historical meters" collapsible section on the meters list (can be inferred)

---

## Final note

The Meter detail page is the densest screen we still have left in the app surface. After this, only Settings remains in 7c — and Settings is structurally simple.

The Replace meter modal's info block sets a pattern for how we communicate **temporal-data side effects** to the user. The same calm-info-block treatment will reuse in Update contract flow if we decide to make it more explicit there.
