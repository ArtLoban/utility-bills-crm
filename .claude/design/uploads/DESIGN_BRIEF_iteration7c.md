# Design Brief — Iteration 7c (Settings)

Closes the App gaps iteration. One screen, three sections, per-section save.

**Continuation of Iterations 1–7b.** Visual language is locked: shadcn New York, Zinc base, Violet primary accent, Inter typography, 0.5rem radius, light + dark modes, 200ms loading delay pattern.

---

## Deliverables expected from this iteration

Please generate these one at a time, pausing between each for feedback:

1. Settings page — full state (light mode)
2. Settings page — full state (dark mode)

Mobile variant — required (sections stack predictably, but the per-section save buttons need to fit gracefully on narrow screens).

**Single-variant rule:** generate one version of each screen. No side-by-side comparisons.

---

## Page structure

URL: `/settings`. Reached from the user avatar dropdown in the app header.

**Page header:**

- Title (h1): **Settings**
- No subtitle, no actions — the actions live inside each section.

**Body:** three stacked sections, each as a `<Card>`. Generous vertical spacing between cards (`gap-6` or `gap-8`). Each card is independent — its own form, its own save button.

Page uses standard `(app)` content width — `max-w-screen-2xl` outer, but the cards themselves should be constrained to roughly `max-w-2xl` so forms don't stretch awkwardly on wide screens.

---

## Section 1 — Profile

**Card header:**

- Title: **Profile**
- Description (muted, smaller): `Your basic information.`

**Card body:** form fields, top to bottom.

1. **Avatar** — circular avatar, 64×64, on the left. To its right, muted text: `Your avatar comes from Google. Sign in with a different Google account to change it.`

   Render with a real-looking avatar (initial letter "A" on a colored background, or a generic person silhouette). The avatar field is **not editable** in MVP — this is the visible signal that it's tied to the OAuth identity.

2. **Name** — text input. Editable. Pre-filled with `Art Loban`.

3. **Email** — text input. **Disabled / read-only.** Pre-filled with `art.loban@example.com`. Below the field, muted small text: `Managed by Google. Sign in with a different account to change.`

   Visually disabled state: `bg-muted` background, slightly muted text color, no focus ring.

**Card footer:** right-aligned `[ Save changes ]` button (`variant="default"`). Disabled when no changes are pending.

---

## Section 2 — Preferences

**Card header:**

- Title: **Preferences**
- Description: `How the app looks and behaves for you.`

**Card body:** three settings.

1. **Language** — `<Select>`. Pre-selected: `English`. Options: `English`, `Українська`, `Русский`. Below the field, muted small text: `The language of the app interface.`

2. **Theme** — radio group, three buttons in a horizontal row (use shadcn's `<RadioGroup>` styled as buttons, or three `<ToggleGroup>` items — pick whichever reads cleaner in shadcn New York). Options: `Light`, `Dark`, `System`. Pre-selected: `System`. Each option has a small icon: `Sun` / `Moon` / `Monitor`.

   On mobile, the radio buttons can stack vertically if width is tight, but should stay horizontal whenever they fit.

3. **Timezone** — `<Select>`. **Disabled in MVP.** Pre-filled with `Europe/Kyiv (UTC+2)`. Below the field, muted small text: `Timezone selection comes in a future release. Times are shown in Europe/Kyiv for now.`

   Visually disabled like the Email field — `bg-muted`, no focus ring.

**Card footer:** right-aligned `[ Save changes ]` button. Same behavior as Profile section.

---

## Section 3 — Account

**Card header:**

- Title: **Account**
- Description: `Sign-in and session management.`

**Card body:** two informational rows + one action.

1. **Signed in with Google** — render as a compact info block, left side has a small Google `G` icon (the brand-colored one, does NOT invert in dark mode — same rule as the Login screen), right side text: `art.loban@example.com`.

   This is read-only, no actions on the row itself.

2. **Active sessions** — text only, muted: `Per-device session management is coming in a future release.`

3. **Sign out of all devices** — destructive action. Render as a separate sub-section with a small visual divider (`<Separator />`) above. Heading: **Sign out everywhere**. Body: `This signs you out on all browsers and devices, including this one. You'll need to sign in again.`

   Below the body: `[ Sign out of all devices ]` button, `variant="destructive"`, left-aligned (NOT right — this is not a "save" action; left-alignment signals it's a discrete destructive choice, not a form submission).

**No card footer / Save button for this section** — there's nothing to save here. The only action is the destructive button itself.

---

## Cross-section behavior notes (for context, not visual)

- Per-section Save: each card's form is independent. Saving Profile doesn't touch Preferences.
- Unsaved-changes protection: if the user navigates away or switches sections with pending changes, a confirm dialog appears. Mockup doesn't need to show it.
- The "Sign out of all devices" confirmation modal is reused from existing destructive-action patterns. Not rendered in this brief.

---

## Out of scope for this iteration

- Sign out confirmation modal (standard pattern, already established)
- Account deletion (post-MVP)
- Notification preferences (post-MVP — Telegram and email notifications are v2+)
- Connected services / integrations (post-MVP)
- Per-device session list (post-MVP)
- Profile picture upload (locked to Google avatar in MVP)
- Email change flow (managed by Google, not by us)

---

## Final note

This screen closes the app surface for design. After 7c, all that's left in Claude Design is the Admin section (Iteration 8) with the amber accent treatment.

Settings is structurally the simplest screen we've designed, but the visible decisions — disabled email, disabled timezone, locked-to-Google avatar — are all signals that the system **does the right thing**: it doesn't fake control over data it doesn't own. The mockup should make these visible as deliberate, not accidental.
