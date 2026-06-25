# 0023 — Destructure once; never repeat the same access prefix down a block

**What happened:** In `build-action-input.ts` I wrote `values.serviceTypeId`,
`values.serviceNotes`, `values.providerId`, … and `values.meter.*` — repeating the
`values.`/`values.meter.` prefix on a dozen lines. The author flagged it as duplication
(a repeat of the earlier `provider?.` correction in the providers migration) and asked
for this lesson explicitly.

**Rule:** When you read 3+ properties off the same object (a function param, `props`, a
watched form value, a query row), **destructure it once** at the top of the scope and use
the bare names. Repeating `obj.x` on line after line is noise that hurts readability and
invites drift; the destructure states the shape used and reads cleanly. Same for a nested
object used in a branch — destructure it where the branch begins.

**How to apply:** Before writing the second `sameObject.foo` in a block, stop and
destructure: `const { foo, bar, baz } = sameObject;`. For a nested object touched only in
one branch, destructure inside that branch (`const { a, b } = obj.nested;`). This applies
to component props, hook return values, RHF `getValues()`/watched values, and DB rows
alike — not just function arguments.
