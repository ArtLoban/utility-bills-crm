# Audit: current state of `pino` logging and Sentry error tracking

> Snapshot audit (2026-06-18). Analysis only — no code changes. Captures ground truth
> before scoping a Sentry integration. Where reality diverges from the docs, it is stated
> plainly (see Part C).

## Context

Before scoping a Sentry integration we need ground truth on what observability actually
exists in the codebase, because the documentation repeatedly describes behavior that may
not be backed by code ("logged to Sentry", "correlation ID propagates through logs").
This is an analysis-only deliverable: a written report of what _is_, with every
doc/reality divergence called out.

---

## Summary verdict

**pino — partially real, materially incomplete.**
A logger is defined and correctly configured for dev/prod (pretty stream vs JSON, level
switching). But three of the four documented properties are missing or unwired:

- **Redaction is not configured at all** — there is no `redact` option on the pino
  instance. The "no personal data in logs" rule is aspiration, not code.
- **Correlation ID does not propagate into logs.** The ID is generated in the proxy
  (Next 16 middleware) and forwarded on request/response headers, but it is _never_
  attached to the logger and _never_ appears in any actual log line. The two helpers
  meant to wire it (`withCorrelationId`, `getCorrelationId`) are dead code — defined,
  never called.
- **Usage is minimal** — exactly 4 call sites, all in the notifications/cron surface.
  Server Actions, the DB access layer, and the error boundaries log nothing.
  The Edge-runtime concern is handled correctly (pino is never imported into the proxy).

**Sentry — confirmed absent.**
No SDK dependency, no DSN consumption, no init, no instrumentation hook. The only
occurrence of the word "Sentry" in source is a string in the marketing stack list.
Every "logged to Sentry" statement in the docs is backed by nothing — `error.tsx`
doesn't even read the `error` prop, and `global-error.tsx` literally says "We've been
notified" while notifying no one. Integration surface is mapped below.

**Stack:** Next.js **16.2.4**, React/React-DOM **19.2.4** → Sentry setup must be the
**instrumentation-based** approach (`instrumentation.ts` + `instrumentation-client.ts`),
not the legacy `sentry.{server,client,edge}.config.ts` files.

---

## Part A — `pino`

### A1. Definition & configuration — `lib/logger/index.ts`

```ts
const isDev = process.env.NODE_ENV === "development";
const stream = isDev ? pretty({ colorize, ignore: "pid,hostname", translateTime }) : undefined;
export const logger = pino({ level: isDev ? "debug" : "info" }, stream);
export const withCorrelationId = (correlationId: string) => logger.child({ correlationId });
```

- **Levels:** `debug` in dev, `info` in prod. Environment-switched via `NODE_ENV`. ✅ real.
- **Transport:** `pino-pretty` as a _synchronous stream_ in dev (with a code comment
  explaining the worker-thread stdout problem under the Next dev server); plain pino JSON
  to stdout in prod (`stream === undefined`). ✅ real and deliberate.
- Deps present: `pino ^10.3.1`, `pino-pretty ^13.1.3`.

### A2. Redaction — **NOT configured**

- No `redact` option anywhere; no allow-list/deny-list of keys. The pino instance is
  constructed with only `{ level }`.
