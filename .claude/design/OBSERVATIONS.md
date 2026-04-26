# Design Package — Observations

> Source: `Utility Bills CRM-handoff.zip` extracted from `.claude/`
> Bundle size: ~318 KB — lightweight reference files only. Decision: **commit to repo** (no `.gitignore` entry needed).
> Covers iterations 1–5. Not yet visualized: Add Bill modal full state, Meter detail, Payments list, Settings, Admin screens, Landing pages.

---

## 1. Visual patterns

### Spacing rhythm

- **Page-level sections:** `gap-8` / `space-y-8` (32px) between major blocks.
- **Card internal padding:** `p-6` (24px) standard; card headers use `px-[20-24px] py-4` (16px vertical).
- **Form field groups:** `gap-4` (16px) between field blocks within a form.
- **Inline metadata / KV grids:** `gap: 14px 32px` (14px row, 32px column).
- **Button groups (adjacent):** `gap-6` (6–8px) between sibling buttons.
- **Vertical rhythm within cards:** content sections separated by `border-b` dividers, not margin gaps.

### Card elevation

**Light mode:**

- Default card: `shadow: 0 1px 2px rgba(24,24,27,0.05)` — barely visible, just lifts off the page.
- Hover on interactive cards: `shadow: 0 4px 8px -2px rgba(24,24,27,0.08), 0 2px 4px -2px rgba(24,24,27,0.05)` — noticeably more depth.
- Transition: `box-shadow 150ms ease`.
- Modals: `0 20px 60px rgba(9,9,11,0.18), 0 4px 16px rgba(9,9,11,0.10)` — strong elevation.
- Auth card: `0 1px 3px rgba(24,24,27,0.07), 0 1px 2px rgba(24,24,27,0.05)`.

**Dark mode:**

- Cards: `border: 1px solid #27272a` (zinc-800) — border replaces shadow entirely. No `shadow-*`.
- Hover: `border-color: primary/30` tint.
- Transition: `transition-colors 150ms ease` (not `transition-shadow`).

**Border radius:** consistently `borderRadius: 8` on cards/sections, `borderRadius: 6` on buttons/inputs/badges, `borderRadius: 10` on modals and auth card.

### Color usage

**Light mode design tokens (from `dashboard.jsx`):**

```
background: #ffffff
foreground: #09090b  (zinc-950)
card:        #ffffff
muted:       #f4f4f5  (zinc-100)
mutedFg:     #71717a  (zinc-500)
border:      #e4e4e7  (zinc-200)
subtle:      #fafafa  (zinc-50)  — used for modal footer background
destructive: #dc2626
success:     #16a34a
warning:     #f59e0b
```

**Dark mode design tokens (from `auth.jsx`):**

```
pageBg:     #09090b
cardBg:     #18181b  (zinc-900)
cardBorder: #27272a  (zinc-800)
fg:         #fafafa
mutedFg:    #71717a
border:     #27272a
muted:      #27272a
inputBg:    #09090b
```

**Accent (Violet — locked after iteration 1):**

```
solid:      #7c3aed
solidHover: #6d28d9
ring:       rgba(124, 58, 237, 0.35)
tintBg:     #f5f3ff
tintBorder: #ede9fe
```

**Service color mapping (consistent across all charts):**

```
electricity: #f59e0b  (amber)
gas:         #ef4444  (red)
coldWater:   #3b82f6  (blue)
hotWater:    #ec4899  (pink)
heating:     #8b5cf6  (violet/purple)
internet:    #14b8a6  (teal)
```

These are dataviz colors — deliberately muted and color-blind distinguishable. Do not use them as UI accent colors elsewhere.

Service-tinted backgrounds within cards use `color + '0F'` (6% opacity) fill and `color + '25'` (15% opacity) border — very subtle tint to associate the block with the service.

**Money color coding:**

- Debt / bills / negative: `#dc2626` (destructive red)
- Payments / overpayment / positive: `#16a34a` (success green)
- Zero: neutral foreground

**Warning state (non-blocking):** `#d97706` text, `#fffbeb` background, amber-tinted border `#d97706`.

**Admin accent: Amber** — reserved exclusively for the `/art-admin` section. Never appears in app or public surfaces.

### Typography

- **Font:** Inter, system-ui fallback.
- `-webkit-font-smoothing: antialiased` on all root containers.
- **Letter spacing:** negative on headings (`-0.5` for h1 24px, `-0.4` for h1 22px, `-0.2` for modal titles 15px, `-0.1` for card section titles).
- **Tabular nums:** `fontFeatureSettings: '"tnum" 1'` on all monetary values, meter readings, any number that should align vertically.
- **Monospace font for payment details / IBANs:** `ui-monospace, "Cascadia Code", "Fira Code", monospace`.
- **KV labels** (metadata keys): `font-size: 11.5px, font-weight: 500, text-transform: uppercase, letter-spacing: 0.3px, color: mutedFg`.

---

## 2. Conventions to preserve in implementation code

### Modals

