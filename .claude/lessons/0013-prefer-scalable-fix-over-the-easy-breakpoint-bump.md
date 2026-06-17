# 0013 — Solve the cause, not the symptom; don't reach for the non-scalable easy fix

**What happened:** For the cramped header in the 768–1024px range I proposed simply
raising the nav breakpoint from `md` to `lg`. The author pushed back: "ты похоже решил
пойти по самому лёгкому пути" — moving the breakpoint doesn't scale (add 5 nav items and
you'd be pushing the threshold to 1500px, and a wide screen still overflows eventually).
The real cause is a layout that adapts to nothing. The right answer was a Priority+
(overflow "More") navigation that measures available width at runtime.

**Rule:** When a layout/architecture bug has an obvious cheap patch and a slightly harder
but genuinely adaptive solution, evaluate the adaptive one first and recommend it. A fix
that only works for the current fixed inputs (item count, screen size, locale) is treating
the symptom. Ask "does this still hold if the inputs grow?" — if no, it's not the fix.

**How to apply:** For responsive overflow of a variable-length row (nav, tabs, chips,
toolbars), default to the Priority+ pattern (measure container via `ResizeObserver`, show
what fits, collapse the rest into a "More" menu) instead of a hardcoded breakpoint tied to
the current item count. More generally: never present the laziest option as the
recommendation just because it's least work — the quality bar (CLAUDE.md §0) is a
senior/architect solution, and "it works for now" is not enough.
