# 0017 — A long sequential select is poor UX; use a visual picker, and check for a sibling primitive

**What happened:** The reminder "Day of month" field was built as a native `<select>` listing
1–31. The author pushed back: "ты реализовал селект Day of month — по-твоему это хороший UX?"
Scrolling 31 sequential numbers in a dropdown is slow, hides most values, and gives no visual
sense of the choice. The repo already had the right pattern — `MonthPicker`
(`components/month-picker/index.tsx`): a field-styled trigger opening a clickable grid — which
I had not mirrored when first picking the control.

**Rule:** For a bounded, sequential, or otherwise visualizable value set (days 1–31, months,
ratings, small enums), do **not** reach for a long `<select>`/dropdown. Choose a control that
shows the options at a glance — a grid, segmented control, or stepper — picked on UX merits, not
on what's least code. And before choosing any input control, look for an **existing sibling
primitive** that already solves the analogous problem and mirror it (see
[[0002-study-the-reference-reuse-the-shared-shell]], [[0006-ui-primitive-limits-are-not-a-reason-to-avoid-it]]).

**How to apply:** When a field's domain is a small/bounded set, ask "can the user see and pick
without scrolling?" If a dropdown forces scrolling through many sequential items, build a visual
picker instead (for day-of-month: a 7-column 1–31 grid in a popover, no weekday headers — the
day recurs monthly and isn't tied to a weekday). Reuse the shared shell/styling of the nearest
analogous primitive (`MonthPicker` → trigger className, `<Popover modal>` for in-Dialog use,
`FormFieldShell` wrapper) rather than hand-rolling. A native long `<select>` is tech debt
(§1.8), never the target.
