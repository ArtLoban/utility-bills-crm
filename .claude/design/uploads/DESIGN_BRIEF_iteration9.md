# Design Brief — Iteration 9 (System states + toasts)

The states the app shows when things go wrong, are loading, or need a transient notification. Specified in `UI_ARCHITECTURE.md` → Shared States, never visualized until now. These are the last "invisible until you need them" screens — and the first thing a careless reviewer notices is missing.

## Source of truth

The authoritative visual reference is **`Design System.html`** — refer to it for tokens, components, and styling. Also follow the established **Iteration 1–8** screen templates for layout and patterns.

## Deliverables

Generate one at a time, pausing for feedback between each:

1. 404 / Not found — light
2. 404 / Not found — dark
3. Fatal error — light
4. Fatal error — dark
5. Loading skeleton, Dashboard — light
6. Loading skeleton, Dashboard — dark
7. Loading skeleton, Bills list — light
8. Loading skeleton, Bills list — dark
9. Toast stack — light
10. Toast stack — dark

## Shared context for all screens

- All states render **inside the standard app shell** — the authenticated top bar (nav, language + theme toggles, user avatar) is present and normal. Only the content area changes.
- Copy is real, English.

---

## Screen 1 — 404 / Not found

Centered vertically and horizontally in the content area (top bar still visible above).

- Icon: lucide `Compass`, 64px, `text-muted-foreground`.
- Heading (h2): "Page not found"
- Muted paragraph (one line): "The page you're looking for doesn't exist or may have been moved."
- Single button: `[Go home]` — `variant="default"`.

No card container — this is a bare centered block on the page background, like a full-page empty state.

(Note for the record, not to render: the public/global 404 reuses this exact content with the public header instead of the app top bar — Code handles that swap.)

## Screen 2 — Fatal error

Same centered layout as 404.

- Icon: lucide `TriangleAlert`, 64px, muted with a subtle destructive tint (not full red — the screen should stay calm).
- Heading (h2): "Something went wrong"
- Muted paragraph: "We've been notified and are looking into it. Try again, or head back home."
- Two buttons, side by side, centered:
  - `[Try again]` — `variant="default"` (primary action)
  - `[Go home]` — `variant="outline"`

No stack trace, no raw error text anywhere.

## Screen 3 — Loading skeleton, Dashboard

Skeleton version of the Dashboard, inside the app shell. Sets the skeleton language for grid-type pages.

- Page header: skeleton bar for the "Hi, {name}" greeting (one short wide block).
- Balance summary: one card-height skeleton block (the total-debt summary).
- Charts section: a row of skeleton placeholders matching the real layout — a square/circle block for the pie (~40% width), a wide rectangular block for the stacked bar, and a wide block for the line chart below.
- Skeletons use the shadcn `Skeleton` component: muted rounded blocks with a subtle pulse.

The shapes should clearly echo the real Dashboard composition, so it reads as "Dashboard loading," not generic gray boxes.

## Screen 4 — Loading skeleton, Bills list

Skeleton for a data-table page. Sets the language for all list pages (Bills / Payments / Meters / Admin tables).

- Page header: skeleton for title + count, and a skeleton button block on the right.
- Filter bar: 3–4 short skeleton blocks (the `<Select>` filters) + a small one (Clear).
- Table: a header-row skeleton, then ~8 shimmer rows with cells echoing the real columns (Date / Property / Service / Period / Amount / actions).
- Footer: a skeleton for the total + a pagination skeleton.

## Screen 5 — Toast stack

A reference for the `sonner` toasts. Render them over a faint, slightly muted Dashboard background (top bar + dimmed page content) so the **bottom-right anchored position** is visible.

Show three stacked toasts (top to bottom), each a rounded card with `shadow-md`:

- **Success:** lucide `CheckCircle` icon (subtle green), text "Payment recorded."
- **Error (non-critical):** lucide `XCircle` icon (destructive), text "Couldn't save your changes. Please try again."
- **Session expired:** lucide `Clock` or `LogOut` icon (muted), text "Your session expired. Please sign in again."

Each toast: icon left, message, optional dismiss `×` on the right. 4s-duration is behavioral, no need to depict.

This is a reference so Code can align its existing toasts to the intended look — match shadcn/sonner New-York styling, don't over-design.

---

## Out of scope for this iteration

- Demo-mode banner and intercept modal (Code adds per Design System).
- Invite banner, role-change toast specifics (Code handles).
- Mobile variants (Iteration 11).
- Per-route 404 copy variations (same pattern, different text — Code handles).
- Inline form validation errors (already established, inline below fields).
