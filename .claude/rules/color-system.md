# Color system

How colors are defined, used, and extended in this project.
Read before adding any new color or refactoring color-related code.

Background and rationale: `.claude/info/color-system.md`

---

## Where colors live

All color **values** live in `app/tokens.css`, organized in three layers (see the header
comment there): Layer 1 primitives → Layer 2 semantic/domain aliases → Layer 3 component-scoped
(colocated in the component's CSS module). `app/globals.css` holds **no values** — its
`@theme inline` block only maps existing tokens to Tailwind utilities (`--color-*`).

| Category                                                                                                      | Location                                                                                                  | Format                     |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------- |
| Primitive palette (`--purple-600`, `--neutral-200`, `--amber-500`…)                                           | `app/tokens.css` — Layer 1                                                                                | `oklch(...)`               |
| Semantic + domain tokens (`--primary`, `--border`, `--service-electricity`, `--zone-t1`, tints, role/avatar…) | `app/tokens.css` — Layer 2                                                                                | `var(--primitive)` aliases |
| Component-scoped tokens                                                                                       | colocated CSS module (e.g. `mockup.module.css`)                                                           | any                        |
| Tailwind utility mapping (`bg-primary`, `text-service-gas`…)                                                  | `app/globals.css` — `@theme inline`                                                                       | `var(--token)`             |
| JS consumers (chart configs, inline styles)                                                                   | `features/services/service-type.ts` (`SERVICE_TYPE_COLORS`), `lib/constants/zones.ts` (`ZONE_COLOR_VARS`) | `var(--…)` — **not** hex   |

JS mirrors hold `var(--…)`, never hex. Recharts works because the shadcn chart wrapper injects
each config color as a `--color-<key>` custom property, and `var()` resolves in SVG `fill` /
`stroke` end-to-end (supported in current Chrome/Firefox/Safari). No hex mirror and no manual
sync are needed — a single source of truth in `tokens.css` covers CSS and JS alike.

---

## Adding a new color

**New service type:**

1. Add a primitive to `tokens.css` Layer 1 if the hue is new (e.g. `--teal-500: oklch(...)`).
2. Add the semantic alias to Layer 2: `--service-newtype: var(--teal-500);` (+ a `.dark {}`
   override there if it needs a dark variant).
3. Only if you need `bg-/text-service-*` classes — expose the utility in `globals.css`
   `@theme inline`: `--color-service-newtype: var(--service-newtype);`.
4. Add the JS entry to `SERVICE_TYPE_COLORS` in `features/services/service-type.ts` as
   `"var(--service-newtype)"` (never hex).

**New UI state / semantic color:**

1. Check if an existing token fits (`--destructive`, `--muted-foreground`, `--primary`…).
2. If not — add it to `tokens.css` (a Layer 1 primitive if the hue is new, then a Layer 2
   semantic alias). Expose it in `globals.css` `@theme inline` only if a Tailwind class is needed.
3. Never hardcode hex in a component file.

---

## Dark mode

Redefine variables in `.dark {}` in `app/tokens.css`. Never pass theme-dependent colors as props
or compute them in component logic — the browser handles it via CSS variables.

---

## Anti-patterns

```ts
// hardcoded hex in a component — forbidden
style={{ background: "#7c3aed" }}

// hex suffix tint — fragile, only works with hex input
style={{ background: `${color}1A` }}

// Tailwind hardcoded color class — outside the design system
className="text-red-600"

// explicit background prop for tinting — always derive via color-mix()
<Row iconBg="#ede9fe" iconColor="#7c3aed" />
```

Correct:

```ts
style={{ background: "var(--service-heating)" }}
style={{ background: `color-mix(in srgb, ${color} 10%, transparent)` }}
className="text-destructive"
<IconBadge icon={Icon} color={color} />
```
