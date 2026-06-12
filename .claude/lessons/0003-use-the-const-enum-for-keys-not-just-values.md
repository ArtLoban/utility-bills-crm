# 0003 — Use the const-object enum for keys too, not just values

**What happened:** Cleaning up `date-range-filter`, I wrote object literals with raw keys
`dateFrom`/`dateTo` even though `DATE_PARAMS` is the const-object enum for exactly those keys.
The author switched them to computed keys `{ [DATE_PARAMS.DATE_FROM]: … }`.

**Rule:** When a const-object enum centralizes a set of domain strings, use it **everywhere
those strings appear** — object keys, property accessors, and values alike. Re-typing the
literal reintroduces the magic string (`ui-patterns.md §5`) the enum exists to remove and
lets the two drift.

**How to apply:** Before writing a literal like `"dateFrom"`, a status, a role, or a field
name, check for an existing const-object enum and reference it (incl. computed keys / indexed
access). If none exists and the string appears in 2+ places, create the enum first.
