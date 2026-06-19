# 0019 — Define domain color tokens from palette primitives, not raw hex

**What happened:** Adding meter/tariff zone accent tokens to `app/tokens.css` I wrote raw hex
(`--zone-t2: #6366f1; --zone-t3: #7c3aed; --rate-fixed: #10b981;`). The author rewrote them to
reference the existing primitive scale (`var(--blue-500)`, `var(--violet-500)`, `var(--teal-500)`).

**Rule:** A new domain/semantic color token in `tokens.css` must reference an existing palette
primitive (`var(--<hue>-<step>)`), never a hardcoded hex. The primitives are the single source
of truth for the actual values (and carry light/dark calibration); a raw hex forks that and drifts.

**How to apply:** Before adding a `--token: <value>`, find the nearest primitive in `tokens.css`
(`--amber-500`, `--blue-500`, `--violet-500`, …) and alias it: `--token: var(--primitive)`. If no
primitive matches the needed hue, add the primitive first, then alias — do not inline a hex on the
semantic token. Existing `--service-*` tokens are the pattern to mirror.
