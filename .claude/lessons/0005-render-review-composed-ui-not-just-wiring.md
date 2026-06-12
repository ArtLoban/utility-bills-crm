# 0005 — Wiring-correct ≠ visually consistent; review the rendered result

**What happened:** Migrating the bills mobile filter sheet, I composed the desktop
`DateRangeFilter` (`orientation="stacked"`) next to data-entry `FormSelectField`s. It
type-checked, ran, and passed every CLI gate — but the author's screenshot showed three
clashing field styles in one vertical list: Property/Service had labels _above_ at 38px
(`FormSelectField`/`FormItem`), the dates had labels _inline_ at 32px (`DatePicker
variant="filter"`), and the preset had _no_ label. I had verified behavior (URL drives,
preset highlight, clear) but never looked at whether the fields matched each other.

**Rule:** Reusing a shared widget in a new layout context does not guarantee it visually
matches its new neighbours. Label position, control height, and value/date format are part
of "done" (`project-cleanup.md` Dimensions 5/6/12). After composing UI, **look at the
rendered screenshot** (Playwright/MCP) and check sibling controls share one treatment —
green `tsc`/`eslint`/`prettier` proves wiring, not consistency.

**How to apply:**

- When placing a reused component beside others, screenshot the result and compare
  fields side by side: same label placement, same height, same date/number format.
- A widget with an `orientation`/`variant` for a different context (desktop chip vs
  mobile sheet) usually needs its _own_ rendering per context — don't assume the default
  branch fits. Here `stacked` had to render label-above + field height (`LabeledField`,
  `variant="field"`) to match the `FormSelectField`s, while `inline` kept the compact chip.
- Align display formats to the shared source (`DISPLAY_DATE_FORMAT` from
  `lib/format/date.ts`), not an ad-hoc per-file token.
