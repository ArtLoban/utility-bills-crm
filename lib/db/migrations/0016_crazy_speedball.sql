CREATE TABLE "about_hero" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hero_greeting" text NOT NULL,
	"hero_desc" text NOT NULL,
	"works_with" text NOT NULL,
	"one_row" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "about_hero_one_row_check" CHECK ("about_hero"."one_row" = true)
);
--> statement-breakpoint
CREATE TABLE "features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feature1_title" text NOT NULL,
	"feature1_body" text NOT NULL,
	"feature2_title" text NOT NULL,
	"feature2_body" text NOT NULL,
	"feature3_title" text NOT NULL,
	"feature3_body" text NOT NULL,
	"feature4_title" text NOT NULL,
	"feature4_body" text NOT NULL,
	"one_row" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "features_one_row_check" CHECK ("features"."one_row" = true)
);
--> statement-breakpoint
CREATE TABLE "links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"linkedin_url" text NOT NULL,
	"github_url" text NOT NULL,
	"project_repo_url" text NOT NULL,
	"live_demo_url" text NOT NULL,
	"about_nav_visible" boolean DEFAULT true NOT NULL,
	"about_url_accessible" boolean DEFAULT true NOT NULL,
	"project_nav_visible" boolean DEFAULT true NOT NULL,
	"project_url_accessible" boolean DEFAULT true NOT NULL,
	"one_row" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "links_one_row_check" CHECK ("links"."one_row" = true)
);
--> statement-breakpoint
CREATE TABLE "home_hero" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hero_title" text NOT NULL,
	"hero_desc" text NOT NULL,
	"dashboard_caption" text NOT NULL,
	"property_caption" text NOT NULL,
	"tech_highlights" text NOT NULL,
	"one_row" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "home_hero_one_row_check" CHECK ("home_hero"."one_row" = true)
);
--> statement-breakpoint
CREATE TABLE "project_hero" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hero_title" text NOT NULL,
	"hero_desc" text NOT NULL,
	"arch1_title" text NOT NULL,
	"arch1_body" text NOT NULL,
	"arch2_title" text NOT NULL,
	"arch2_body" text NOT NULL,
	"arch3_title" text NOT NULL,
	"arch3_body" text NOT NULL,
	"arch4_title" text NOT NULL,
	"arch4_body" text NOT NULL,
	"arch5_title" text NOT NULL,
	"arch5_body" text NOT NULL,
	"arch6_title" text NOT NULL,
	"arch6_body" text NOT NULL,
	"status" text NOT NULL,
	"one_row" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_hero_one_row_check" CHECK ("project_hero"."one_row" = true)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "about_hero_one_row_unique_idx" ON "about_hero" USING btree ("one_row");--> statement-breakpoint
