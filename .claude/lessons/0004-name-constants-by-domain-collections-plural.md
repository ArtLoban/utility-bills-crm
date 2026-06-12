# 0004 — Name a constant for its domain; const-object collections are plural

**What happened:** I kept a brief's generic names — enum `TIME_PERIOD` and array `PRESETS`.
The author renamed them to `TIME_PERIODS` (plural) and `TIME_PERIOD_PRESETS`
(domain-qualified), with an explicit `: TTimePeriod[]` on the exported array.

**Rule:** A name says _what domain it belongs to_, not just _what shape it is_ (`code-style.md`).
A const-object enum holding a **set** reads plural (`TIME_PERIODS`); a derived list is
domain-qualified (`TIME_PERIOD_PRESETS`, never bare `PRESETS`/`OPTIONS`). Don't copy generic
names from a brief — the brief gives intent, you choose the name to the rules.

**How to apply:** Const-object enum → plural noun. Derived list → domain-qualified name. Give
exported constants an explicit element type (`: TTimePeriod[]`) — "type module boundaries
explicitly" covers exported values, not only functions.
