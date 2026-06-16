# 0012 — Display dates via the shared format tokens, never a hardcoded pattern

**What happened:** A meta line formatted `createdAt` with an inline `format(date, "MMM yyyy")`
copied from the design mock. The author corrected it: UI dates must use the project's shared
date-format tokens, not a one-off pattern string — and the design's date style does not override
that convention.

**Rule:** Format any user-facing date through the tokens in `lib/format/date.ts`
(`DISPLAY_DATE_FORMAT` for display, `ISO_DATE_FORMAT` for machine values), e.g.
`format(date, DISPLAY_DATE_FORMAT)`. Never hardcode a date-fns pattern (`"MMM yyyy"`,
`"dd.MM.yyyy"`, …) inside a component. One source keeps every date on screen consistent.

**How to apply:** Before writing `format(date, "…")`, import the matching token from
`@/lib/format/date` and pass it. If a design shows a different date style than
`DISPLAY_DATE_FORMAT`, that is not a reason to inline a pattern — follow the project token
(the design is not authoritative on formatting, §1.8). Only if a genuinely new display style is
needed across multiple places, add a new token/helper in `lib/format/date.ts` and reuse it.
