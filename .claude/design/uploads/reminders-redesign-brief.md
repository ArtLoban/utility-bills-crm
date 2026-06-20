# Design brief — Reminders section + reminder modal (day picker redesign)

## For: Claude Design

Produce HTML mockups (light + dark) for two surfaces: the **Reminders section**
on the service-detail page, and the **Add/Edit reminder modal**. The driving
problem is the **Day of month** picker — redesign it.

## Background

On production the modal renders **Day of month** as a native `<select>` listing
1–31. That is poor UX: the user must scroll, only a few values are visible at a
time, and there is no visual sense of "which day of the month."

The app already has a better pattern — `MonthPicker`: a trigger styled like an
input that opens a popover with a clickable grid. The day field should follow
that spirit rather than a scrolling dropdown.

Design both surfaces so the picture is coherent, but the **focus is the day
picker**.

## The core UX problem to solve

Replace the 1–31 dropdown with a layout where **all days are visible at once,
no scrolling**, and selecting a day is one click.

- Preferred direction (author's lean): a **calendar-style grid in a popover** —
  a field trigger that opens a 7-column grid of 1–31; one click shows every day.
- You are invited to propose your **own variant** (e.g. an always-visible inline
  grid, or another pattern) — show it alongside the popover version if you have a
  stronger idea.
- **No weekday headers.** A reminder's day-of-month recurs every month and is not
  tied to a weekday, so the grid is just a compact grid of numbers — not a
  calendar with Mon–Sun columns.

## Scope

- **In scope:** the day-of-month picker (the 1–31 control).
- **Out of scope:** the "Before end of month" preset control — it stays a plain
  `<select>` (8 short text options, a dropdown is acceptable there). Do not
  redesign it.

## Surface A — Reminders section (service-detail page card)

A card that lives in the service-detail page layout.

- **Header:** title "Reminders"; subtitle "Reminders repeat every month."; an
  "Add reminder" button on the right.
- **States to show:**
  1. **List** — each row has two lines: line 1 is the human-readable anchor, line
     2 is the reminder text; trailing edit + delete icon buttons.
     Anchor label forms:
     - day-of-month: "On the 5th" (ordinal)
     - last day: "On the last day"
     - days before end: "3 days before month end"
  2. **Empty — Telegram linked:** title "No reminders yet", body "Add a reminder
     to get a monthly Telegram nudge for this service.", plus an "Add reminder"
     button.
  3. **Empty — Telegram not linked:** title "No reminders yet", body "Connect
     Telegram to start getting monthly reminders for this service.", plus a
     "Connect Telegram" button.
  4. **Disconnected banner:** when reminders exist but Telegram is disconnected,
     a warning strip above the list — "Telegram is disconnected — reminders won't
     be delivered until you reconnect." + "Open settings" link.
  5. **Add button when not linked:** disabled, with tooltip "Connect Telegram
     first".

## Surface B — Add / Edit reminder modal (~480px max width)

- **Title:** "Add reminder" (create) / "Edit reminder" (edit).
- **Field 1 — radio group, "When to remind":**
  - "Specific day of month"
  - "Before end of month"
- **Field 2 — depends on the selected mode:**
  - day mode → the **new day picker**, label "Day of month" (1–31). For values
    29/30/31 show the hint: "Months without this day will fire on the last day
    instead."
  - before-end mode → **keep the existing select**, label "When to remind"
    (options "Last day of month", "1 day before end", "2 days before end", …).
    Out of scope — do not restyle.
- **Field 3 — textarea:** label "Reminder text", placeholder "e.g. Submit the
  meter reading and pay the bill", with a `0/280` character counter.
- **Buttons:** "Cancel" + "Add reminder" / "Save changes".
- **Must include a frame with the day picker open** — that is the key shot of
  this task.

## Domain constraints (so the design is accurate)

- Reminders belong to a service, repeat every month, and are delivered to
  Telegram (a daily cron at 07:00 Europe/Kyiv).
- Day of month is 1–31 and is clamped to the month length (31 in February fires
  on 28/29).
- Reminder text is 1–280 characters.

## Design system & references (follow these)

- Tokens / components: `design-system/Design System.html`
- Page reference (section must fit this layout):
  `crm/service-detail-light.html` and `service-detail-dark.html`
- Match the card style, button sizes, and spacing of the neighboring
  service-detail cards.
