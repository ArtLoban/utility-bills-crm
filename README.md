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
- Phase 7 in progress — build MVP. Next.js scaffold initialized; no production code yet.

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
- **i18n:** next-intl (en/uk/ru)
- **Theming:** next-themes (light/dark)
- **Logging:** pino
- **Error tracking:** Sentry
- **Testing:** Vitest + @testing-library/react
- **Tooling:** ESLint (Flat Config), Prettier, Husky + lint-staged
- **CI/CD:** GitHub Actions + Vercel auto-deploy
- **Hosting:** Vercel + Neon (both free tier)
- **Package manager:** npm

## Getting Started

> Instructions will be added when the project is initialized.

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Required environment variables:

- `DATABASE_URL` — Neon PostgreSQL connection string
- `AUTH_SECRET` — Auth.js secret
- `AUTH_GOOGLE_ID` — Google OAuth client ID
- `AUTH_GOOGLE_SECRET` — Google OAuth client secret
- `SENTRY_DSN` — Sentry project DSN

## Project Structure

> Will be documented once the project is scaffolded.

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
