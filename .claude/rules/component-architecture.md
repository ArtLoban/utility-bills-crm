# Component architecture

When and how to structure React components in this project.
Read this before creating or refactoring any component.

---

## 1. File vs folder: when does a component need its own folder?

A component lives as a **single file** (`components/user-avatar.tsx`) when it
has no own dependencies — no subcomponents, no own hooks, no own utilities,
no own constants or types worth extracting.

A component lives as a **folder with `index.tsx` entry point** when it has at
least one own dependency:

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
  constants.ts    // constants reused inside the folder
```

Rules:

- The entry point is always `index.tsx`. Exported component name matches the
  folder name in PascalCase: `admin-nav/` → `AdminNav`.
- Subfolders `components/`, `hooks/`, `utils/` are created only when the
  corresponding entities appear. No hooks → no `hooks/` folder.
- `types.ts` and `constants.ts` are created only when there are several or
  they are reused inside the folder. A single props type or one constant
  stays in `index.tsx`.
- Do not create a folder preemptively. A simple component with no dependencies
  stays as a single file.
- `styles.ts` (separate TypeScript module for CSS-in-JS exports) is not used.
  Styles live in the component itself: Tailwind utilities in JSX, or colocated
  `styles.module.css` for CSS Modules.

Subcomponents apply the same logic recursively: a subcomponent without its own
internals lives as a file (`components/nav-link.tsx`); a subcomponent with its
own hooks/utilities/types lives as a folder
(`components/nav-link/index.tsx` + the rest).

## 2. One file — one component

A file always contains exactly one component. Subcomponents are extracted into
separate files according to section 1.

## 3. Subcomponent privacy and promotion

Subcomponents in a component's `components/` folder are **private to the
parent**. If a subcomponent is needed in **2 or more places** — it stops being
a subcomponent and moves to the shared `components/` directory at the
appropriate level.

## 4. When to decompose a component

A component must have a **single responsibility**. Decompose into subcomponents
when at least one of these triggers is met:

1. **Separator comments.** JSX contains comments like `{/* Desktop nav */}`,
   `{/* Header */}`, `{/* Footer */}`. Each such comment is a candidate for a
   separate component with a meaningful name.
2. **Multiple responsibilities.** A single component contains logically
   independent blocks that may change for different reasons (e.g., desktop
   navigation, mobile menu, user menu — different entities).
3. **JSX duplication.** The same JSX fragment is rendered more than once
   inside the component (or a family of related components).

After decomposition, the main component becomes an **orchestrator**: short JSX
where the structure of named subcomponents is visible at a glance.

## 5. When NOT to decompose

Size alone is not a sufficient reason. A large but logically cohesive component
with a single responsibility does not need to be broken up — even if it doesn't
fit on one screen.

Specifically, do not extract:

- A 2–3 line JSX block used once.
- A block for which you have to invent a meaningless name (`SomeSection`,
  `RightPart`). No name — no entity.
- A block that requires passing 5+ props that are internal details of the
  parent. This signals the block is not a standalone entity.
