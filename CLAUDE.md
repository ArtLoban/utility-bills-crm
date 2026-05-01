# Utility Bills CRM — Claude Code instructions

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

## 2. DevNote convention

The author marks questions and concerns in generated code with
`// devnote: ...` comments.

- Before completing any task, scan modified files for `// devnote:` comments.
- Resolve each one: answer, fix, or explain why no change is needed.
- Do not commit while any `// devnote:` remains.

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

- `.claude/rules/component-architecture.md` — when to split, folder structure,
  decomposition triggers. Read before creating or refactoring components.
- `.claude/rules/code-style.md` — naming, function form, file organization.
  Read before writing or refactoring code.

## 6. Git

- Do not add `Co-Authored-By: Claude` lines.
- Do not add `🤖 Generated with Claude Code` footers.

## 7. Language

Code, identifiers, technical terms — English.
Explanations — match the user's language.
