# Design Brief — Iteration 10 (Landing visual upgrade)

Elevate the three public pages (`/`, `/about`, `/project`) from a clean-but-flat template into something that demonstrates frontend craft — while staying minimal. This is an **upgrade of the existing pages, not a redesign**: keep the structure, keep all the copy. Raise contrast, color, and rhythm.

## Source of truth

Authoritative visual reference: **`Design System.html`**. Also follow the established **Iteration 1–8** templates. **The current landing pages (`home.html`, `about.html`, `project.html`) are the baseline** — start from them, keep their copy and section structure, elevate the visual treatment.

## The five moves (apply across all pages)

**1. Amplified hero glow.** The current faint violet radial glow from the top-right corner is good — make it richer and more present: a stronger primary glow plus an optional second, deeper violet pool, kept tasteful (no rainbow). Hero stays light.

**2. Dark mockup bands.** Sections that hold product mockups become full-width **dark** bands (replacing the current muted-gray). The white sections and dark mockup bands alternate to create rhythm. Mockups on dark bands render the **app's dark-mode UI**, sit larger and more prominent than now (not tucked into a 90% box), and get a subtle violet glow beneath the browser frame. In the landing's own dark theme, separate the dark bands from the dark page with a subtle border or glow so they don't merge.

**3. Color from the product's own palette.** Introduce the service colors the product already uses — electricity = violet, gas = amber, water = teal, internet = blue — into feature-card icons and the mockup charts. Color with meaning, not decoration. Don't over-saturate; these are accents on an otherwise zinc page.

**4. Bigger type + varied rhythm.** Step hero and section headings up in size. Break the uniform `96px / 1100px` cadence — vary section width and density (some narrow text columns, some full-bleed mockups), so the eye has anchors.

**5. Minimal motion.** Keep only the existing header blur-on-scroll and a gentle card hover-lift. No scroll animations, no parallax. The restraint is intentional.

## Fidelity fixes (do these while upgrading)

The audience is engineers who will open the real app and notice mismatches.

- **`about.html` hero:** remove `fontSize: "4px"` — "Hi, I'm Art." must render at full hero size.
- **Mockup navigation:** the app uses a **top bar**, not a sidebar. Redraw the dashboard/property mockups with top-bar navigation (`Dashboard | Properties | Meters | Bills | Payments | Settings`).
- **Currency:** the app is **UAH (₴)**, not € — change all mockup amounts to ₴.
- **Property mockup tabs:** real tabs are **Overview / Meters / Sharing** — not "Bills / Readings".

## Per-page notes

**Home (`/`)** — the heaviest. Hero with amplified glow + larger heading, product-forward. Dashboard mockup on a dark band. Light feature grid with service-color icons. Property mockup on a second dark band. Light tech section. Footer.

**About (`/about`)** — intentionally minimal (Decision #90, a gateway page). Don't over-build it. Apply the amplified hero glow and the larger greeting type for consistency; keep the sparse three-section structure and LinkedIn-only contact. Fix the 4px bug.

**Project (`/project`)** — technical deep-dive. Stack chips and architecture cards can carry subtle service-color accents. Render the **schema tree on a dark, editor-like panel** — schema/code reads beautifully on dark and adds a contrast moment here too. Keep the `[View on GitHub]` CTA.

## Canvas / output layout

Put **all artboards on one shared canvas**, so every page and theme is visible together in one place. Lay them out as a labeled grid (e.g. each page in a column, light and dark side by side, with a caption per artboard). Build them up **one at a time, pausing for feedback between each** — but keep accumulating onto the same canvas rather than producing separate outputs. The final canvas holds all six artboards.

## Deliverables

Generate **Home first (light, then dark), pause for feedback** — it sets the language. Then the rest, all onto the same canvas:

1. Home — light
2. Home — dark
3. About — light
4. About — dark
5. Project — light
6. Project — dark

## Out of scope

- Copy changes (text is locked from Iteration 6).
- New sections or pages.
- Heavy animation / scroll effects.
- Mobile-specific layouts (Iteration 11 covers mobile).
