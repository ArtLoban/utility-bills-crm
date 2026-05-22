# Code style

Naming, function form, and file organization rules.
Read this before writing or refactoring code.

These rules will eventually be enforced by ESLint where possible. Until then,
follow them manually.

---

## 1. Type naming: `T` prefix

Custom types use the `T` prefix:

```ts
// correct
type TProps = { amount: number };
type TUser = typeof users.$inferSelect;
type TFormState = { ... };

// wrong
type Props = { amount: number };
type User = ...;
```

Rules:

- The component's props type is always `TProps`. Context is unambiguous —
  one file contains one component.
- Other local types in the file are named by meaning, without the component
  name as a prefix: `TFormState`, `TLinkConfig`, `TValidationResult`.

Where a type lives, by reuse scope:

- Used only in one file → keep it in that file.
- Reused across files inside a component's folder → extract to that folder's
  `types.ts` with a meaningful name (`TNavLinkConfig`, not `TProps`).
- Reused across a feature slice → the slice's `features/<domain>/types.ts`.
- Reused across slices, or otherwise application-wide → the shared types layer
  `lib/types/`.
- Ambient declarations that augment third-party modules (`.d.ts` with
  `declare module`) → `types/` at the project root. This is not a domain-types
  layer — only third-party augmentation lives there.

Exceptions:

- Inline types in function signatures.
- Props defined directly on the component parameter (1–2 simple props where
  a separate type adds more noise than value).
- Do **not** rewrite types in `components/ui/` — that's shadcn territory.

## 2. Function form: arrow vs declaration

Use arrow functions for all custom utilities, hooks, helpers, and
non-page/non-layout components:

```ts
// correct
const formatCurrency = (amount: number): string => { ... };
const useSession = () => { ... };
const UserAvatar = ({ name }: TProps) => <img ... />;

// wrong
function formatCurrency(amount: number): string { ... }
```

Exception: `page.tsx` and `layout.tsx` files use `export default function`
declarations — matches the Next.js idiom.

## 3. No barrel files

Do not create `index.ts` re-export barrels inside `components/`, `hooks/`,
or `utils/` subfolders.

```ts
// correct — import directly from the source file
import { UserAvatar } from "@/components/user-avatar";

// wrong — re-export barrel obscuring the real location
import { UserAvatar } from "@/components";
```

Why: barrel files break tree-shaking, slow cold builds (the bundler must
process the entire barrel to resolve a single import), and obscure where
things actually live.

The `index.tsx` at the **root of a component folder** is the component's own
entry point — that is a component file, not a re-export barrel. It is the
one legitimate `index` file in a component folder.

The one acceptable re-export barrel is the **public API boundary of a feature
slice** — `features/<domain>/index.ts`, which explicitly declares what the
slice exposes (see `project-structure.md` §4). It uses explicit named
re-exports, never `export *`.

## 4. Inline exports

Export at the declaration site, never separately.

```ts
// correct
export const ComponentName = () => { ... };

// wrong
const ComponentName = () => { ... };
export { ComponentName };
```

## 5. Verify type assertions

Before adding `as SomeType`, `as const`, or any type cast — remove it and
run `npx tsc --noEmit`. If tsc passes without it, don't add it.

Type assertions that silence the compiler without enforcing anything are
noise, not safety.
