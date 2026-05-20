# Design Brief — Iteration 7a (Bills: empty states + Add Bill modal)

Closes the remaining gap in the Bills domain. Bills list with data was done in Iteration 2 — this iteration adds the two empty states and the Add Bill modal.

**Continuation of Iterations 1–6.** Visual language is locked: shadcn New York, Zinc base, Violet primary accent, Inter typography, 0.5rem radius, light + dark modes, 200ms loading delay pattern.

---

## Deliverables expected from this iteration

Please generate these one at a time, pausing between each for feedback:

1. Bills list — first-time empty state (no bills at all)
2. Bills list — filtered-empty state (filters applied, no matches)
3. Add Bill modal — for a metered service (with "Expected: X UAH" hint)
4. Add Bill modal — for a fixed service (with "Expected: X UAH" hint, but no zone-related context)

Dark mode for any of these — generate only if budget allows.

Mobile variants — optional. Both empty states stack predictably; the modal becomes fullscreen sheet on mobile with the same content.

**Single-variant rule:** generate one version of each screen. No side-by-side comparisons.

---

## Screen 1: Bills list — first-time empty state

User has properties and services, but has not recorded any bills yet.

**Layout:** same page chrome as Bills list with data (header, filter bar). Filters bar is rendered but inactive-looking (no filters applied). Page total in footer area shows nothing or is hidden.

In place of the table — centered empty-state block following the established pattern from Iteration 1:

- Icon: `Receipt` from lucide, 64px, `text-muted-foreground`
- h3: **No bills yet**
- Body: `Record your first bill to start tracking expenses across your properties.`
- Primary CTA: `[ + Record bill ]` (`variant="default"`)

Block centered horizontally, `max-w-md`, vertical padding generous (`py-16` or so).

## Screen 2: Bills list — filtered-empty state

User has bills, but the active filters return zero matches.

**Layout:** same page chrome. **Filters bar shows active filters** (a property selected, a service selected, period set). The filter bar should visually communicate "yes, filters are applied" — selected `<Select>` triggers, "Clear filters" link visible.

Empty-state block in place of the table:

- Icon: `FilterX` from lucide, 64px, `text-muted-foreground`
- h3: **No bills match your filters**
- Body: `Try adjusting the filters or clearing them to see all bills.`
- Primary CTA: `[ Clear filters ]` (`variant="outline"`)

The two icons differ noticeably between states — that's the cue from `UI_ARCHITECTURE.md` (different icons for first-time-empty vs filtered-empty).

## Screen 3: Add Bill modal — metered service

Triggered from the Bills list `[ + Record bill ]` button (or from a Service detail quick action).

**Modal structure (shadcn `<Dialog>`):**

- Header: title "**Record bill**", close X
- Body: form
- Footer: `[ Cancel ]` (left, `variant="outline"`) + `[ Save bill ]` (right, `variant="default"`)
- Width: `max-w-md`

**Form fields, top to bottom:**

1. **Property** — `<Select>`. Required. Shows all properties accessible to user. In the mockup, render with one property pre-selected (e.g., "Main apartment").

2. **Service** — `<Select>`. Required. Filtered to services on the selected property. In the mockup, render with "Electricity" pre-selected.

3. **Month** — `<Select>` with recent-months dropdown. Show the last 6 months by name (e.g., "April 2026", "March 2026", …) plus a "Custom…" option at the bottom (custom range is post-MVP, but keep the option visible for forward-compat). Pre-select previous month.

4. **Amount (UAH)** — number input. Required. Right-aligned. Below input, in muted small text: `Expected: 1,847.20 UAH based on readings and tariff`.

5. **Notes (optional)** — textarea. 3 rows. Placeholder: `Anything worth remembering about this bill…`

**Field labels** above inputs in `font-medium text-sm`. Spacing between fields `gap-4`.

**The "Expected" hint** is the senior-level detail of this modal — it's the visible payoff of the temporal tariff system. Style it so it reads as "the system did the math for you, but the field is yours" — informative, not prescriptive.

## Screen 4: Add Bill modal — fixed service

Same modal, same layout. Difference: the selected service is a fixed one (e.g., "Internet").

**What changes:**

- Service `<Select>` shows "Internet" selected.
- Below the Amount input, the hint reads: `Expected: 350.00 UAH based on the contract`.
- No zone-related concepts (those don't exist for fixed services anyway).

The point of having both screens is to confirm that the modal handles both "metered" and "fixed" service types with the same shape — only the hint copy adapts.

---

## Out of scope for this iteration

- Edit Bill modal (same modal with pre-filled data — can be inferred)
- Delete Bill confirmation (standard small confirm dialog, can be inferred)
- Bill detail view (clicking a row — current decision is "row click opens edit modal", no separate detail view)
- Payments equivalents (structurally identical, will be implemented from Bills patterns + the documented differences)

---

## Final note

The two empty states are template-setting — once these icons + tone are locked, the same pattern applies to Payments empty states, and we just swap the icon and copy. No need to design those separately.

The Add Bill modal is the canonical "create a record" modal — Record Payment will reuse the same shape with a different field list.