CREATE UNIQUE INDEX "features_one_row_unique_idx" ON "features" USING btree ("one_row");--> statement-breakpoint
CREATE UNIQUE INDEX "links_one_row_unique_idx" ON "links" USING btree ("one_row");--> statement-breakpoint
CREATE UNIQUE INDEX "home_hero_one_row_unique_idx" ON "home_hero" USING btree ("one_row");--> statement-breakpoint
CREATE UNIQUE INDEX "project_hero_one_row_unique_idx" ON "project_hero" USING btree ("one_row");--> statement-breakpoint
INSERT INTO "home_hero" ("id", "hero_title", "hero_desc", "dashboard_caption", "property_caption", "tech_highlights", "one_row", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'Utility Bills CRM',
  'A multi-tenant web application for tracking utility bills across multiple properties — apartments, houses, summer homes. Log meter readings, record bills and payments, see balances and consumption analytics over time.',
  'Dashboard. Balance summary across all properties, expense breakdown by service, monthly trends, and consumption analytics with switchable money/units view.',
  'Property detail. Each property holds its own services with full contract history — provider changes, tariff changes, account number changes, all preserved.',
  'Built with Next.js, TypeScript, PostgreSQL, Drizzle ORM, Auth.js, shadcn/ui, and Tailwind.',
  true,
  now(),
  now()
)
ON CONFLICT (one_row) DO NOTHING;--> statement-breakpoint
INSERT INTO "features" ("id", "feature1_title", "feature1_body", "feature2_title", "feature2_body", "feature3_title", "feature3_body", "feature4_title", "feature4_body", "one_row", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'Properties and people',
  'Track multiple properties — apartments, houses, summer homes — and share access with family at owner, editor, or viewer level.',
  'Tariffs change. History stays.',
  'Every tariff, account number, and payment detail is stored with its validity period. Recompute past months correctly even after rates change.',
  'Bills and payments as a ledger',
  'Bills and payments are independent records. Balance is derived. No forced "this payment pays that bill" links — just the math, the way real households do it.',
  'From numbers to trends',
  'Pie, stacked bar, and line charts show where money goes, how consumption shifts month to month, and whether things are getting better or worse.',
  true,
  now(),
  now()
)
ON CONFLICT (one_row) DO NOTHING;--> statement-breakpoint
INSERT INTO "about_hero" ("id", "hero_greeting", "hero_desc", "works_with", "one_row", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'Hi, I''m Art.',
  'Frontend developer. React, TypeScript, complex UIs. Working remotely, based in Ukraine.',
  $$Day-to-day: React with TypeScript, Next.js, modern data tables and visualizations, design systems.

Comfortable with: state management at scale (Redux Toolkit, RTK Query), forms and validation, authentication, role-based access.

Most of the last few years went into building a payment orchestration platform — a large back-office admin panel that grew to 50+ pages and a few thousand TypeScript files. This CRM is the next thing I'm building.$$,
  true,
  now(),
  now()
)
ON CONFLICT (one_row) DO NOTHING;--> statement-breakpoint
INSERT INTO "project_hero" ("id", "hero_title", "hero_desc", "arch1_title", "arch1_body", "arch2_title", "arch2_body", "arch3_title", "arch3_body", "arch4_title", "arch4_body", "arch5_title", "arch5_body", "arch6_title", "arch6_body", "status", "one_row", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'Utility Bills CRM',
  'A multi-tenant web application for utility bill tracking, built as both a real product and a senior-level engineering practice ground. The page below walks through the stack, architecture, and the decisions behind them.',
  'Next.js full-stack with RSC',
  'One codebase, no separate API layer. Server Components fetch from the database directly; Server Actions handle mutations with typed validation. No type duplication, no CORS, no version skew between services.',
  'PostgreSQL with temporal data',
  'Tariffs, account numbers, payment details — anything that changes over time — is stored with validFrom / validTo intervals using half-open semantics [start, end). Past months recompute correctly using whichever rate was valid then.',
  'Drizzle ORM, not Prisma',
  'Drizzle keeps SQL visible — schema-as-TypeScript, but queries that read like SQL. Better fit for the learning goal, better fit for serverless connection patterns, and drizzle-zod removes a whole class of schema/validation duplication.',
  'Auth.js with database sessions',
  'Sliding expiration, immediate revocation, and a "Remember me" 30-day cap that forces conscious re-authentication. The OAuth flow is delegated to the library; sessions live in the database where revoking them takes one row update.',
  'Ledger-style accounting',
  'Bills and payments are independent records. There is no "this payment pays that bill" relationship — balance is derived from sum(bills) − sum(payments). Matches how households actually think about their utilities and stays correct when amounts don''t line up perfectly.',
  'Multi-tenant from day one',
  'Every entity carries an owner reference. Every query filters by access through typed helpers like accessibleProperties(userId). Multi-tenancy is in the data model, not bolted on later — and that decision shapes auth, sharing, soft-delete, and admin all at once.',
  $$Where it is now. The app is in active development. Architecture is finalized, the data model is implemented, the UI is being built screen by screen. The first real user — the author's wife — is testing flows as they ship.

v1 (in progress). Public landing, authenticated CRM, multi-user sharing, admin section with landing CMS, three languages, light/dark theme.

Beyond v1. File storage (Google Drive), Telegram notifications, custom services, export, OCR for scanned bills, provider integrations. Roadmap detail in the README.

Hosted on Vercel (app) and Neon (database).$$,
  true,
  now(),
  now()
)
ON CONFLICT (one_row) DO NOTHING;--> statement-breakpoint
INSERT INTO "links" ("id", "linkedin_url", "github_url", "project_repo_url", "live_demo_url", "about_nav_visible", "about_url_accessible", "project_nav_visible", "project_url_accessible", "one_row", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'https://linkedin.com/in/artem-loban',
  'https://github.com/artloban',
  'https://github.com/artloban/utility-bills-crm',
  'https://utility-bills-crm.vercel.app',
  true,
  true,
  true,
  true,
  true,
  now(),
  now()
)
ON CONFLICT (one_row) DO NOTHING;