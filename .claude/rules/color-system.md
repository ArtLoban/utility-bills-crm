# Color system

How colors are defined, used, and extended in this project.
Read before adding any new color or refactoring color-related code.

Background and rationale: `.claude/info/color-system.md`

---

## Where colors live

| Category                                                  | Location                          | Format                         |
| --------------------------------------------------------- | --------------------------------- | ------------------------------ |
| Design system tokens (`primary`, `muted`, `destructive`…) | `app/globals.css :root`           | `oklch(...)` — shadcn standard |
| Service colors (electricity, gas, water…)                 | `app/globals.css :root`           | hex                            |
| Component tint tokens (field fill, type cards…)           | `app/globals.css :root`           | hex                            |
| JS consumers that need hex (Recharts SVG `fill`)          | `lib/constants/service-colors.ts` | hex mirror of CSS vars         |

`SERVICE_COLORS` stays hex intentionally — SVG `fill` attributes don't resolve CSS variables.
Keep it in sync with `globals.css` manually when changing a service color.

---

## Adding a new color

**New service type:**

1. Add to `globals.css :root`: `--service-newtype: #hexvalue;`
2. Add matching hex to `SERVICE_COLORS` in `service-colors.ts`
3. Add `.dark {}` override if the color needs a dark-mode variant

**New UI state / semantic color:**

1. Check if an existing shadcn token fits (`--destructive`, `--muted-foreground`, `--primary`…)
2. If not — add a CSS variable to `globals.css :root` with a semantic name
3. Never hardcode hex in a component file

---

## Dark mode

Redefine variables in `.dark {}` in `globals.css`. Never pass theme-dependent colors as props
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
