# Brief for Claude Design — Add Service wizard (light desktop)

> Paste this as the first message in a new chat inside the Claude Design
> project. It asks Claude Design to visualize the Add Service wizard screen.

---

## What this is

A request to visualize the **Add Service wizard** — the screen at
`/properties/[id]/services/new`.

This is the largest, most complex form in the product: in one pass it sets up a
service together with its provider contract, its initial tariff, and optionally
its meter.

**Scope of this brief: light theme, desktop only.** Dark desktop, light mobile,
and dark mobile are separate later briefs and are out of scope here — they will
be derived from this one.

## Project references

This chat is inside the Claude Design project. Use as visual reference:

- `Design System.html` — the authoritative design system .
- Iterations 1–7 — the established screens and patterns of this project.
- Iteration 3 specifically contains the Service **detail** page (the read-only
  "Current contract" and "Meter" blocks). Useful only as visual language — it is
  _not_ a creation form, so do not copy section content from it.

## Format decision (already locked — do not reconsider)

The wizard is a **dedicated full page**, not a modal. The project's general rule
is "entity creation = modal", but the wizard is a deliberate, recorded
exception: the form is too large and multi-section to live in a modal. The route
`/properties/[id]/services/new` stays. Use the standard authenticated app layout
(top bar, `max-w-screen-2xl` content width).

## The wizard — four sections, top to bottom

The wizard is a single scrolling page with four sequential sections, filled top
to bottom. It is **not** a multi-step "next / next / next" flow with separate
screens — all four sections live on one page.

**Section 1 — Service type.** The user picks a service type from the catalog
(electricity, gas, cold water, hot water, heating, building maintenance, garbage
collection, internet, intercom, HOA fees, gas delivery). Presented as a
selectable card grid with service icons. Selecting a type is what makes the rest
of the form adapt — see "Adaptive behavior" below.

**Section 2 — Initial contract.** The agreement with a provider:

- Provider — a select from the user's existing providers. **There is no inline
  "create provider" control here** — this is a locked decision. If the user has
  no suitable provider, the form should gently point them to create one on the
  providers page first, then return to the wizard.
- Contract start date.
- Contract notes (optional).

**Section 3 — Initial tariff.** The pricing. This section is adaptive:

- For a **metered** service type: rate inputs per zone — Rate T1, plus Rate T2 /
  Rate T3 depending on how many zones the user selected in the meter section.
  The fixed-amount field is hidden.
- For a **fixed** service type: a single fixed monthly amount field. The rate
  fields are hidden.
- Tariff start date.
- Tariff notes (optional).

**Section 4 — Meter (optional).** Only meaningful for metered service types. A
clearly optional section — a service can be created with no meter at all. When
engaged, it shows: zone count selector (1 / 2 / 3), serial number (optional,
often unknown in practice), physical installation date (optional), meter start
date, meter notes (optional). For fixed service types this section is not
offered at all.

At the bottom of the page: the primary action that creates everything, and a
cancel / back path.

## Adaptive behavior — the heart of this form

The form reshapes itself based on the **selected service type**, which carries
two relevant properties:

- `measurementType` — `metered` vs `fixed`:
  - `metered` → Section 3 shows rate-per-zone inputs; Section 4 (Meter) is
    offered.
  - `fixed` → Section 3 shows a single fixed-amount input; Section 4 is not
    offered at all.
- `supportsZones` — `true` vs `false`:
  - `false` → zone count is locked to 1, no zone selector is shown.
  - `true` → the user can choose 1 / 2 / 3 zones, and the tariff rate inputs
    (T1 / T2 / T3) follow that choice.

Before a service type is selected, Sections 2–4 should be in a not-yet-active
state — visible enough that the user understands the overall shape of the form,
but clearly waiting on the Section 1 choice.

## States to show in this brief

All of the following are the **same one design** — different conditions of one
wizard, not competing visual variants.

1. **Empty start** — the page just opened, no service type selected yet.
   Sections 2–4 inactive / waiting on the Section 1 choice.
2. **Metered type selected, expanded** — e.g. electricity. Section 3 shows the
   zone rate inputs; Section 4 (Meter) is offered. This is the richest state —
   show it with multiple zones in play.
3. **Fixed type selected, expanded** — e.g. internet. Section 3 shows the single
   fixed-amount field; Section 4 is absent.
4. **Meter section engaged** — within the metered state, the optional Meter
   section filled in, showing the zone count selector and the meter fields.

Field-level validation errors are **not** a separate state to design — their
visual language (inline errors below fields) is already established in the
Design System and is simply reused where relevant. One note for layout only:
the wizard must be able to surface a **form-level error after submit** that is
not tied to any single field (for example, "a service of this type is already
active on this property"). Please leave a sensible place in the layout for such
a form-level message; it does not need its own dedicated state screen.

## Claude Design rules to respect

- **One visual variant only.** The four items above are _states of one design_,
  not alternative designs. Do not produce competing visual variations of the
  wizard.
- **Light theme, desktop only.** No dark theme, no mobile in this brief.
- Follow the Design System tokens exactly — Zinc base, Violet primary accent,
  Inter typography, 0.5rem radius. Standard authenticated app layout.

## Out of scope

- Dark theme and mobile layouts — separate later briefs, derived from this one.
- Dedicated error / validation state screens (the inline-error language already
  exists in the Design System).
- The providers page itself — it already exists.
- Any backend or implementation concern — this is a visualization task only.
