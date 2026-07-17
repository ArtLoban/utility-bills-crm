# Utility Bills CRM

A personal multi-tenant application for tracking utility bills across multiple properties.

Built primarily as a senior/architect-level growth playground in frontend engineering, with a real product target: my wife, who currently tracks two apartments on paper.

**Live:** [utility-bills-crm.vercel.app](https://utility-bills-crm.vercel.app) — includes a built-in demo that requires no signup.

## Project Goals (in priority order)

1. **Grow as a frontend/architect-level engineer.** Every decision is made with senior-level rigor. The stack and architecture reflect practices to internalize, not the fastest path to features.
2. **Serve as a portfolio piece.** The project should look and work like a serious, shippable product — useful for demonstrating skill breadth to potential employers.
3. **Deliver a useful product.** First user is my wife, then family members. Real users keep scope honest.

## Status

**MVP complete and deployed to production.** The full v1 scope is built and live: public landing pages (`/`, `/about`, `/project`), the authenticated CRM across all screens (dashboard with charts, properties, meters, services, bills, payments, sharing, settings) with Server Actions and business logic, the admin section (dashboard, properties oversight, users, landing CMS), demo mode, and strategic tests for ledger, temporal lookups, aggregations, and critical actions.

- Phases 4–6 complete — architecture, data model, and UI design. See `db/DATA_MODEL.md`, `db/SCHEMA_REFERENCE.md`, `docs/UI_ARCHITECTURE.md`.
- Phase 7 (build MVP) complete — deployed and live.
- Beyond the MVP, **Telegram notifications** are shipped and live — user-authored monthly self-reminders delivered as a single daily digest.
- The only remaining MVP criterion is **real users in active use** — onboarding the first real user (my wife, replacing the paper notebook).
- Sentry error tracking is integrated (instrumentation-based, PII-scrubbed) — see Tech Stack below.

## MVP Scope

MVP is defined as a **minimum viable portfolio piece** — a project that demonstrates senior-level frontend skills and is fully functional end-to-end.

**In scope for v1 (MVP):**

- Public landing page (SEO-friendly, doubles as portfolio)
- Authenticated CRM: properties, services, meter readings, bills, payments, ledger balance, dashboard with charts
- Multi-user sharing with roles (owner / editor / viewer)
- Admin section (property management, user oversight, landing content CMS)
- Multi-language (en/uk/ru), light/dark theme

**Out of scope for MVP — see Roadmap.**

## Tech Stack

- **Framework:** Next.js (App Router, full-stack with RSC) + TypeScript (strict)
- **Database:** PostgreSQL (Neon) + Drizzle ORM + Zod / drizzle-zod
- **Auth:** Auth.js v5 with Google OAuth (database sessions)
- **UI:** shadcn/ui + Radix + Tailwind v4
- **Forms:** React Hook Form
- **Tables:** TanStack Table
- **Charts:** Recharts (via shadcn/ui Charts)
- **In-app toasts:** sonner
- **Notifications delivery:** Telegram Bot API (daily digest via Vercel Cron)
- **URL state:** nuqs
- **Date utilities:** date-fns
- **i18n:** next-intl (en/uk/ru)
- **Theming:** next-themes (light/dark)
- **Logging:** pino
- **Error tracking:** Sentry (integrated, instrumentation-based)
- **Testing:** Vitest + @testing-library/react
- **Tooling:** ESLint (Flat Config), Prettier, Husky + lint-staged
- **CI/CD:** Vercel auto-deploy from GitHub (Actions-based checks planned, not set up)
- **Hosting:** Vercel + Neon (both free tier)
- **Package manager:** npm

## Getting Started

```bash
# Install dependencies
npm install

# Start local PostgreSQL (Docker)
npm run db:up

# Apply migrations
npm run db:migrate

# Run the development server
npm run dev
```

### Database scripts

| Command               | Description                                         |
| --------------------- | --------------------------------------------------- |
| `npm run db:up`       | Start local PostgreSQL via Docker Compose           |
| `npm run db:down`     | Stop PostgreSQL container                           |
| `npm run db:reset`    | Wipe and restart the database                       |
| `npm run db:generate` | Generate a migration from schema changes            |
| `npm run db:migrate`  | Apply pending migrations                            |
| `npm run db:studio`   | Open Drizzle Studio at https://local.drizzle.studio |
| `npm run seed:demo`   | Seed (or re-seed) the demo dataset — idempotent     |

> In production, pending migrations are **applied automatically on deploy** (Vercel `buildCommand`
> runs `db:migrate:deploy` before `next build`); `db:migrate` above is the local/manual command.
> Migrations must be **additive** — destructive changes use expand/contract. See `docs/README.living.md`
> → "Schema and data in production" and Decision #153.

Required environment variables:

- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — Auth.js secret (`openssl rand -base64 32`)
- `AUTH_GOOGLE_ID` — Google OAuth client ID
- `AUTH_GOOGLE_SECRET` — Google OAuth client secret
- `ADMIN_EMAILS` — comma-separated list of emails that receive `systemRole = 'admin'` on first sign-in
- `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` — Sentry error-tracking DSN (server + browser); optional locally, the SDK no-ops without it

## Project Structure

> Domain logic lives in `features/<domain>/` — vertical slices that own their components, hooks,
> actions, schemas and types. Legacy horizontal layers (`components/feature/`, `lib/actions/`,
> `lib/validation/`) have been cleared.

```
app/
  (public)/             public landing pages (/, /about, /project)
  (auth)/               login, error
  (app)/                authenticated CRM — dashboard, properties, services,
                        meters, bills, payments, sharing, settings
  (admin)/              admin-only section at /art-admin
  api/                  route handlers (auth)
components/
  ui/                   shadcn/ui components (Radix-based, locally owned)
  data-table/           TanStack Table system with URL-synced filters
  app-nav/              authenticated app navigation
  admin-nav/            admin section navigation
  ...                   other shared domain-agnostic UI primitives
features/
  <domain>/             one slice per business domain, e.g.:
    components/         domain components
    hooks/              domain hooks
    actions.ts          server actions ('use server')
    schema.ts           Zod validation schemas
    types.ts            domain types
    index.ts            public API of the slice
lib/
  auth/                 Auth.js config and helpers
  constants/            shared constants (service colors, icons)
  db/                   Drizzle schema, client, migrations, access queries
  format/               currency and date formatters
  hooks/                shared hooks
  locale/               next-intl helpers
  logger/               pino setup: redaction + correlation-id context (ALS)
  types/                shared TypeScript types
  utils/                shared utilities
  routes.ts             centralized route configuration
i18n/                   next-intl runtime config
messages/               i18n translation files (en, uk, ru)
db/                     database documentation and schema reference
docs/                   project documentation
```

## Roadmap

### Shipped

- **v1 (MVP)** — public landing, authenticated CRM, sharing, admin with CMS, i18n, theming.
- **Telegram notifications** — user-authored monthly recurring self-reminders, one per service (anchored to a day of the month or N days before month-end, plus a required text), delivered as a single daily digest.

### Next up

- **Google Drive integration** for bill photos and receipts — designed, not yet built.

### Possible future directions

No commitment — directions that may or may not happen:

- Data export (CSV / Excel / PDF)
- Integrations with provider APIs
- Funny Alien 👽

## License

This project is licensed under the **GNU Affero General Public License v3.0** — see [LICENSE](./LICENSE).

Copyright (C) 2026 Artem Loban

If you'd like to use this code in a closed-source or commercial product, a separate commercial license is available. Reach out at `utilitybills.crm@gmail.com`.
