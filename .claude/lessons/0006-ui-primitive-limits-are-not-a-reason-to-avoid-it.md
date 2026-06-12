# 0006 — A ui/ primitive's current limits are not a reason to avoid it

**What happened:** Deciding whether `FilterChip` should reuse `components/ui/badge.tsx`,
I judged Badge by its _current_ degraded shape (a trimmed `<span>` with no `asChild`, no
`style` forwarding, hardcoded `zinc` colors) and concluded reuse "wasn't justified." The
author pushed back: that is §1.8 again — I was treating the existing primitive as finished
and untouchable instead of a candidate to bring up to the shadcn standard. The repo already
has the canonical pattern in `button.tsx` (cva + `asChild` Slot + `data-slot` + forwarded
props), and the deps (`class-variance-authority`, `@radix-ui/react-slot`) are installed.

**Rule:** A shared primitive's present limitations are never an argument against reusing it.
Use shadcn/radix/tailwind where we can; if the primitive falls short, **upgrade it to the
canonical standard first, then build on it** — drop to a custom component only when reuse is
genuinely unjustified after that. Judge the primitive by what it should be, not its current
degraded state.

**How to apply:** Before rejecting a `components/ui/` primitive, check (a) the in-repo
canonical exemplar (e.g. `button.tsx`) for the proper pattern and (b) that the deps already
exist. If they do, restore the primitive to that standard (cva variants, `asChild` via
`Slot`, forward `...props`/`className`/`style`, semantic color tokens) so it serves this and
future consumers, then compose on top. Custom-from-scratch is the fallback, not the reflex.
