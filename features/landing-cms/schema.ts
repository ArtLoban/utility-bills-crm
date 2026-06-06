import { z } from "zod";

// ---------------------------------------------------------------------------
// Reusable card schemas
// ---------------------------------------------------------------------------

const featureCardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Feature card title is required.")
    .max(100, "Feature card title is required."),
  body: z
    .string()
    .trim()
    .min(1, "Feature card body is required.")
    .max(500, "Feature card body is required."),
});

const archCardSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Architecture card title is required.")
    .max(100, "Architecture card title is required."),
  body: z
    .string()
    .trim()
    .min(1, "Architecture card body is required.")
    .max(500, "Architecture card body is required."),
});

// ---------------------------------------------------------------------------
// Home tab — writes to home_hero + features tables
// ---------------------------------------------------------------------------

export const homeSchema = z.object({
  heroTitle: z
    .string()
    .trim()
    .min(1, "Hero title is required.")
    .max(200, "Hero title is required."),
  heroDesc: z
    .string()
    .trim()
    .min(1, "Hero description is required.")
    .max(500, "Hero description is required."),
  dashboardCaption: z
    .string()
    .trim()
    .min(1, "Dashboard caption is required.")
    .max(500, "Dashboard caption is required."),
  propertyCaption: z
    .string()
    .trim()
    .min(1, "Property caption is required.")
    .max(500, "Property caption is required."),
  techHighlights: z
    .string()
    .trim()
    .min(1, "Tech highlights line is required.")
    .max(200, "Tech highlights line is required."),
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
  heroGreeting: z.string().trim().min(1, "Greeting is required.").max(100, "Greeting is required."),
  heroDesc: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(300, "Description is required."),
  heroText: z.string().trim().min(1, "Hero text is required.").max(200, "Hero text is required."),
  worksWithTitle: z
    .string()
    .trim()
    .min(1, '"What I work with" section is required.')
    .max(300, '"What I work with" section is required.'),
  worksWith: z
    .string()
    .trim()
    .min(1, '"What I work with" section is required.')
    .max(2000, '"What I work with" section is required.'),
});

// ---------------------------------------------------------------------------
// Project tab — writes to project_hero table
// ---------------------------------------------------------------------------

export const projectSchema = z.object({
  heroTitle: z
    .string()
    .trim()
    .min(1, "Hero title is required.")
    .max(200, "Hero title is required."),
  heroDesc: z
    .string()
    .trim()
    .min(1, "Hero description is required.")
    .max(500, "Hero description is required."),
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
    .min(1, "Status section is required.")
    .max(2000, "Status section is required."),
});

// ---------------------------------------------------------------------------
// Global tab — writes to links table
// ---------------------------------------------------------------------------

export const globalSchema = z.object({
  linkedinUrl: z.string().url("Enter a valid LinkedIn URL."),
  githubUrl: z.string().url("Enter a valid GitHub URL."),
  projectRepoUrl: z.string().url("Enter a valid project repository URL."),
  aboutNavVisible: z.boolean(),
  aboutUrlAccessible: z.boolean(),
  projectNavVisible: z.boolean(),
  projectUrlAccessible: z.boolean(),
});
