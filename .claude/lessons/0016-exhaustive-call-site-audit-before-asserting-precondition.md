# 0016 — An exhaustive-audit precondition must be audited exhaustively, before asserting it

**What happened:** A task to constrain `err` to `TAppError` had an explicit
precondition: confirm no call passes a non-`TAppError` value, else stop and report.
I scanned the call sites with a `grep … | head -100`, saw only `appError.*` results,
and wrote "precondition PASSED" into the plan. The truncated output hid
`features/notifications/telegram.ts`, which legitimately returns `Result<void, string>`.
tsc found it the moment I applied the change — exactly the case the precondition told
me to catch _before_ touching code. I also first defended that call site with "the
author documented it as infra errors," which is a §1.8 violation.

**Rule:** When a task makes a claim about _every_ occurrence (a precondition to check
all call sites, "no X anywhere", a global invariant), the audit backing that claim must
be **complete** — never `head`/truncate the search, and prefer a count or a
boundary-checked query (`grep -c`, then read all) over a glance. Do not write "checked,
passed" until the search is exhaustive. And judge an outlier on its merits (§1.8): its
existence is neither proof it's wrong nor proof it's right.

**How to apply:** Before asserting a whole-codebase precondition, run the search without
a line cap and verify the total (`grep -rn … | wc -l`, then inspect all hits, or rely on
the compiler/tests to enumerate). If you catch yourself justifying an exception by "the
author wrote it that way," stop and evaluate the design instead. When the exhaustive
audit surfaces a real exception, honor the task's "stop and report" instruction rather
than working around it silently.
