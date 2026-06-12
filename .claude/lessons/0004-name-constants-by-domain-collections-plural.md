# 0004 — Name a constant for its domain; const-object collections are plural

**What happened:** Simplifying the date-range presets, I kept the brief's generic
names — the const-object enum `TIME_PERIOD` and the derived array `PRESETS`. The
author renamed them to `TIME_PERIODS` (plural) and `TIME_PERIOD_PRESETS`
(domain-qualified), and kept an explicit `: TTimePeriod[]` annotation on the
exported array.

**Rule:** A name must say _what domain it belongs to_, not just _what shape it is_
(`code-style.md` — «Имена говорят о назначении»). A generic word like `PRESETS`
could be presets of anything — qualify it: `TIME_PERIOD_PRESETS`. A const-object
enum that holds a **set** of values reads as a plural collection: `TIME_PERIODS`,
not `TIME_PERIOD`. Do not take constant names verbatim from a brief if they are
generic — the brief specifies intent, you choose the name to the project's rules.

**How to apply:**

- Const-object enum (a map of members) → plural noun: `TIME_PERIODS`, `DATE_PARAMS`.
- A derived list/array → domain-qualified name: `TIME_PERIOD_PRESETS`, never bare
  `PRESETS`/`OPTIONS`/`ITEMS`.
- Give exported (module-boundary) constants an explicit element type
  (`: TTimePeriod[]`) — the CLAUDE.md TS rule "type module boundaries explicitly"
  applies to exported values, not only functions.
