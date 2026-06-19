# 0015 — Never return Error instances from a Server Action and discriminate by name on the client

**What happened:** Demo-mode mutations showed the correct toast locally but
"Failed to save. Please try again." in production. The cause: actions _returned_
the error as an `Error` instance (`err(new DemoModeError())`) and the client
discriminated by `error.name === "DemoModeError"` (Decision #140/#143). React
Flight serializes a returned value across the Server Action → client boundary,
and it treats `Error` differently per environment: in **dev** it sends
`{ name, message, stack }` (so `error.name` survives, masking the bug); in
**prod** the vendored serializer does `if (value instanceof Error) return "$Z";`
— the whole error collapses to a bare tag with no fields, the client rebuilds a
generic `Error` (`name === "Error"`), and every `name`/`message`/`instanceof`
check fails. Tests only asserted on the in-memory server object, never crossing
the serialization boundary, so nothing caught it. I had asserted (not verified)
that an Error's `name` survives the boundary — exactly the kind of
version-specific framework behavior the global rules say to check, not assume.

**Rule:** A value that crosses a Server Action → client boundary must be **plain
serializable data**. Never return an `Error` instance (any subclass, including
the base `DomainError`) inside a `Result` and discriminate it on the client by
`name`, `message`, or `instanceof` — those are stripped in production. Adding a
field to the Error class does not help: the entire instance is stripped.
Discriminate by a plain string `code`. An `Error` instance is allowed only on the
server-only throw path (rebuilt at `unwrapOrThrow` via `toThrowable`, so pino and
Sentry still get a real Error). Documented decisions are not exempt — a
documented approach that is wrong is still wrong (CLAUDE.md §1.8).

**How to apply:** Returned errors use the `appError.*` factories →
`TAppError = { code: … }` (`lib/errors.ts`); clients check
`error.code === ERROR_CODES.X` and read inline text via `errorMessage(error)`.
When adding any new returned-error shape, confirm it is plain data (a quick
`expect(x).not.toBeInstanceOf(Error)` locks it — see `lib/__tests__/errors.test.ts`),
and verify environment-dependent framework behavior in the actual source/docs
before relying on it, rather than from memory. Full background:
`.claude/instructions/action-error-serialization.md`.

**Now compiler-enforced:** `err` is constrained to `<E extends TAppError>`
(`lib/errors.ts`), so passing a non-`TAppError` payload (e.g. an `Error` instance) is
a compile error at the call site — everywhere, independent of the enclosing
function's return annotation. The rule no longer rests on annotation discipline or
the runtime factory test alone. A `@ts-expect-error`-guarded `err(new DemoModeError())`
in `lib/__tests__/errors.test.ts` locks it (test files are in the `tsc --noEmit`
include, so the directive is enforced). The domain `err` is for `TAppError` only; a
subsystem with a deliberately non-domain error channel must define its own
constructor rather than reuse `err` — e.g. the notifications infra channel
(`features/notifications/result.ts`, `infraFail`) carries free-form external-service
diagnostics that never cross as a domain error.
