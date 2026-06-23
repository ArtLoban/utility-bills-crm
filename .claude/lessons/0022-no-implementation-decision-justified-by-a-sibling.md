# 0022 — Don't justify keeping an implementation by what a sibling slice does

**What happened:** When refactoring `/art-admin/users`, I left `query-params.ts`
hand-rolled and justified it as "the established admin param pattern, identical to
`art-admin/properties`." That is the exact forbidden argument ("the project already
does X") — a re-violation of [[0001-existing-code-is-not-a-convention]]. The
hand-rolled parser duplicated `lib/utils/query-parsers.ts` (page/pageSize-clamp/
sortOrder) and redefined `PAGE_SIZE_MAX/DEFAULT` locally — a DRY breach
([[0014-hoist-shared-constants-no-cross-file-duplication]]).

**Rule:** Never justify keeping (or copying) an approach by pointing at another
slice/file that does the same. A sibling doing X is evidence of _what was done_, not
_what should be done_. Evaluate every kept decision on its own merits (DRY, shared
source of truth, type-safety) — and if a shared primitive already covers it, reuse the
primitive. This applies to code you _leave unchanged_ in a refactor, not just new code.

**How to apply:** For list-page URL param parsing, reuse `lib/utils/query-parsers.ts`
(`baseListSearchParams` + nuqs `createLoader`), as bills/meters do — do not hand-roll
page/pageSize/sortOrder parsing. More generally: before writing "X already does it" in
a rationale, stop — that sentence is never a justification. State the merit instead, or
change the approach.
