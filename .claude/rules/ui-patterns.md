# UI patterns

Architectural principles for building and refactoring UI components.
Read this before refactoring any component.

These principles apply universally — not just to modals or forms.
The PropertyModal refactor is used as an illustrative example throughout.

---

## 1. Separation of concerns

Every non-trivial component has three distinct responsibilities. Keep them in separate units.

| Layer                    | What it does                              | What it does NOT do                      |
| ------------------------ | ----------------------------------------- | ---------------------------------------- |
| **Logic** (custom hook)  | State, derived values, API calls, effects | Render anything                          |
| **UI** (component)       | Render only — receives all data via props | Own state, call APIs                     |
| **Composition** (parent) | Wire logic + UI together                  | Contain business logic or render details |

The composition layer is a thin orchestrator. If it grows beyond wiring, something is in the wrong layer.

### Hook naming: by responsibility, not by consumer

```ts
usePropertyForm; // correct — describes what it manages
usePropertyModal; // wrong — describes who uses it
```

### Example

```
usePropertyForm   ← all stateful logic (form state, validation, server actions)
PropertyForm      ← pure controlled UI (receives form, errors, set — renders fields)
PropertyModal     ← composition: calls hook, passes results to Modal + PropertyForm
Modal             ← generic shell: knows nothing about the content inside
```

If you find yourself passing `open` or `onOpenChange` into a "pure UI" component — stop.
That component is leaking modal concerns into its interface.

---

## 2. Pure controlled components

A UI component should be a pure function of its props.

```tsx
// correct — no internal state, no side effects
const PropertyForm = ({ form, errors, set }: TProps) => { ... };

// wrong — UI component that manages its own data
const PropertyForm = ({ property }: TProps) => {
  const [form, setForm] = useState(...); // ← logic leaked into UI
};
```

When you see `useState`, `useEffect`, or server action calls inside a component that
renders fields/options — extract them to a custom hook.

---

## 3. Tailwind vs inline styles

**Static values → Tailwind. Runtime-computed values → inline `style`.**

Runtime values that must be inline:

- CSS custom properties: `var(--field-tint-border)`, `var(--muted-foreground)`
- Values that depend on JS state: `border: \`1px solid ${isSelected ? ... : ...}\``

Static values that must be Tailwind (not inline):

- Layout: `flex`, `flex-col`, `items-center`, `gap-4`
- Spacing: `px-2`, `py-2.5`, `mb-1.5`
- Typography: `text-sm`, `font-medium`, `text-xs`
- Visual: `rounded-lg`, `cursor-pointer`, `transition-colors`, `duration-150`

Mixed example:

```tsx
<button
  className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg px-2 py-2.5"
  style={{
    border: `1px solid ${isSelected ? "var(--field-tint-border)" : "var(--type-card-border)"}`,
    background: isSelected ? "var(--field-tint-bg)" : "var(--type-card-bg)",
  }}
>
```

---

## 4. Design tokens

### Standard scale before custom tokens

Before adding a custom Tailwind token — check if the standard scale is close enough.
A deviation of 0.5–1px is imperceptible; don't add a token for it.

```ts
// design says 13.5px → use text-sm (14px). No custom token.
// design says 15px → no standard token exists → add --font-size-md to globals.css
```

Custom tokens are justified only when the value differs meaningfully from all existing
tokens and appears in multiple places.

### Semantic tokens before hardcoded values

```tsx
className="text-destructive"      // correct
className="text-red-600"          // wrong — hardcoded color
style={{ color: "#dc2626" }}      // wrong — magic value
```

Check `globals.css` `@theme` block for available semantic tokens before reaching for
a hardcoded color or hex value.

---

## 5. Constants, types, and single source of truth

### Where things live

| What                                            | Where                                                  |
| ----------------------------------------------- | ------------------------------------------------------ |
| Types reused across files in a component folder | `component-folder/types.ts`                            |
| UI option lists, config arrays                  | `component-folder/constants.ts`                        |
| Business-rule limits (max lengths, thresholds)  | Slice schema file — e.g. `features/<domain>/schema.ts` |
| Types reused across multiple features           | `lib/types/` or `types/`                               |

### No magic numbers

Every hardcoded limit that appears in more than one place is a bug waiting to happen.
Define it once and import it everywhere:

```ts
// features/properties/schema.ts — source of truth
export const PROPERTY_LIMITS = { name: 100, address: 200, notes: 1000 } as const;

// used in schema:
z.string().max(PROPERTY_LIMITS.name, ...)

// used in component:
<Input maxLength={PROPERTY_LIMITS.name} />
```

### UI option lists do not belong in hooks

`TYPE_OPTIONS`, tab configs, select options — not in the hook, not hardcoded in the component.
The hook handles logic. The component handles rendering. The list lives in `constants.ts`.

### Domain string unions → const-object enum

Any string union that represents a domain concept (property type, role, status, etc.) and
appears in 2+ places **must** be defined as a const-object enum.

```ts
// Example
export const PROPERTY_ROLES = {
  OWNER: "owner",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

export type TPropertyRole = (typeof PROPERTY_ROLES)[keyof typeof PROPERTY_ROLES];
```

---

## 6. Shared vs private components

A newly extracted component starts as private to its parent folder.
It moves to `components/` (shared) when needed in **2 or more places** — not before.

Exception: if a component has no domain knowledge from the start (e.g. `FormField`,
`EmptyState`, `SectionHeader`) — place it in `components/` immediately.

The question to ask: _"Does this component know anything about properties / bills / payments?"_
If yes — it belongs in `features/<domain>/components/`. If no — it belongs in `components/`.
