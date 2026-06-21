# 0011 — Prefer the standard Tailwind scale over arbitrary `[NNpx]` sizes

**What happened:** A card was built copying the design's exact pixel font sizes as
arbitrary Tailwind values (`text-[22px]`, `text-[11px]`, `text-[13px]`). The author
rejected this: when a design px value is within ~1–2px of a standard scale step, use the
standard class, not an arbitrary one.

**Rule:** Do not reach for arbitrary `text-[NNpx]` (or similar size) utilities when a
standard Tailwind scale step is close enough. A 1–2px deviation is imperceptible — map to
the nearest step instead. Concretely: `text-[11px]`/`text-[13px]` → `text-xs`/`text-sm`;
`text-[22px]` → `text-xl`. Reserve a custom value or a `--font-size-*` token only when the
design value differs meaningfully from every standard step **and** recurs in multiple
places (see `.claude/rules/ui-patterns.md` §4).

**How to apply:** Before writing `text-[NNpx]`, check the standard scale
(`text-xs` 12 / `text-sm` 14 / `text-base` 16 / `text-lg` 18 / `text-xl` 20 / `text-2xl` 24…).
Pick the nearest step. Only if nothing is within ~1–2px and the value repeats, add a
semantic `--font-size-*` token in `globals.css` and use it via inline `style` — never a
one-off arbitrary class. The same instinct applies to other size scales (spacing, radius).

**Also counts as arbitrary:** wrapping a token in an arbitrary-value class
(`text-[var(--font-size-md)]`) does **not** escape this rule — it is still a one-off
arbitrary utility. When converting an inline `style={{ fontSize: "var(--font-size-md)" }}`
to a class, map to the nearest standard step (15px → `text-sm`), not `text-[var(--…)]`.
