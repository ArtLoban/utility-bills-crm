UPDATE "home_hero" SET
  "hero_title"        = 'Utility Bills CRM',
  "hero_desc"         = 'A multi-tenant web application for tracking utility bills across multiple properties — apartments, houses, summer homes. Log meter readings, record bills and payments, see balances and consumption analytics over time.',
  "dashboard_caption" = '**Dashboard.** Balance summary across all properties, expense breakdown by service, monthly trends, and consumption analytics with switchable money/units view.',
  "property_caption"  = '**Property detail.** Each property holds its own services with full contract history — provider changes, tariff changes, account number changes, all preserved.',
  "tech_highlights"   = 'Built with **Next.js**, **TypeScript**, **PostgreSQL**, **Drizzle ORM**, **Auth.js**, **shadcn/ui**, and **Tailwind**.'
WHERE "one_row" = true;
--> statement-breakpoint
UPDATE "features" SET
  "feature1_title" = 'Properties and people',
  "feature1_body"  = 'Track multiple properties — apartments, houses, summer homes — and share access with family at owner, editor, or viewer level.',
  "feature2_title" = 'Tariffs change. History stays.',
  "feature2_body"  = 'Every tariff, account number, and payment detail is stored with its validity period. Recompute past months correctly even after rates change.',
  "feature3_title" = 'Bills and payments as a ledger',
  "feature3_body"  = 'Bills and payments are independent records. Balance is derived. No forced "this payment pays that bill" links — just the math, the way real households do it.',
  "feature4_title" = 'From numbers to trends',
  "feature4_body"  = 'Pie, stacked bar, and line charts show where money goes, how consumption shifts month to month, and whether things are getting better or worse.'
WHERE "one_row" = true;
--> statement-breakpoint
UPDATE "about_hero" SET
  "hero_greeting" = 'Hi, I''m Art.',
  "hero_desc"     = 'Frontend developer. React, TypeScript, complex UIs. Working remotely, based in Ukraine.',
  "works_with"    = $$Day-to-day: React with TypeScript, Next.js, modern data tables and visualizations, design systems.

Comfortable with: state management at scale (Redux Toolkit, RTK Query), forms and validation, authentication, role-based access.

Most of the last few years went into building a payment orchestration platform — a large back-office admin panel that grew to 50+ pages and a few thousand TypeScript files. This CRM is the next thing I''m building.$$
WHERE "one_row" = true;
--> statement-breakpoint
UPDATE "project_hero" SET
  "hero_title"  = 'Utility Bills CRM',
  "hero_desc"   = 'A multi-tenant web application for utility bill tracking, built as both a real product and a senior-level engineering practice ground. The page below walks through the stack, architecture, and the decisions behind them.',
  "arch1_title" = 'Next.js full-stack with RSC',
  "arch1_body"  = 'One codebase, no separate API layer. Server Components fetch from the database directly; Server Actions handle mutations with typed validation. No type duplication, no CORS, no version skew between services.',
  "arch2_title" = 'PostgreSQL with temporal data',
  "arch2_body"  = 'Tariffs, account numbers, payment details — anything that changes over time — is stored with `validFrom` / `validTo` intervals using half-open semantics `[start, end)`. Past months recompute correctly using whichever rate was valid then.',
  "arch3_title" = 'Drizzle ORM, not Prisma',
  "arch3_body"  = 'Drizzle keeps SQL visible — schema-as-TypeScript, but queries that read like SQL. Better fit for the learning goal, better fit for serverless connection patterns, and `drizzle-zod` removes a whole class of schema/validation duplication.',
  "arch4_title" = 'Auth.js with database sessions',
  "arch4_body"  = 'Sliding expiration, immediate revocation, and a "Remember me" 30-day cap that forces conscious re-authentication. The OAuth flow is delegated to the library; sessions live in the database where revoking them takes one row update.',
  "arch5_title" = 'Ledger-style accounting',
  "arch5_body"  = 'Bills and payments are independent records. There is no "this payment pays that bill" relationship — balance is derived from `sum(bills) − sum(payments)`. Matches how households actually think about their utilities and stays correct when amounts don''t line up perfectly.',
  "arch6_title" = 'Multi-tenant from day one',
  "arch6_body"  = 'Every entity carries an owner reference. Every query filters by access through typed helpers like `accessibleProperties(userId)`. Multi-tenancy is in the data model, not bolted on later — and that decision shapes auth, sharing, soft-delete, and admin all at once.',
  "status"      = $$**Where it is now.** The app is in active development. Architecture is finalized, the data model is implemented, the UI is being built screen by screen. The first real user — the author''s wife — is testing flows as they ship.

**v1 (in progress).** Public landing, authenticated CRM, multi-user sharing, admin section with landing CMS, three languages, light/dark theme.

**Beyond v1.** File storage (Google Drive), Telegram notifications, custom services, export, OCR for scanned bills, provider integrations. Roadmap detail in the README.

**Hosted on** Vercel (app) and Neon (database).$$
WHERE "one_row" = true;