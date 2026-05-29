# Utility Bills CRM — Claude Code instructions

## 0. Code quality bar

Every piece of code must be production-ready on first delivery.
The bar is: **a senior/architect engineer would not need to refactor this.**

"It works" is not enough. Working drafts are not acceptable.

Think and write code like a senior engineer and architect — not a junior:

- When a question is architectural (naming, structure, decomposition), **discuss first, code second**. Never start writing before the decision is made.
- A working solution with a structural smell is not done. Fix the smell before calling it done.

Before writing any code:

- Actually read the relevant project rules files (not from memory — open and read them).
- Check existing code in the project for established patterns to follow.
- Apply DRY, correct decomposition, and consistent style before outputting anything.

If I realize I'm about to violate a project rule — stop, flag it, fix the approach. Do not silently produce code with a known problem inside.

The backend implementation starts from scratch — there is no legacy to follow and no "we'll fix it later." New code must meet the bar on first delivery. Read the authoritative documents (section 5) before writing anything.

## 1. Core working rules

### 1.1 Plan before any file change

Before creating or modifying any file, describe in plain language what will
change, which files are affected, and why this approach. Wait for approval.

### 1.2 Highlight non-trivial decisions only

After any change, list 1–3 decisions that are non-obvious or have a notable trade-off.
For each: name the pattern (if applicable) and the alternative that was rejected — in one sentence.
Skip everything mechanical, idiomatic, or self-evident from reading the code.
If the entire change was mechanical — say "no notable decisions" and stop.

### 1.3 Small steps

One logical task per response. If a request grows beyond ~3 files or feels
like a large step — stop and propose a split.

### 1.4 No silent framework magic

Call out and explain non-obvious framework behavior: RSC boundaries,
`'use client'` / `'use server'`, caching, streaming, Suspense.

### 1.5 Author owns decisions

When multiple reasonable approaches exist, present them with trade-offs.
Do not silently pick one.

### 1.6 Verify type assertions

Before adding `as SomeType` or `as const`, remove it and run `npx tsc --noEmit`.
If tsc passes without it, don't add it.

### 1.7 Match the declared stack

Do not introduce libraries or patterns that are not already in the project.
If a new dependency seems necessary, propose it with trade-offs first.

### 1.8 Existing code is not a source of truth

The current codebase is in an early implementation state. Most pages and components
are initial drafts that have not been brought up to the standards defined in this document and best practices.
Treat existing code as _what was done_, not _what should be done_.

When you encounter a divergence — in structure, naming, or approach:

- Flag it explicitly before proceeding: _"This follows an existing pattern, but it
  contradicts X because…"_
- Propose a correction.
- Never silently copy a suboptimal pattern. Doing so spreads the problem.

If the fix is out of scope for the current task — note it as tech debt and move on.
But always name it.

The target project topology is vertical feature slices — new domain logic lives in
`features/<domain>/`. The legacy layers `components/feature/`, `lib/actions/`,
and `lib/validation/` have been cleared. If they reappear — flag it.
See `.claude/rules/project-structure.md`.

## 2. DevNote convention

The author marks questions and concerns in generated code with
`// devnote: ...` comments.

- Before completing any task, scan modified files for `// devnote:` comments.
- Resolve each one: answer, fix, or explain why no change is needed.
- Do not commit while any `// devnote:` remains.
- **After every file edit the user accepts (with or without modifications): re-read the file before touching the next one.** If the accepted version introduced new devnotes — stop and resolve them first.

## 3. Session model

One session = one deliverable. Commit = checkpoint of understanding —
never commit code you cannot explain.

## 4. Boundaries (manual by author)

- External credentials, env variable values, OAuth setup
- Vercel / Neon / Sentry account work
- Anything outside the codebase itself

## 5. Authoritative documents

Read the relevant document(s) when working on a related task. Do not preload.

**Project:**

- `README.md` — overview, current status
- `docs/README.living.md` — extended project documentation
- `docs/MVP_definition.md` — product scope

**Database:**

- `db/DATA_MODEL.md` — full schema with rationale
- `db/SCHEMA_REFERENCE.md` — quick lookup

**UI:**

- `docs/UI_ARCHITECTURE.md` — routes, layouts, design system
- `.claude/design/OBSERVATIONS.md` — visual rules. Read before any UI work.

**Code:**

- `.claude/rules/project-structure.md` — project topology, feature slices,
  where new code lives. Read before creating new domain logic or deciding where
  a file belongs.
- `.claude/rules/component-architecture.md` — when to split, folder structure,
  decomposition triggers. Read before creating or refactoring components.
- `.claude/rules/code-style.md` — naming, function form, file organization.
  Read before writing or refactoring code.
- `.claude/rules/ui-patterns.md` — separation of concerns, Tailwind vs inline styles,
  design tokens, constants organization. Read before creating new or refactoring any existing component.
- `.claude/rules/color-system.md` — where colors live, how to add new colors, anti-patterns.
  Read before adding any color or touching color-related code.

## 6. Git

- Do not add `Co-Authored-By: Claude` lines.
- Do not add `🤖 Generated with Claude Code` footers.

## 7. Language

Code, identifiers, technical terms — English.
Explanations — match the user's language.

## 8. Playwright

Chromium is installed (`~/Library/Caches/ms-playwright/`) and persists across sessions.
Do NOT run `playwright install` preemptively — assume the browser is present.
Run `npx playwright install chromium` only if a run fails with "Executable doesn't exist" or "browser not found".
