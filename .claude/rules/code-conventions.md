# Code conventions

Conventions for writing and refactoring React components in this project.
Apply to all new components and during refactoring of existing ones.

---

---

## 1. Component structure: folder with `index.tsx` entry point

A component with any "own" dependencies (subcomponents, hooks, utilities,
separate types or constants) lives in its own folder:

```
admin-nav/
  components/
    nav-link.tsx
    admin-badge.tsx
  hooks/
    use-active-path.ts
  utils/
    build-nav-links.ts
  index.tsx       // main AdminNav component
  types.ts        // types reused inside the folder
  constants.ts        // constants reused inside the folder
```

**Rules:**

- Entry point is always `index.tsx`. The exported component name matches the folder name in PascalCase: `admin-nav/` → `AdminNav`.
- Create a folder when the component has at least one "own" dependency: a subcomponent, hook, utility, or a separate file for types/constants. A simple component with no dependencies stays as a single file (`components/user-avatar.tsx`) — do not create a folder preemptively.
- Subfolders `components/`, `hooks/`, `utils/` are created only as the corresponding entities appear. No hooks → no `hooks/` folder.
- `types.ts` and `constants.ts` are created only when there are several types/constants or they are reused inside the folder. A single props type or one small constant stays in `index.tsx`.
- `styles.ts` (a separate TypeScript module for CSS-in-JS exports) is not used. Styles live in the component itself, according to the project's styling approach:
  - **Tailwind**: utility classes directly in JSX.
  - **CSS Modules**: a colocated `styles.module.css` file.
  - **CSS-in-JS** (MUI `sx`, emotion `css`): inline in JSX, not extracted to a separate file.
- Subcomponents apply the same logic recursively: a subcomponent without its own internals — a file (`components/nav-link.tsx`); a subcomponent with its own hooks/utilities/types — a folder (`components/nav-link/index.tsx` + the rest).
- Subcomponents are private to the parent. If a subcomponent is needed in **2 or more places** — it stops being a subcomponent and moves to the shared `components/`.

---

## 2. One file — one component

A file always contains **exactly one component**. Subcomponents are extracted into separate files according to the structure in section 1.

---

## 3. Type naming

- Custom types use the `T` prefix: `TProps`, `TUser`, `TFormState`.
- The component's props type is always named `TProps` (the context is unambiguously set by the rule "one file — one component").
- Other local types in the file are named by meaning, without the component name as a prefix: `TFormState`, `TLinkConfig`, `TValidationResult`.
- If a type is reused across several files inside the component's folder — extract it into `types.ts` with a meaningful name (`TNavLinkConfig`, not `TProps`).
- If a type is reused outside the component's folder — extract it into the project's shared types layer (`lib/types/` or `types/`).

**Exceptions:**

- Inline types in function signatures.
- Props defined directly on the component parameter (when there are 1–2 simple props and a separate type adds more noise than value).
- Do NOT rewrite types in `components/ui/` — that's shadcn territory.

```ts
// correct
type TProps = { amount: number };
type TUser = typeof users.$inferSelect;

// wrong
type Props = { amount: number };
type User = ...;
```

---

## 4. Functions — arrow vs declaration

Use arrow functions for all custom utilities, hooks, helpers, and non-page/non-layout components:

```ts
// correct
const formatCurrency = (amount: number): string => { ... };
const useSession = () => { ... };
const UserAvatar = ({ name }: TProps) => <img ... />;

// wrong
function formatCurrency(amount: number): string { ... }
```

**Exceptions:** `page.tsx` and `layout.tsx` files use `export default function` declarations — matches the Next.js idiom.

---

## 5. Component decomposition

A component must have **a single responsibility**. If at least one of the triggers below is met — the component should be decomposed into subcomponents:

1. **Separator comments.** JSX contains comments like `{/* Desktop nav */}`, `{/* Header */}`, `{/* Footer */}`. Each such comment is a candidate for a separate component with a meaningful name.
2. **Multiple responsibilities.** A single component contains logically independent blocks that may change for different reasons (e.g., desktop navigation, mobile menu, user menu — these are different entities).
3. **JSX duplication.** The same JSX fragment is rendered more than once inside the component (or a family of related components).

**Size is a soft recommendation, not a rule.** A large but logically cohesive component with a single responsibility does not need to be broken up — even if it doesn't fit on the screen. Length alone is not a sufficient reason for decomposition.

After decomposition the main component becomes an "orchestrator": short JSX where the structure of named subcomponents is visible at a glance.

**Decomposition limits — when NOT to split:**

- Do not extract a 2–3 line JSX block used once.
- Do not extract a block for which you have to invent a meaningless name (`SomeSection`, `RightPart`). No name — no entity.
- Do not extract a block that requires passing 5+ props which are internal details of the parent. This signals that the block is not a standalone entity.

---

## 6. Barrel files — avoid

Do not create `index.ts` re-export barrels inside `components/`, `hooks/`, or `utils/` subfolders.

**Why:** barrel files break tree-shaking, slow down cold builds (the bundler must process the entire barrel to resolve a single import), and obscure where things actually live.

The `index.tsx` at the root of a component folder is the component's own entry point — that is a component file, not a re-export barrel. It is the one legitimate index file in a component folder.

```ts
// correct — import directly from the source file
import { UserAvatar } from "@/components/user-avatar";

// wrong — re-export barrel obscuring the real location
import { UserAvatar } from "@/components";
```

The only acceptable use of a barrel is at the **public API boundary of a shared module** (e.g., a `features/auth/index.ts` that explicitly declares what is public). Even then, prefer explicit named exports over re-exporting everything.
