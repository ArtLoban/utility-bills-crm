# Design Brief — Providers page

A page that lists the user's utility providers (the companies they pay — electricity, gas, water, internet, and so on). Each provider has a name, optional contact details, optional free-text notes, and an indication of how many of the user's services currently use it. From here the user can add a new provider, edit one, or delete one. **Light, desktop, one artboard.**

## Source of truth

`Design System.html` + the established **Iteration 1–8** templates. Everything below must be expressed in the project's existing visual language.

## Layout — a list of cards

Providers are shown as **full-width cards stacked vertically** (a list of cards, not a tight grid). Each card, left to right:

- **Leading monogram** — the provider's first letter in a neutral, muted rounded square. It anchors the row and fills the empty middle.
- **Main block:**
  - **Name** (primary text).
  - **Contact line** — phone and/or website, each with a small leading icon; the website is a clickable link (accent color). A provider may have one, both, or neither.
  - **Usage indicator** — muted text: "Used by N services" when the provider is in use, or "Not in use" when no service references it.
  - **Notes** (optional) — free-text, shown only when present. **See the note-length requirement below.**
- **Actions (right):** an edit icon button (muted) and a delete icon button. The delete is **muted and disabled, with a tooltip ("In use — can't delete")** when the provider is used by services; it is rendered **destructive (red) only when the provider has no services and can actually be deleted.**

## Note-length requirement (important)

Notes vary a lot in length — from nothing, to one line, to several sentences. The card must handle this gracefully. Two of the mock records below carry long notes (4 and 6 sentences) specifically so you can design how a card accommodates a large block of text without breaking the rhythm of the list. **Decide the presentation** (e.g. full multiline, line-clamp with expand, or another approach that fits the project's style) — that decision is part of this task. Short-note and no-note cards should stay compact.

## Page header

Title "Providers", a muted subtitle count "5 providers · 3 in use", and a primary `[+ Add provider]` button aligned right.

## Mock content — use these 5 records verbatim

**1. Kyivenergo** — phone `+380 44 207-00-00` · in use (2 services) · no notes.

**2. Naftogaz** — website `naftogaz.com` · in use (1 service) · no notes.

**3. YASNO** — phone `+380 44 537-11-22`, website `yasno.com.ua` · in use (1 service) · notes:

> Switched to YASNO for electricity in March 2024 after the previous provider restructured. Their app shows readings and lets you pay with no commission. Support is responsive on weekdays but slow on weekends. Account manager: Olena, ext. 214.

**4. Kyivvodokanal** — phone `+380 44 206-00-00` · not in use · notes:

> Cold water only; hot water is billed separately by the building.

**5. Kyivstar** — website `kyivstar.ua` · not in use · notes:

> Internet and landline bundle, 1 Gbit/s fiber. Contract auto-renews annually unless cancelled 30 days in advance. Price is locked for the first two years, then reverts to the standard rate. There was an outage in January that took four days to resolve — keep ticket number KS-99312 for reference. The router is rented, not owned, so it must be returned if we cancel. Billing date is the 5th of each month.

(3 in use, 2 free — the subtitle count reflects these records.)

## Out of scope

- Dark mode (later pass).
- Mobile layout.
- The Add / Edit provider modal (typical form modal — handled separately).
