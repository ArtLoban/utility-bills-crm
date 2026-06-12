# 0002 — Study the analogous component; reuse the shared shell, don't hand-roll

**What happened:** With `/payments` as the stated reference for the Bills form, I inlined
`buildDefaultValues` into the hook and hand-rolled a `<form>` + button row instead of first
opening the payments analogue — which wraps the form in the shared `FormContainer`.

**Rule:** When a reference component is named, **read it before writing the analogue** and
reuse the shared shell it composes (`FormContainer` for page forms, `Modal` for modal forms),
not a one-off copy. Never justify structure with "the reference does X" (§1.8 /
[[0001-existing-code-is-not-a-convention]]): take the _structure_, but if the shell has a gap
(e.g. hardcoded English), **extend it** with backward-compatible optional props.

**How to apply:** Identify which shared shell the analogue uses and reuse it. Fill i18n gaps
with optional label props (English defaults, existing consumers untouched). Keep
single-responsibility helpers (`buildDefaultValues`) as their own module, not inlined.
