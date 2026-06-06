# Utility Bills CRM

A personal multi-tenant application for tracking utility bills across multiple properties.

Built primarily as a senior/architect-level growth playground in frontend engineering, with a real product target: my wife, who currently tracks two apartments on paper.

## Project Goals (in priority order)

1. **Grow as a frontend/architect-level engineer.** Every decision is made with senior-level rigor. The stack and architecture reflect practices to internalize, not the fastest path to features.
2. **Serve as a portfolio piece.** The project should look and work like a serious, shippable product — useful for demonstrating skill breadth to potential employers.
3. **Deliver a useful product.** First user is my wife, then family members. Real users keep scope honest.

## Status

- Phase 4 complete — architecture and stack finalized.
- Phase 5 complete — data model designed. See `db/DATA_MODEL.md` and `db/SCHEMA_REFERENCE.md`.
- Phase 6 complete — UI architecture designed. See `docs/UI_ARCHITECTURE.md`.
- Phase 7 in progress — build MVP.
  - Infrastructure complete: scaffold, DB schema + migrations, Auth.js v5 + Google OAuth, design system (shadcn/ui + Radix), i18n (next-intl), logging (pino).
  - Public landing pages (`/`, `/about`, `/project`) — complete.
  - Admin section — complete: dashboard, properties oversight, users, landing CMS.
  - Authenticated CRM — UI and pages complete across all screens (dashboard with charts, properties, meters, services, bills, payments, sharing, settings); backend CRUD integration (Server Actions, business logic) in progress.
  - Remaining: bill/reading server actions, demo mode, Sentry integration, strategic tests.

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
- **Notifications:** sonner
- **URL state:** nuqs
- **Date utilities:** date-fns
- **i18n:** next-intl (en/uk/ru)
- **Theming:** next-themes (light/dark)
- **Logging:** pino
- **Error tracking:** Sentry (planned, not yet integrated)
- **Testing:** Vitest + @testing-library/react
- **Tooling:** ESLint (Flat Config), Prettier, Husky + lint-staged
- **CI/CD:** GitHub Actions + Vercel auto-deploy
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

Required environment variables:

- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — Auth.js secret (`openssl rand -base64 32`)
- `AUTH_GOOGLE_ID` — Google OAuth client ID
- `AUTH_GOOGLE_SECRET` — Google OAuth client secret
- `ADMIN_EMAILS` — comma-separated list of emails that receive `systemRole = 'admin'` on first sign-in
- `SENTRY_DSN` — Sentry project DSN (optional; not yet integrated)

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
  logger/               pino setup with correlation IDs
  types/                shared TypeScript types
  utils/                shared utilities
  routes.ts             centralized route configuration
i18n/                   next-intl runtime config
messages/               i18n translation files (en, uk, ru)
db/                     database documentation and schema reference
docs/                   project documentation
```

## Roadmap

### v1 (MVP)

Public landing, authenticated CRM, sharing, admin with CMS, i18n, theming.

### v2 — Extensions

- Email/password authentication alongside Google
- Google Drive integration for bill photos and receipts
- Telegram notifications for deadlines and debts

### v3 — Convenience and analytics

- Custom user-defined services
- Data export (CSV / Excel / PDF)
- Full-text search
- Device-level session management

### v4+ — Automation

- Email bill parsing
- OCR for scanned bills
- Integrations with provider APIs
- Structured bill components for provider reconciliation

## License

Private. Not for public use.
