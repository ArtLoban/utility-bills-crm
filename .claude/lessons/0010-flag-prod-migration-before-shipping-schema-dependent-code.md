# 0010 — Schema-dependent code needs the prod migration flagged before deploy

**What happened:** Notification slices 2–3 added migrations (`0021`–`0023`) and shipped code that
unconditionally reads the new tables (Settings reads `telegram_channels`). The code was deployed
to prod, but the migration was not applied there — prod 500'd with `relation "telegram_channels"
does not exist` (42P01). The project has no automated migration-on-deploy (migrations are manual,
#149), so this gap is invisible unless flagged.

**Update (Decision #153): auto-migrate-on-deploy now exists.** Production deploys apply pending
migrations during the Vercel build (`vercel.json` `buildCommand` → `db:migrate:deploy`, gated on
`VERCEL_ENV === "production"`). For **additive** migrations (new tables / nullable columns / indexes)
no manual step and no flag is needed — the build applies them before the new code serves.

**Rule (now narrowed to destructive migrations):** additive migrations are handled automatically.
But a **destructive or narrowing** change (`DROP`, rename, adding `NOT NULL` to an existing column,
type narrowing) is **not** safe to ship in one deploy: during the build→promote window the old code
briefly serves the new schema. These require **expand/contract** across deploys and must be flagged
explicitly at delivery. New code may assume its own additive migration ran; never ship a destructive
schema change as a single step.

**How to apply:**

- Additive migration → no action; auto-migrate covers it.
- Destructive/narrowing migration → state plainly at delivery that it needs expand/contract
  (deploy tolerant code → additive migration → deploy code using new schema → later contract
  migration), and do not collapse it into one deploy.
- Migrations target the **direct (unpooled)** Neon endpoint (#149); on Vercel set
  `MIGRATE_DATABASE_URL` to the direct endpoint when `DATABASE_URL` is pooled.
- Don't make reading code defensively swallow a missing table — that masks the real problem.
  The invariant is "migrate before the new code serves," not "tolerate an un-migrated DB."
