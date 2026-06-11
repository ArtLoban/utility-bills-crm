# 0003 — Use the const-object enum for keys too, not just values

**What happened:** Cleaning up `date-range-filter`, I wrote `resolvePreset`'s return
type and object literals with the raw string keys `dateFrom` / `dateTo`, even though
`DATE_PARAMS` (`@/lib/types/common`) is the const-object enum that exists for exactly
those keys. The author edited my change to use computed keys
`{ [DATE_PARAMS.DATE_FROM]: …, [DATE_PARAMS.DATE_TO]: … }`.

**Rule:** When a const-object enum already centralizes a set of domain strings, use it
**everywhere those strings appear** — as object keys (`{ [DATE_PARAMS.DATE_FROM]: … }`),
as property accessors (`obj[DATE_PARAMS.DATE_FROM]`), and as values — not only in some
of those positions. Re-typing the literal the enum exists to replace reintroduces the
magic string (`ui-patterns.md §5`) the enum was created to remove, and silently allows
the two to drift.

**How to apply:** Before writing a literal like `"dateFrom"`/`"dateTo"`, a status, a
role, or a field name, check for an existing const-object enum (`DATE_PARAMS`,
`TIME_PERIOD`, the per-form `*FormField` enums, …). If one exists, reference it —
including computed object keys and indexed access. If none exists and the string
appears in 2+ places, create the enum first (`ui-patterns.md §5`).
