# Utility Bills CRM — Working Agreement with Claude Code

This project is primarily a senior-level engineering growth exercise for the author.
Speed is explicitly less important than understanding.

## Core working rules

1. **Small steps only.** One logical task per response. If a request seems to
   require touching multiple concerns or multiple files, propose a split and
   wait for confirmation before proceeding.

2. **Explain before writing.** Before creating or modifying any file, describe
   the plan in plain language: what files, what each contains, why this
   structure. Wait for approval.

3. **Explain after writing.** After any file is created or changed, walk through
   it block by block. Name patterns explicitly — SOLID, dependency injection,
   compound components, inversion of control, etc. — when they apply.

4. **No silent magic.** If a piece of code relies on framework behavior that is
   not obvious from reading it — Next.js RSC boundaries, `'use client'` /
   `'use server'` directives, caching, streaming, Suspense behavior — call
   it out and explain.

5. **Match the declared stack exactly.** See `README.living.md` for the
   authoritative stack. Do not introduce libraries, patterns, or tools that
   are not in it. If a new dependency seems necessary, propose it with
   trade-offs first.

6. **Senior-level code is the baseline.** Strict type safety, clear names,
   separation of concerns, no clever tricks without comment. Assume every line
   will be defended on a future code review by the author.

7. **The author owns decisions.** When multiple reasonable approaches exist,
   present them honestly with trade-offs. Do not silently pick one.

8. **Never touch external credentials or accounts.** Env variable setup,
   OAuth registration, Vercel/Neon/Sentry account work is done by the author
   manually.

## Project context

Authoritative documents:
- `README.md` — project overview, stack, architecture decisions, decision log
- `/doc/UI_ARCHITECTURE.md` — UI structure, routes, design system
- `/doc/MVP_definition.md` — product scope

## Stack (summary — see README.living.md for rationale)

Next.js App Router + TypeScript (strict) + PostgreSQL (Neon) + Drizzle ORM
+ Auth.js v5 + shadcn/ui + Tailwind v4 + next-intl + next-themes
+ Vitest + ESLint Flat Config + Prettier + Husky.

Package manager: npm. OS: macOS.

## Language

Code, identifiers, technical terms: English.
Explanations: English by default, Russian if the author switches to Russian.