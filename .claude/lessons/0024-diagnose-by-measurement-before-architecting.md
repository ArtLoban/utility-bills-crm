# 0024 — Diagnose by measurement before architecting a fix

**What happened:** The public-routes caching task (Decision #158) was built on the assumption that
anonymous DB traffic came from session/auth access in the public render path. A whole architecture
was designed around it: two per-surface root layouts, client auth islands, a next-intl workaround,
and a sign-out hack. The premise was never established. The real cause was the landing CMS reads
wrapped in React `cache()` — which dedupes within a request, not across requests — while `auth()`
never queried the DB for an anonymous request at all (database session strategy returns null
without a query when no session cookie is present). The verification that proved this ("0 SQL
without a session cookie, 1 with") was produced, read, and approved — by the author and by me —
and neither of us checked it against the premise. The architecture shipped, produced a header
flash, and was reverted in full (#159).

**Rule:** Before designing a fix, establish **by measurement** what the actual cause is — not what
it plausibly is. A list of plausible candidates is a hypothesis to test, never a diagnosis to build
on. And when a verification result sits adjacent to the premise, check it against **the premise**,
not only against the requirement it was run to satisfy: the same result can confirm "the requirement
is met" and prove "the premise was false," and the second reading is the one that gets missed.

**How to apply:**

- For any performance/cost/behavior problem, name the suspected cause and prove it before writing
  code — query logs, a counter, a targeted experiment isolating one candidate. "Plausible causes
  include X, Y, Z" is where diagnosis starts, not where it ends.
- **Prove each candidate separately.** #158 listed four dynamic-rendering triggers and treated the
  chain as the cause; only one of them (uncached reads) actually touched the DB. A shared symptom
  is not a shared cause.
- When you run a verification, read the result twice: once against the requirement, once against the
  premise. If it reports "no DB query happened here," ask what that implies about why you believed
  there was one.
- **A chain of workarounds, each holding up the previous one** (island → flash → module cache →
  full-page navigation → an extra cookie), is evidence that the premise is wrong — not that the work
  is nearly done. Stop and re-derive the cause instead of adding the next link.
- Applies to a task brief too: a brief that asserts a cause is stating a hypothesis, however
  confidently worded. Verify it before building on it (§1.8 —
  [[0001-existing-code-is-not-a-convention]] extends to documented assumptions, not just code).

Related: [[0013-prefer-scalable-fix-over-the-easy-breakpoint-bump]] (solve the cause, not the
symptom), [[0016-exhaustive-call-site-audit-before-asserting-precondition]] (don't assert a
precondition you haven't fully checked), [[0015-no-error-instances-across-server-action-boundary]]
(verify framework behavior against the source, not memory).