- **Width:** `max-w-[480px]` (reading/bill/invite: 460–480px), `max-w-[520px]` (contract update — wider due to multi-column form).
- **Structure is always:** header (title + close X) → body → footer. Three layers, never skip one.
- **Header:** `padding: 16px 24px`, `border-bottom: 1px solid border`. Title `font-size: 15px, font-weight: 600`. Close button `28×28px, borderRadius: 6`.
- **Body:** `padding: 20px 24px`.
- **Footer:** `padding: 14px 24px`, `border-top: 1px solid border`, `background: subtle (#fafafa)`. Cancel left, primary action right (`justify-content: space-between`). No centering.
- **Backdrop overlay:** `background: rgba(9,9,11,0.4), backdrop-filter: blur(2px)`.
- **Cancel button:** `variant="outline"` — border + bg:background.
- **Destructive confirm button:** `background: #dc2626, color: white` — not `variant="destructive"` worded differently, it's a standalone styled red button.

### Buttons

Three variants used in the design:

- **Primary:** filled violet, white text, no border.
- **Outline:** border + background:white, foreground text.
- **Ghost:** transparent, mutedFg text, no border — used for secondary actions like "View history".
- **Icon button:** `30×30px, borderRadius: 6, border: 1px solid border` — for `⋮` menus and close X-adjacent actions.
- **Button heights:** `h-32px` (sm, within cards/tables), `h-34px` (modal footer), `h-36px` (page-level actions), `h-38–40px` (auth page CTAs).

### Forms (modals)

- Label above input, `font-size: 13.5px, font-weight: 500`.
- Input height: `36px`, `padding: 0 12px`, `font-size: 14px`, `borderRadius: 6`.
- Hint text below field: `font-size: 12.5px, color: mutedFg, marginTop: 6px`.
- Warning hint: amber text with `AlertTriangle` icon prepended at 13px, displayed inline.
- Valid value filled state: input gets `border: 1px solid tintBorder (ede9fe), background: tintBg (f5f3ff)` — subtle violet tint signals accepted input.
- Context block (meter info at top of reading modal): `background: muted (#f4f4f5), borderRadius: 8, padding: 12px 14px, marginBottom: 20px`. Service icon in a 36×36px square with `color + '1A'` background.

### Radio options (contract update, invite modal)

- Clickable card-style radio: `padding: 12px 14px, borderRadius: 8`.
- Inactive: `border: 1.5px solid Z.border, background: Z.background`.
- Active: `border: 1.5px solid AV.solid, background: AV.tintBg`.
- Custom radio dot: 16×16px circle with violet fill when selected.

### Tables (bills list pattern)

- Amount column: right-aligned, `font-feature-settings: "tnum"`.
- Sortable header: shows `ArrowUpDown` icon by default, `ArrowUp`/`ArrowDown` when active.
- Row hover: `background: Z.subtle (#fafafa)`, transition 120ms.
- Actions column: `⋮` icon button that opens a dropdown menu.
- Filter bar: inline horizontal row of `<Select>` dropdowns + "Clear filters" as `text-muted-foreground underline` link (visible only when filters are active).
- Footer: "Total (filtered)" left-aligned, emphasized; pagination + per-page selector right-aligned.

### Sharing tab role system

- Role badges are pill-shaped (`borderRadius: 999`):
  - Owner: violet tint bg/border, violet text.
  - Editor: blue tint (`#eff6ff` bg, `#bfdbfe` border, `#1d4ed8` text).
  - Viewer: muted bg/border, mutedFg text.
