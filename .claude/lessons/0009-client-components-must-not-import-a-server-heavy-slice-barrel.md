# 0009 — A client component must not import a server-heavy slice barrel

**What happened:** The Settings Telegram hook (`"use client"`) imported its server actions from
the slice barrel `@/features/notifications`. That barrel also re-exports server-only modules
(`channel`/`linking`/`delivery`), which transitively load `lib/db/client.ts` — and that runs
`new Pool()` at module load. A side-effectful module can't be tree-shaken, so the client import
dragged the whole server graph into the browser bundle: **`Module not found: Can't resolve 'dns'`**
(from `pg`).

**Rule:** A client component imports server actions **directly from the `"use server"` module**
(e.g. `@/features/notifications/linking-actions`), never through a slice barrel that also re-exports
server-only (DB) code. A `"use server"` module compiles to RPC stubs on the client, severing the
server graph; a barrel that mixes actions with side-effectful server modules does not.

**How to apply:**

- Before importing from a `@/features/<slice>` barrel inside a `"use client"` file, check what the
  barrel re-exports. If it includes anything that reaches `lib/db/client` (queries, delivery,
  webhook logic), deep-import the specific `"use server"` action module instead.
- A barrel is only client-safe when its entire graph is either `"use server"` or pure (the
  `features/profile` barrel is — it exports just actions + schema). Slices with a real server-only
  public API (cron/webhook/delivery) cannot be fully client-safe; their clients deep-import.
- Type-only imports from such a barrel are fine (erased at compile). The hazard is runtime values.
- Verify boundary changes with `next build` (not just `tsc` or a dev redirect): the client bundle
  is only compiled when a route actually renders the client component.
