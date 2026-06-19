import type { Result } from "@/lib/errors";

// The notifications subsystem's own error channel, deliberately separate from the
// domain `err`/TAppError model in `lib/errors.ts`. External-service (Telegram /
// network) failures carry free-form diagnostic text — e.g. the raw Bot API response
// body — that does not reduce to a domain error `code`. The string is persisted
// verbatim in the delivery ledger's `error` column and surfaced to the admin. These
// are infrastructure failures, not domain errors, so they never cross as a TAppError
// and never reach `toThrowable`/`errorMessage`.
//
// `ok()` from `lib/errors` is reused for the success side (it is generic and carries
// no domain semantics); only the error constructor is local, because the domain `err`
// is constrained to TAppError.
export type TInfraResult = Result<void, string>;

export const infraFail = (error: string): TInfraResult => ({ ok: false, error });
