# Revisions — Add Service wizard → Variant 2

> Paste this into the existing Claude Design chat (or a new one in the same
> project) that produced the Add Service wizard. It asks for a corrected variant.

---

## How to apply these revisions

- Work on the **same canvas**, **light desktop only**.
- Produce a **new variant labeled "Variant 2"** alongside the existing one.
- **Do not touch the previous variant** — the existing light-desktop, dark, and
  mobile boards stay exactly as they are. Variant 2 is an additional set of the
  four light-desktop states with the changes below applied.
- All four states carry over: Empty start / Metered selected (with post-submit
  error) / Fixed selected / Meter engaged.

## Guiding principle behind these changes

The wizard should collect **only what is mandatory to create the entities**.
Anything that can be filled in later, from the relevant detail page, does not
belong in this form — it is already large (four sections, four entities). Apply
this lens throughout.

## Revision 1 — Remove "Account number" from Section 2 (Contract) — required

- Remove the Account number field from the contract section entirely.
- Reason: the account number is a temporal attribute of the contract (it has its
  own validity history) and is **not** part of what this form submits. It is
  entered later from the Service detail page, through the contract's update
  flow. It is also optional, not mandatory at creation.
- After removal, Section 2 (Contract) contains: Provider (select), Contract
  start date, Contract notes (optional). The Contract start date can move to
  full width or sit beside another field — designer's choice for balance.
- Apply this in every state where the contract section is filled (metered,
  fixed, meter-engaged) — remove the sample account values too (`123456789`,
  `KS-44128-A`).

## Revision 2 — Update the top navigation — required

- Current nav reads: Dashboard / Properties / Bills / Payments / Settings.
- It must read: **Dashboard / Properties / Meters / Bills / Payments /
  Settings**, and include **Providers**.
- Two navigation items were added to the product after the earlier design
  iterations: a global Meters list and a global Providers catalog. The wizard's
  "no inline provider creation — go to the Providers page" guidance points at
  that Providers page, so the nav should reflect it.
- Exact placement/ordering of "Providers" is the designer's call (main nav row
  or user-area — whichever reads cleanly). Meters sits between Properties and
  Bills.

## Revision 3 — Clarify the zone ↔ tariff relationship wording — minor

- In the metered tariff section, the current hint says zone count "comes from
  the meter section below," and the single-zone state still references day/night
  zone language. This is slightly confusing.
- Intended model: **zones are a property of the meter.** If no meter is added,
  the service is billed at a single rate (one zone). The number of zones is
  chosen in the Meter section; the tariff rate inputs follow that choice.
- Please make the wording consistent: in the single-rate (no-meter) state, the
  tariff hint should not imply zones already exist — it should read along the
  lines of "billed at a single rate; add a meter below to bill by day/night or
  three zones." In the multi-zone state, the existing "rates apply per zone,
  zone count comes from the meter section" wording is correct.

## What intentionally stays (do not change)

- **Meter "Installation date" stays.** It is optional and informational, like
  the account number was — but unlike the account number, it physically belongs
  to the meter, which has no separate detail-page form to collect it later, and
  it is naturally known when the meter is being set up. Keep it.
- **Sample data** (providers, rates, dates) is good — carry it over unchanged,
  minus the removed account values. The Ukrainian providers (ДТЕК, Нафтогаз,
  Київводоканал, Київтеплоенерго, Київстар) and rates (4.32 ₴/kWh single, 4.32 /
  2.16 two-zone, 480 UAH fixed) all stay.

## Out of scope for Variant 2

- Dark theme and mobile — not part of this revision pass. Light desktop only.
- Any structural redesign — these are targeted corrections to an approved
  design, not a rework. Keep the overall layout, section structure, and visual
  language intact.
