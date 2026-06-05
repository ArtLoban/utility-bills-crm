import { config } from "dotenv";

config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { aboutHero, cmsFeatures, homeHero, projectHero } from "../schema/cms";

const main = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    await db.transaction(async (tx) => {
      const [hh] = await tx
        .update(homeHero)
        .set({
          heroTitle: "Utility Bills CRM",
          heroDesc:
            "A multi-tenant web application for tracking utility bills across multiple properties — apartments, houses, summer homes. Log meter readings, record bills and payments, see balances and consumption analytics over time.",
          dashboardCaption:
            "**Dashboard.** Balance summary across all properties, expense breakdown by service, monthly trends, and consumption analytics with switchable money/units view.",
          propertyCaption:
            "**Property detail.** Each property holds its own services with full contract history — provider changes, tariff changes, account number changes, all preserved.",
          techHighlights:
            "Built with **Next.js**, **TypeScript**, **PostgreSQL**, **Drizzle ORM**, **Auth.js**, **shadcn/ui**, and **Tailwind**.",
        })
        .where(eq(homeHero.oneRow, true))
        .returning({ id: homeHero.id });

      if (!hh) throw new Error("home_hero row missing — run db:migrate first");
      console.log("  ✓ home_hero");

      const [cf] = await tx
        .update(cmsFeatures)
        .set({
          feature1Title: "Properties and people",
          feature1Body:
            "Track multiple properties — apartments, houses, summer homes — and share access with family at owner, editor, or viewer level.",
          feature2Title: "Tariffs change. History stays.",
          feature2Body:
            "Every tariff, account number, and payment detail is stored with its validity period. Recompute past months correctly even after rates change.",
          feature3Title: "Bills and payments as a ledger",
          feature3Body:
            'Bills and payments are independent records. Balance is derived. No forced "this payment pays that bill" links — just the math, the way real households do it.',
          feature4Title: "From numbers to trends",
          feature4Body:
            "Pie, stacked bar, and line charts show where money goes, how consumption shifts month to month, and whether things are getting better or worse.",
        })
        .where(eq(cmsFeatures.oneRow, true))
        .returning({ id: cmsFeatures.id });

      if (!cf) throw new Error("features row missing — run db:migrate first");
      console.log("  ✓ features");

      const [ah] = await tx
        .update(aboutHero)
        .set({
          heroGreeting: "Hi, I'm Art.",
          heroDesc: "Frontend developer. React, TypeScript, complex UIs.",
          heroText: "Working remotely, based in Ukraine.",
          worksWithTitle:
            "Day-to-day: React with TypeScript, Next.js, modern data tables and visualizations, design systems.",
          worksWith: [
            "Comfortable with: state management at scale (Redux Toolkit, RTK Query), forms and validation, authentication, role-based access.",
            "Most of the last few years went into building a payment orchestration platform — a large back-office admin panel that grew to 50+ pages and a few thousand TypeScript files. This CRM is the next thing I'm building.",
          ].join("\n\n"),
        })
        .where(eq(aboutHero.oneRow, true))
        .returning({ id: aboutHero.id });

      if (!ah) throw new Error("about_hero row missing — run db:migrate first");
      console.log("  ✓ about_hero");

      const [ph] = await tx
        .update(projectHero)
        .set({
          heroTitle: "Utility Bills CRM",
          heroDesc:
            "A multi-tenant web application for utility bill tracking, built as both a real product and a senior-level engineering practice ground. The page below walks through the stack, architecture, and the decisions behind them.",
          arch1Title: "Next.js full-stack with RSC",
          arch1Body:
            "One codebase, no separate API layer. Server Components fetch from the database directly; Server Actions handle mutations with typed validation. No type duplication, no CORS, no version skew between services.",
          arch2Title: "PostgreSQL with temporal data",
          arch2Body:
            "Tariffs, account numbers, payment details — anything that changes over time — is stored with `validFrom` / `validTo` intervals using half-open semantics `[start, end)`. Past months recompute correctly using whichever rate was valid then.",
          arch3Title: "Drizzle ORM, not Prisma",
          arch3Body:
            "Drizzle keeps SQL visible — schema-as-TypeScript, but queries that read like SQL. Better fit for the learning goal, better fit for serverless connection patterns, and `drizzle-zod` removes a whole class of schema/validation duplication.",
          arch4Title: "Auth.js with database sessions",
          arch4Body:
            'Sliding expiration, immediate revocation, and a "Remember me" 30-day cap that forces conscious re-authentication. The OAuth flow is delegated to the library; sessions live in the database where revoking them takes one row update.',
          arch5Title: "Ledger-style accounting",
          arch5Body:
            'Bills and payments are independent records. There is no "this payment pays that bill" relationship — balance is derived from `sum(bills) − sum(payments)`. Matches how households actually think about their utilities and stays correct when amounts don\'t line up perfectly.',
          arch6Title: "Multi-tenant from day one",
          arch6Body:
            "Every entity carries an owner reference. Every query filters by access through typed helpers like `accessibleProperties(userId)`. Multi-tenancy is in the data model, not bolted on later — and that decision shapes auth, sharing, soft-delete, and admin all at once.",
          status: [
            "**Where it is now.** The app is in active development. Architecture is finalized, the data model is implemented, the UI is being built screen by screen. The first real user — the author's wife — is testing flows as they ship.",
            "**v1 (in progress).** Public landing, authenticated CRM, multi-user sharing, admin section with landing CMS, three languages, light/dark theme.",
            "**Beyond v1.** File storage (Google Drive), Telegram notifications, custom services, export, OCR for scanned bills, provider integrations. Roadmap detail in the README.",
            "**Hosted on** Vercel (app) and Neon (database).",
          ].join("\n\n"),
        })
        .where(eq(projectHero.oneRow, true))
        .returning({ id: projectHero.id });

      if (!ph) throw new Error("project_hero row missing — run db:migrate first");
      console.log("  ✓ project_hero");
    });

    console.log("CMS content seed complete.");
  } finally {
    await pool.end();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
