import { sql } from "drizzle-orm";
import { boolean, check, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

import { brandedUuidPk, timestamps } from "./helpers";

// ---------------------------------------------------------------------------
// Branded ID types
// ---------------------------------------------------------------------------

declare const homeHeroIdBrand: unique symbol;
export type THomeHeroId = string & { readonly [homeHeroIdBrand]: typeof homeHeroIdBrand };

declare const featuresIdBrand: unique symbol;
export type TFeaturesId = string & { readonly [featuresIdBrand]: typeof featuresIdBrand };

declare const aboutHeroIdBrand: unique symbol;
export type TAboutHeroId = string & { readonly [aboutHeroIdBrand]: typeof aboutHeroIdBrand };

declare const projectHeroIdBrand: unique symbol;
export type TProjectHeroId = string & {
  readonly [projectHeroIdBrand]: typeof projectHeroIdBrand;
};

declare const linksIdBrand: unique symbol;
export type TLinksId = string & { readonly [linksIdBrand]: typeof linksIdBrand };

// ---------------------------------------------------------------------------
// Singleton enforcement
// ---------------------------------------------------------------------------
// All five CMS tables use the same pattern:
//   oneRow boolean NOT NULL DEFAULT true
//   UNIQUE (one_row) + CHECK (one_row = true)
//
// This allows at most one row: the value can never be false (CHECK), and only
// one true value can exist (UNIQUE). Idempotent seed uses ON CONFLICT (one_row) DO NOTHING.
// Chosen over fixed-id because it is self-documenting and compatible with UUID PKs.

// ---------------------------------------------------------------------------
// home_hero — Home tab: hero content, screenshot captions, tech highlights
// Does NOT include feature cards — those live in `features` (separate table per #97).
// ---------------------------------------------------------------------------

export const homeHero = pgTable(
  "home_hero",
  {
    id: brandedUuidPk<THomeHeroId>(),
    heroTitle: text("hero_title").notNull(),
    heroDesc: text("hero_desc").notNull(),
    dashboardCaption: text("dashboard_caption").notNull(),
    propertyCaption: text("property_caption").notNull(),
    techHighlights: text("tech_highlights").notNull(),
    // Singleton lock — see block comment above
    oneRow: boolean("one_row").notNull().default(true),
    ...timestamps(),
    // No softDelete() — singleton configuration, not lifecycle data (#6.4 exception)
  },
  (t) => [
    uniqueIndex("home_hero_one_row_unique_idx").on(t.oneRow),
    check("home_hero_one_row_check", sql`${t.oneRow} = true`),
  ],
);

export type THomeHero = typeof homeHero.$inferSelect;
export type TNewHomeHero = typeof homeHero.$inferInsert;

// ---------------------------------------------------------------------------
// features — Home tab: 4 feature cards (fixed positions, singleton row)
// ---------------------------------------------------------------------------

export const cmsFeatures = pgTable(
  "features",
  {
    id: brandedUuidPk<TFeaturesId>(),
    feature1Title: text("feature1_title").notNull(),
    feature1Body: text("feature1_body").notNull(),
    feature2Title: text("feature2_title").notNull(),
    feature2Body: text("feature2_body").notNull(),
    feature3Title: text("feature3_title").notNull(),
    feature3Body: text("feature3_body").notNull(),
    feature4Title: text("feature4_title").notNull(),
    feature4Body: text("feature4_body").notNull(),
    oneRow: boolean("one_row").notNull().default(true),
    ...timestamps(),
  },
  (t) => [
    uniqueIndex("features_one_row_unique_idx").on(t.oneRow),
    check("features_one_row_check", sql`${t.oneRow} = true`),
  ],
);

export type TCmsFeatures = typeof cmsFeatures.$inferSelect;
export type TNewCmsFeatures = typeof cmsFeatures.$inferInsert;

// ---------------------------------------------------------------------------
// about_hero — About tab: hero greeting/desc + "What I work with" body
// ---------------------------------------------------------------------------

export const aboutHero = pgTable(
  "about_hero",
  {
    id: brandedUuidPk<TAboutHeroId>(),
    heroGreeting: text("hero_greeting").notNull(),
    heroDesc: text("hero_desc").notNull(),
    heroText: text("hero_text").notNull(),
    worksWithTitle: text("works_with_title").notNull(),
    worksWith: text("works_with").notNull(),
    oneRow: boolean("one_row").notNull().default(true),
    ...timestamps(),
  },
  (t) => [
    uniqueIndex("about_hero_one_row_unique_idx").on(t.oneRow),
    check("about_hero_one_row_check", sql`${t.oneRow} = true`),
  ],
);

export type TAboutHero = typeof aboutHero.$inferSelect;
export type TNewAboutHero = typeof aboutHero.$inferInsert;

// ---------------------------------------------------------------------------
// project_hero — Project tab: hero + 6 architecture highlights + current status
// All three sections are one singleton row — the tab has a fixed layout.
// ---------------------------------------------------------------------------

export const projectHero = pgTable(
  "project_hero",
  {
    id: brandedUuidPk<TProjectHeroId>(),
    heroTitle: text("hero_title").notNull(),
    heroDesc: text("hero_desc").notNull(),
    arch1Title: text("arch1_title").notNull(),
    arch1Body: text("arch1_body").notNull(),
    arch2Title: text("arch2_title").notNull(),
    arch2Body: text("arch2_body").notNull(),
    arch3Title: text("arch3_title").notNull(),
    arch3Body: text("arch3_body").notNull(),
    arch4Title: text("arch4_title").notNull(),
    arch4Body: text("arch4_body").notNull(),
    arch5Title: text("arch5_title").notNull(),
    arch5Body: text("arch5_body").notNull(),
    arch6Title: text("arch6_title").notNull(),
    arch6Body: text("arch6_body").notNull(),
    status: text("status").notNull(),
    oneRow: boolean("one_row").notNull().default(true),
    ...timestamps(),
  },
  (t) => [
    uniqueIndex("project_hero_one_row_unique_idx").on(t.oneRow),
    check("project_hero_one_row_check", sql`${t.oneRow} = true`),
  ],
);

export type TProjectHero = typeof projectHero.$inferSelect;
export type TNewProjectHero = typeof projectHero.$inferInsert;

// ---------------------------------------------------------------------------
// links — Global tab: external URLs + About/Project visibility toggles (#100)
// Four visibility booleans (about/project × nav-visible/url-accessible) live here.
// There is no sixth table for visibility — these are part of the links singleton.
// ---------------------------------------------------------------------------

export const cmsLinks = pgTable(
  "links",
  {
    id: brandedUuidPk<TLinksId>(),
    linkedinUrl: text("linkedin_url").notNull(),
    githubUrl: text("github_url").notNull(),
    projectRepoUrl: text("project_repo_url").notNull(),
    aboutNavVisible: boolean("about_nav_visible").notNull().default(true),
    aboutUrlAccessible: boolean("about_url_accessible").notNull().default(true),
    projectNavVisible: boolean("project_nav_visible").notNull().default(true),
    projectUrlAccessible: boolean("project_url_accessible").notNull().default(true),
    oneRow: boolean("one_row").notNull().default(true),
    ...timestamps(),
  },
  (t) => [
    uniqueIndex("links_one_row_unique_idx").on(t.oneRow),
    check("links_one_row_check", sql`${t.oneRow} = true`),
  ],
);

export type TCmsLinks = typeof cmsLinks.$inferSelect;
export type TNewCmsLinks = typeof cmsLinks.$inferInsert;
