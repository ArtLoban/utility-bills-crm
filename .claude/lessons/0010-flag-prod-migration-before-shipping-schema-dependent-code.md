# 0010 — Schema-dependent code needs the prod migration flagged before deploy

**What happened:** Notification slices 2–3 added migrations (`0021`–`0023`) and shipped code that
unconditionally reads the new tables (Settings reads `telegram_channels`). The code was deployed
to prod, but the migration was not applied there — prod 500'd with `relation "telegram_channels"
does not exist` (42P01). The project has no automated migration-on-deploy (migrations are manual,
#149), so this gap is invisible unless flagged.

**Rule:** Whenever a change adds or alters a migration, the production migration is a **required,
explicitly-stated deploy step** — call it out at delivery, every time, until auto-migrate-on-deploy
exists (`.claude/instructions/deploy-auto-migrate.md`). New code may assume its own migration ran;
the deploy must guarantee it. Never silently ship migration-dependent code.

**How to apply:**

- At delivery of any change touching `lib/db/migrations/` (or `lib/db/schema/`), state plainly:
  "This adds migration `00NN`; run `npm run db:migrate` against the prod **direct** endpoint before
  or with this deploy." Give the exact command.
- Migrations must target the **direct (unpooled)** Neon endpoint (#149), not the pooler.
- Don't make the reading code defensively swallow a missing table — that masks the real problem.
  The invariant is "migrate before deploy," not "tolerate an un-migrated DB."
