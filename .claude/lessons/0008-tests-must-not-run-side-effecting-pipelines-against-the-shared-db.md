# 0008 — Tests must not run side-effecting pipelines against the shared DB

**What happened:** A cron-route auth test (slice 2) exercised the 200 path by calling the
real route handler, which ran the full `deliverDueReminders()` pipeline against the live
`.env.local` database and the real wall-clock date — claiming idempotency-ledger rows for
real users that nothing cleaned up. The whole suite already shares the dev/demo DB (no
isolated test database; `tests/setup.ts` loads `.env.local`), so this silently pollutes
real data.

**Rule:** A test must never execute a side-effecting pipeline (sends, claims, writes,
re-seeds) against the shared database with the real clock and an unscoped row set. Test the
gate, not the consequences: mock the pipeline at the boundary, or pin an injected clock AND
scope+clean every row the test touches.

**How to apply:**

- Route-handler/auth tests: mock the delivery/business function the route calls
  (`vi.mock` the barrel/module) so 200 proves authorization, not real work. Assert the
  pipeline was/ wasn't invoked — never let it run.
- Any test that does run real DB work: inject the clock (`now`) so it can't read "today,"
  scope every query/cleanup to its own fixture ids, and remove every row it created.
- Until a dedicated test DB exists (deferred task: test-DB isolation,
  `.claude/instructions/test-db-isolation.md`), assume `npm test` writes to your real dev
  data — run targeted files, not the full suite, when iterating, and keep the demo-seed
  test in mind (it re-seeds all `isDemo` rows).