- Role dropdown (owner editing others' roles): same violet tint as Owner badge, with custom chevron.
- Action visibility (not disabled state): editors and viewers literally don't see management buttons. The kebab menu items vary by role.
- "You" indicator: `padding: 1px 6px, background: muted, borderRadius: 4, border: 1px solid border` — subtle inline chip, not a badge.

### Breadcrumbs

- `font-size: 13px, color: mutedFg`.
- Separator: custom `ChevSlash` icon in `color: Z.border` (lighter than mutedFg).
- Current page item: `color: foreground` (not muted).
- Links: `color: mutedFg, text-decoration: none` (no underline by default).

### KV metadata grid

- 2-column grid, `gap: 14px 32px`.
- Key: `font-size: 11.5px, font-weight: 500, text-transform: uppercase, letter-spacing: 0.3px, color: mutedFg, marginBottom: 4px`.
- Value: `font-size: 13.5px, color: foreground, line-height: 1.4`.

### Balance display on service detail

- Large debt number: `font-size: 42px, font-weight: 700, letter-spacing: -1.2px, font-feature-settings: "tnum"`.
- Currency symbol `₴` at `font-size: 22px, font-weight: 500` — smaller than the amount digit.

### Auth card

- Max-width: `400px` (narrower than modals).
- Card padding: `32px 28px` (generous vertical).
- Legal note sits **outside** the card, below it: `font-size: 11.5px, color: mutedFg, text-align: center, margin-top: 20px`.
- Google button in **dark mode**: white background, dark text, light border — brand requirement, never inverts.
- Google button in **light mode**: violet background, white text (the Google `G` SVG is always the brand-colored version, never white-on-violet).
- "Try demo" button: outline style (border + transparent bg), not ghost, not primary.
- "Back to home" link: flex row with `ArrowLeft` icon, `font-size: 13px, color: mutedFg`.

### Logos / brand marks

- Logo: 28×28px square, `borderRadius: 7`, violet background, white `Zap` icon at 15px.
- App name: `font-size: 15px, font-weight: 700, letter-spacing: -0.2px`.

---

## 3. Surprising observations / things that raised questions

1. **Google button is violet on light mode, white on dark mode.** The design inverts the button variant between themes rather than keeping a consistent style. The `G` SVG uses Google brand colors regardless of theme. This is intentional (brand requirement) and is called out in `UI_ARCHITECTURE.md`. Remember: do not invert the `G` icon in dark mode.

2. **Modal footer background uses `subtle` (#fafafa), not `background` (#fff).** This creates a barely visible step between body and footer, giving the footer a slightly different feel. Easy to miss — make sure the footer `div` always has `background: subtle`.

3. **Filled input gets violet tint, not green.** When a valid value is entered in a modal input (e.g., reading value), the input field gets `border: tintBorder, background: tintBg` (violet tint) — not a success green. Green only appears in the hint text delta (`Δ +728 kWh` in success color). Do not use green for input state.

4. **Card border radius is 8, not 6.** Cards use `borderRadius: 8`. Buttons, inputs, badges use `borderRadius: 6`. Modals use `borderRadius: 10`. Auth card: `borderRadius: 10`. Do not uniformly apply `rounded-md` (6px) everywhere.

5. **Service tint in tariff rate cards uses `color + '0F'` (6% alpha).** This is extremely subtle — essentially invisible at a glance. The intent is a barely-there color association, not a strong tint. Avoid using higher opacity.

6. **The `Δ delta` label in the reading hint.** After entering a reading value, the hint shows "Last reading was X · Δ +728 kWh" with the delta in success green. This pattern isn't in `UI_ARCHITECTURE.md` explicitly but is present in the design. Consider it locked.

7. **Payment details block uses monospace font.** IBAN/bank data in the contract card uses `ui-monospace` font family — not `font-mono` class shorthand. The distinction matters for correct font stack fallback order.

8. **Kebab menu dropdown width is fixed at 160px.** Hardcoded, not min-content. Keep this consistent in shadcn `<DropdownMenuContent>` with `w-40` (160px).

9. **Avatar palette uses 4 specific colors in a cycle**, not random. The colors are: violet, blue, green, amber. Index is determined by user position in list, so the same user always gets the same avatar color. Implementation should derive avatar color from a stable hash or index, not random generation.

10. **No visualized designs for:** Add Bill modal full interaction, Meter detail page, Payments list, Settings, Admin screens (amber accent application), Landing pages (Variant B). These need to be inferred from `UI_ARCHITECTURE.md` and existing patterns. The design is complete for auth, dashboard, properties, bills list, service detail, sharing tab, and all their modals.

---

## 4. Conflicts with UI_ARCHITECTURE.md

### No hard conflicts found. Minor gaps and clarifications:

1. **`UI_ARCHITECTURE.md` says `shadow-sm` on cards, `shadow-md` on hover.** The actual design files use custom pixel-value shadows (not Tailwind presets): `0 1px 2px rgba(...)` for default and `0 4px 8px -2px rgba(...)` for hover. The visual result is slightly subtler than standard `shadow-sm`. When implementing, use the custom shadow values or Tailwind's `shadow-sm` and verify visually — the intent is the same.

2. **`UI_ARCHITECTURE.md` mentions `border-primary/30` for dark mode card hover.** The design files don't demonstrate a dark mode hover state with this exact class (dark screens shown are static). `border-primary/30` from the architecture doc is trustworthy — it was established in the iteration 1.1 revision brief.

3. **`UI_ARCHITECTURE.md` says modal Cancel uses `variant="outline"`.** The design uses a button styled as outline (border + white bg + foreground text). No conflict — this is the same thing. Just use shadcn's `variant="outline"`.

4. **`UI_ARCHITECTURE.md` says `max-w-md` to `max-w-lg` for modals.** Design files use fixed pixel widths: 460–480px for standard modals, 520px for the contract modal. `max-w-md` is 448px, `max-w-lg` is 512px. The design is slightly wider than `max-w-md` but narrower than `max-w-lg`. In practice: use `max-w-[480px]` for standard modals and `max-w-[520px]` for the contract modal. Do not use `max-w-md` literally.

5. **`UI_ARCHITECTURE.md` says breadcrumbs only on "deep pages (level 2+)".** The design shows breadcrumbs on Property detail (`/properties/[id]`) which is level 2. Service detail (`/properties/[id]/services/[sid]`) is level 3 — also has breadcrumbs. Consistent with the doc.

6. **Contract history drawer** (mentioned in `UI_ARCHITECTURE.md` as `<Sheet>`) is visualized in `modal-contract.jsx` but listed as a sidebar drawer. The design file renders it as a side panel with visual nesting (indented tariff periods inside provider eras). This visual nesting pattern is locked per the iteration 3 decisions in `UI_ARCHITECTURE.md`.
