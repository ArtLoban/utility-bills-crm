import { z } from "zod";

// ---------------------------------------------------------------------------
// Reusable card schemas
// ---------------------------------------------------------------------------

const featureCardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "landingCms.home.errors.featureTitle")
    .max(100, "landingCms.home.errors.featureTitle"),
  body: z
    .string()
    .trim()
    .min(1, "landingCms.home.errors.featureBody")
    .max(500, "landingCms.home.errors.featureBody"),
});

const archCardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "landingCms.project.errors.archTitle")
    .max(100, "landingCms.project.errors.archTitle"),
  body: z
    .string()
    .trim()
    .min(1, "landingCms.project.errors.archBody")
    .max(500, "landingCms.project.errors.archBody"),
});

// ---------------------------------------------------------------------------
// Home tab — writes to home_hero + features tables
// ---------------------------------------------------------------------------

export const homeSchema = z.object({
  heroTitle: z
    .string()
    .trim()
    .min(1, "landingCms.home.errors.heroTitle")
    .max(200, "landingCms.home.errors.heroTitle"),
  heroDesc: z
    .string()
    .trim()
    .min(1, "landingCms.home.errors.heroDesc")
    .max(500, "landingCms.home.errors.heroDesc"),
  dashboardCaption: z
    .string()
    .trim()
    .min(1, "landingCms.home.errors.dashboardCaption")
    .max(500, "landingCms.home.errors.dashboardCaption"),
  propertyCaption: z
    .string()
    .trim()
    .min(1, "landingCms.home.errors.propertyCaption")
    .max(500, "landingCms.home.errors.propertyCaption"),
  techHighlights: z
    .string()
    .trim()
    .min(1, "landingCms.home.errors.techHighlights")
    .max(200, "landingCms.home.errors.techHighlights"),
  // z.tuple preserves the fixed-length 4 guarantee and avoids non-null assertions
  // when unpacking to flat DB columns (feature1Title, feature1Body, ...).
  featureCards: z.tuple([
    featureCardSchema,
    featureCardSchema,
    featureCardSchema,
    featureCardSchema,
  ]),
});

// ---------------------------------------------------------------------------
// About tab — writes to about_hero table
// ---------------------------------------------------------------------------

export const aboutSchema = z.object({
  heroGreeting: z
    .string()
    .trim()
    .min(1, "landingCms.about.errors.heroGreeting")
    .max(100, "landingCms.about.errors.heroGreeting"),
  heroDesc: z
    .string()
    .trim()
    .min(1, "landingCms.about.errors.heroDesc")
    .max(300, "landingCms.about.errors.heroDesc"),
  heroText: z
    .string()
    .trim()
    .min(1, "landingCms.about.errors.heroText")
    .max(200, "landingCms.about.errors.heroText"),
  worksWithTitle: z
    .string()
    .trim()
    .min(1, "landingCms.about.errors.worksWithTitle")
    .max(300, "landingCms.about.errors.worksWithTitle"),
  worksWith: z
    .string()
    .trim()
    .min(1, "landingCms.about.errors.worksWith")
    .max(2000, "landingCms.about.errors.worksWith"),
});

// ---------------------------------------------------------------------------
// Project tab — writes to project_hero table
// ---------------------------------------------------------------------------

export const projectSchema = z.object({
  heroTitle: z
    .string()
    .trim()
    .min(1, "landingCms.project.errors.heroTitle")
    .max(200, "landingCms.project.errors.heroTitle"),
  heroDesc: z
    .string()
    .trim()
    .min(1, "landingCms.project.errors.heroDesc")
    .max(500, "landingCms.project.errors.heroDesc"),
  // z.tuple preserves the fixed-length 6 guarantee for arch1..6 flat mapping.
  archCards: z.tuple([
    archCardSchema,
    archCardSchema,
    archCardSchema,
    archCardSchema,
    archCardSchema,
    archCardSchema,
  ]),
  status: z
    .string()
    .trim()
    .min(1, "landingCms.project.errors.status")
    .max(2000, "landingCms.project.errors.status"),
});

// ---------------------------------------------------------------------------
// Global tab — writes to links table
// ---------------------------------------------------------------------------

export const globalSchema = z.object({
  linkedinUrl: z.string().url("landingCms.global.errors.invalidLinkedinUrl"),
  githubUrl: z.string().url("landingCms.global.errors.invalidGithubUrl"),
  projectRepoUrl: z.string().url("landingCms.global.errors.invalidProjectRepoUrl"),
  liveDemoUrl: z.string().url("landingCms.global.errors.invalidLiveDemoUrl"),
  aboutNavVisible: z.boolean(),
  aboutUrlAccessible: z.boolean(),
  projectNavVisible: z.boolean(),
  projectUrlAccessible: z.boolean(),
});
