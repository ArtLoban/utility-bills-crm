# Project structure

Where code lives in this project: the project-level topology.
Read this before creating new domain logic or deciding where a new file belongs.

This is the layer **above** `component-architecture.md`. That document governs a
single component (file vs folder, decomposition). This one governs where a
component, hook, action, or schema lives in the first place.

---

## 1. The three homes for code

Every piece of code belongs to exactly one of three places. Choosing correctly
is the point of this document.

**`features/<domain>/`** — domain logic. Anything that encodes a business
domain: its components, hooks, server actions, validation schemas, types. The
default home for new code. This is the target architecture (vertical feature
slices).

**`<route>/_components/` and `<route>/_data/`** — page assembly. Code that
exists only to assemble one specific route and is meaningful nowhere else.
Co-located with the route per Next.js convention (Decision Log #113).

**`components/`, `lib/`** — shared, domain-agnostic infrastructure. UI
primitives (`components/ui/`), the reusable data-table system, formatters, the
DB client, auth, logging, route config. Not tied to any single domain.

A legacy fourth location exists — `components/feature/`, `lib/actions/`,
`lib/validation/`. See section 5. New code never goes there.

## 2. What is a feature slice

A slice is a vertical cut through the app organized around **one business
domain** — a domain entity or a tightly related set of entities that share
server actions and validation.

Clear slices: `bills`, `payments`, `properties`, `meters`, `providers`.

Not slices:

- **`dashboard`** — it owns no entity; it composes data from other slices. It
  is a route that consumes slices, not a slice itself.
- **`sharing`** — it lives on the property access model; it belongs inside
  `properties/`, not as a separate slice.

If you are about to create a slice and cannot name the entity it owns — it is
probably not a slice. Stop and reconsider.

## 3. Internal structure of a slice

A slice grows the same way a component does (see `component-architecture.md`
§1): **a subfolder appears only when the entity it holds appears.** No
preemptive scaffolding. No empty `hooks/` folder because a slice "should" have
one.

A minimal slice can be a few files. A mature slice may look like:

```
features/bills/
  components/         domain components (BillsTable, BillFormModal, ...)
  hooks/              domain hooks
  actions.ts          server actions ('use server')
  schema.ts           Zod validation schemas
  types.ts            domain types
  index.ts            public API of the slice (see §4)
```

Rules:

- Subfolders (`components/`, `hooks/`) appear only when their entities exist.
- A single file is preferred over a folder until there are several entities —
  `actions.ts` becomes `actions/` only when one file no longer fits. Same logic
  as a component growing from file to folder.
- Components inside a slice follow `component-architecture.md` unchanged — file
  vs folder, decomposition, one file one component. The slice does not override
  those rules; it is the container for them.

## 4. Slice boundaries — what is public

A slice has a **public API** and **internals**. Other slices and routes import
only the public API.

- `index.ts` at the slice root declares what is public — explicit named
  re-exports, not `export *`. This is the one legitimate barrel in the project
  (consistent with `code-style.md` §3, "public API boundary of a shared
  module").
- Everything not re-exported from `index.ts` is private to the slice. Routes
  and other slices must not deep-import a slice's internals.
- A slice may depend on another slice's public API. It must not reach into
  another slice's internals.
- If two slices need the same thing — it is not domain logic of either. It
  moves to shared infrastructure (`components/`, `lib/`).

## 5. Legacy layout and migration

`components/feature/`, `lib/actions/`, `lib/validation/` are the **legacy
horizontal layout** — domain code split by technical layer instead of by
domain. This is the structure being migrated away from.

Rules:

- **New domain code never goes into the legacy layers.** It goes into
  `features/<domain>/`.
- **Migration is opportunistic, not forced.** Encountering a domain still in
  the legacy layout is expected and is not a bug. A small task touching a
  legacy domain does not have to migrate the whole domain — that would make
  every bugfix unbounded.
- When you touch legacy domain code, rule 1.8 of `CLAUDE.md` applies: flag the
  divergence, note the migration as tech debt, but do not silently treat the
  legacy structure as the target.
- Full migration of a domain into a slice is its own deliberate task, scoped on
  its own.

## 6. Decision shortcut

Before placing a new file, in order:

1. Does it encode a business domain? → `features/<domain>/`.
2. Is it domain-agnostic and reusable across domains? → `components/` or
   `lib/`.
3. Does it only assemble one specific route and serve no domain by itself? →
   that route's `_components/` or `_data/`.
4. Is it tempting to put it in `components/feature/`, `lib/actions/`, or
   `lib/validation/`? → it is not. See sections 4 and 5.