- The rule (`docs/MVP_definition.md:328`: "no personal data — emails, amounts, account
  numbers are not logged") is enforced by **nothing**. It currently holds only by
  accident, because the logger is barely called.
- What _is_ logged today already includes weakly-personal identifiers with no redaction:
  `chatId` (Telegram chat id) in the webhook, and `userId` in delivery failures. If
  emails/amounts were passed to `logger`, they would be emitted verbatim.

### A3. Correlation ID — header plumbing real, log propagation absent

- `proxy.ts:29` generates `correlationId = header ?? crypto.randomUUID()`, sets it on
  forwarded **request** headers (`:32`) and on the **response** headers (`:35`).
- Header name centralized in `lib/logger/constants.ts` (`x-correlation-id`). ✅
- `lib/logger/get-correlation-id.ts` reads it back from `next/headers` (falls back to
  `"no-correlation-id"`). **Never imported anywhere.**
- `withCorrelationId()` (creates a child logger bound to the id). **Never called anywhere.**
- **Net result:** no log line in the codebase carries a `correlationId` field. The chain
  generate → attach-to-logger → emit is broken after step 1. The doc claim ("propagates
  through logs") is not backed by code.

### A4. Runtime — handled correctly

- The proxy is `proxy.ts` (Next.js **16** renamed `middleware` → `proxy`; matcher
  `["/dashboard/:path*", "/art-admin/:path*"]`). It runs on the **Edge runtime** by
  default and **does not import pino** — it only uses `crypto.randomUUID()` (Edge-safe)
  and `NextResponse`. So there is no pino-on-Edge violation.
- Because the proxy never logs, the "correlation-ID-in-middleware" claim is _not_ backed
  by a logging call there; it's pure header forwarding. The two API routes that _do_ log
  pin themselves to Node explicitly (`export const runtime = "nodejs"` in both
  `app/api/cron/notifications/route.ts:5` and `app/api/telegram/webhook/route.ts:9`),
  with comments citing the non-edge `pg` driver — so pino always runs under Node. ✅
- The proxy matcher covers only `/dashboard` and `/art-admin`; it does **not** match
  `/api/*`, so the cron and webhook routes never receive a proxy-set correlation header
  anyway.

### A5. Actual usage — 4 call sites, narrow surface

Real log calls (entire codebase):
| Location | Call | Level |
| --- | --- | --- |
| `app/api/telegram/webhook/route.ts:29` | `{ chatId, bound }, "telegram /start processed"` | info |
| `app/api/cron/notifications/route.ts:25` | `summary, "reminder digest cron completed"` | info |
| `features/notifications/telegram.ts:61` | missing `TELEGRAM_WEBHOOK_SECRET` warning | warn |
| `features/notifications/delivery.ts:142` | `{ userId, deliveryDate, error }, "reminder digest send failed"` | error |

Conspicuously **absent**:

- **Server Actions** — `features/*/actions*.ts` have `catch` blocks (services, meters,
  contracts, tariffs, account-numbers, payment-details) but **none call `logger`**; they
  inspect the error (e.g. `isExclusionViolation`) and return `err(...)` or rethrow,
  silently.
- **Error boundaries** — `app/error.tsx` and `app/global-error.tsx` log nothing (see B2).
- **DB access layer** (`lib/db/access/*`) — no logging; returns `Result` values.
- **Auth/guards**, locale actions, etc. — no logging.

---

## Part B — Sentry

### B1. Truly absent — confirmed

- **No dependency**: no `@sentry/*` in `package.json`.
- **No init / no instrumentation hook**: no `instrumentation.ts`, no
  `sentry.*.config.ts`, no `Sentry.init`.
- **No DSN consumption**: `SENTRY_DSN` is _documented_ as an optional env var
  (`README.md:100`, `docs/README.living.md:725`) but **never read** in code.
- Only source occurrence of "Sentry": `app/(public)/project/_components/stack-section.tsx:23`
  — a string in the marketing page's tech-stack list (ironically advertising a tool that
  isn't wired).

### B2. "Logged to Sentry" claim — backed by nothing

- `app/error.tsx` receives `{ error, reset }` but **destructures only `reset`** — it never
  reads or reports `error`. No capture, no `console.error`, no TODO/stub.
- `app/global-error.tsx` also reads only `reset`, and its UI copy says _"We've been
  notified and are looking into it"_ — **false**; nothing is notified.
- No stub, no-op, dead import, or TODO referencing Sentry anywhere in code. The claim is
  purely documentation intent.

### B3. Integration surface (capture points — for later scoping, not built here)

- **App Router error boundaries:** `app/error.tsx`, `app/global-error.tsx` (and the Next
  16 instrumentation `onRequestError` hook, which doesn't exist yet).
- **Domain error model:** `lib/errors.ts` — `DomainError` hierarchy (`NotFoundError`,
  `ForbiddenError`, `ValidationError`, `DemoModeError`) + `Result<T,E>`. _Expected_ errors
  are returned, never thrown; _unexpected_ errors are thrown and bubble to `error.tsx`.
  The throw site is the Server-Component pattern documented in `lib/errors.ts:39-43`
  (`if (shouldHideAsNotFound) notFound(); else throw result.error`). These thrown,
  non-domain errors are the real capture targets.
- **Server Action catch paths:** `features/{services,meters,contracts,tariffs,account-numbers,payment-details}/actions*.ts`
  — currently swallow/translate errors with no reporting.
- **Cron route:** `app/api/cron/notifications/route.ts` (Node runtime).
- **Telegram webhook:** `app/api/telegram/webhook/route.ts` (Node runtime).
- **Notification delivery:** `features/notifications/delivery.ts:142` — the one existing
  `logger.error` site; natural place to also capture send failures.

### B4. Versions → setup approach

- `next 16.2.4`, `react 19.2.4`, `react-dom 19.2.4`.
- Next 16 ⇒ **instrumentation-based** Sentry (`instrumentation.ts` server/edge +
  `instrumentation-client.ts`, `onRequestError`), **not** the legacy
  `sentry.{server,client,edge}.config.ts` files.

---

## Part C — Reconciliation (docs that overstate reality)

| Doc claim                                                                                                                                                | Reality                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `docs/MVP_definition.md:328` "Logs — no personal data (emails, amounts, account numbers not logged)"                                                     | No `redact` configured. Unenforced; `chatId`/`userId` already logged unredacted.                                   |
| `docs/MVP_definition.md:343`, `docs/README.living.md:261` "structured logging — correlation-ID-tagged"                                                   | No log line carries a `correlationId`. The wiring helpers are dead code.                                           |
| `docs/MVP_definition.md:344`, `docs/README.living.md:262` "Correlation ID middleware — propagates through logs and Sentry"                               | ID is generated + forwarded on headers only. Not in logs; no Sentry exists.                                        |
| `docs/MVP_definition.md:345/351`, `docs/UI_ARCHITECTURE.md:299`, `docs/README.living.md:255` "unexpected errors caught by `error.tsx`, logged to Sentry" | `error.tsx` logs nothing and ignores the `error` prop; no Sentry. Errors are caught (UI shown) but never reported. |
| `app/global-error.tsx` UI "We've been notified and are looking into it"                                                                                  | No notification path exists.                                                                                       |
| `README.md:137`, `docs/README.living.md:802` "logger/ — pino setup with correlation IDs"                                                                 | Correlation-ID code exists in `lib/logger/` but is unused; the description implies active tagging.                 |
| `app/(public)/project/_components/stack-section.tsx:23` lists "Sentry" in the live stack                                                                 | Sentry is not integrated.                                                                                          |

Accurately stated (no divergence): `README.md:22/53/100` and `docs/README.living.md:134/458/651`
all correctly call Sentry "planned, not yet integrated / deferred". The inaccurate claims
are the architectural/MVP descriptions that speak in the present tense.
