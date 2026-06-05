ALTER TABLE "about_hero" ADD COLUMN "hero_text" text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE "about_hero" ADD COLUMN "works_with_title" text NOT NULL DEFAULT '';
--> statement-breakpoint
UPDATE "about_hero" SET
  "hero_desc"        = 'Frontend developer. React, TypeScript, complex UIs.',
  "hero_text"        = 'Working remotely, based in Ukraine.',
  "works_with_title" = 'Day-to-day: React with TypeScript, Next.js, modern data tables and visualizations, design systems.',
  "works_with"       = $$Comfortable with: state management at scale (Redux Toolkit, RTK Query), forms and validation, authentication, role-based access.

Most of the last few years went into building a payment orchestration platform — a large back-office admin panel that grew to 50+ pages and a few thousand TypeScript files. This CRM is the next thing I'm building.$$
WHERE "one_row" = true;
--> statement-breakpoint
ALTER TABLE "about_hero" ALTER COLUMN "hero_text" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "about_hero" ALTER COLUMN "works_with_title" DROP DEFAULT;