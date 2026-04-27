# TypeScript conventions

## Verify type assertions before adding them

Before adding `as SomeType`, `as const`, or any type cast — verify it is
actually required: remove it and run `npx tsc --noEmit`.
If tsc passes without it, don't add it.

Type assertions that silence the compiler without enforcing anything
are noise, not safety.
