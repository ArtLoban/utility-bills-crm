# 0002 — Study the analogous component; reuse the shared shell, don't hand-roll

**What happened:** Restructuring the Bills create/update flow with `/payments` as
the stated reference, I (1) inlined `buildDefaultValues` into the hook justifying
it with "payments inlines `makeDefaultValues`", and (2) wrote a one-off `<form>` +
button row in `bill-form-content.tsx` instead of opening
`features/payments/components/payment-form-content/index.tsx` first — which
wraps the form in the shared `FormContainer`. The author corrected both: read the
reference before implementing, and reuse the shared page-form shell.

**Rule:** When a sibling/reference component is named, **open and read it before
writing the analogue.** Reuse the shared shell it composes (`FormContainer` for
page forms, `Modal` for modal forms) instead of reinventing one inside a feature.
A cross-cutting concern (page-form card + back-link + submit + footer; modal
header + footer buttons) lives in one shared component — duplicating it in a slice
is a smell. Never justify a structural choice with "the reference already does X"
(that is §1.8 / lesson [[0001-existing-code-is-not-a-convention]] again): take the
_structure_ from the reference, but if the shared shell has a gap (e.g. hardcoded
English), **extend the shared shell** with backward-compatible optional props
(defaults preserved) rather than copying its legacy or hand-rolling around it.

**How to apply:**

- Before building `X-form-content` / `X-modal`, read the existing
  `payments`/`properties` analogue and identify which shared shell it uses.
- Reuse that shell. If it lacks i18n (`FormContainer` hardcoded "Cancel"/"Saving…"/
  footer; `Modal` hardcoded "Cancel"), add optional label props with English
  defaults so existing consumers are untouched, and pass localized values.
- Keep single-responsibility helpers (`buildDefaultValues`) as their own module at
  the matching level (slice `utils/` when the hook is slice-level), not inlined.
