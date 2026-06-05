import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/lib/db/client";
import { aboutHero, cmsFeatures, cmsLinks, homeHero, projectHero } from "@/lib/db/schema/cms";
import type {
  TAboutHero,
  TCmsFeatures,
  TCmsLinks,
  THomeHero,
  TProjectHero,
} from "@/lib/db/schema/cms";
import { auth } from "@/lib/auth";

import { saveAboutCms, saveGlobalCms, saveHomeCms, saveProjectCms } from "../actions";
import { getPublicAbout, getPublicHome, getPublicLinks, getPublicProject } from "../query";
import type { TAboutPayload, TGlobalPayload, THomePayload, TProjectPayload } from "../types";

vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

const mockAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "pub-reads-test-admin", systemRole: "admin" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

const mockNonAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "pub-reads-test-user", systemRole: "user" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

// ---------------------------------------------------------------------------
// Valid payloads for setup
// ---------------------------------------------------------------------------

const CARD = { title: "Card title", body: "Card body" } as const;
const ARCH = { title: "Arch title", body: "Arch body" } as const;

const VALID_HOME: THomePayload = {
  heroTitle: "Public test hero",
  heroDesc: "Public test desc.",
  dashboardCaption: "Dashboard caption.",
  propertyCaption: "Property caption.",
  techHighlights: "Next.js, TypeScript.",
  featureCards: [CARD, CARD, CARD, CARD],
};

const VALID_ABOUT: TAboutPayload = {
  heroGreeting: "Hi, public test.",
  heroDesc: "Public test about desc.",
  heroText: "Based in Ukraine.",
  worksWithTitle: "Day-to-day: React.",
  worksWith: "React, TypeScript.",
};

const VALID_PROJECT: TProjectPayload = {
  heroTitle: "Public test project",
  heroDesc: "Project desc.",
  archCards: [ARCH, ARCH, ARCH, ARCH, ARCH, ARCH],
  status: "In progress.",
};

const VALID_GLOBAL: TGlobalPayload = {
  linkedinUrl: "https://linkedin.com/in/test",
  githubUrl: "https://github.com/test",
  projectRepoUrl: "https://github.com/test/repo",
  liveDemoUrl: "https://test.vercel.app",
  aboutNavVisible: true,
  aboutUrlAccessible: true,
  projectNavVisible: true,
  projectUrlAccessible: true,
};

// ---------------------------------------------------------------------------
// Snapshot / restore — all 5 CMS tables are restored after each test so that
// cms-schema.integration.test.ts (which runs after this file) finds the seed
// data intact. beforeAll snapshots require the seed to be present.
// ---------------------------------------------------------------------------

let homeHeroSnap: THomeHero;
let cmsFeaturesSnap: TCmsFeatures;
let aboutHeroSnap: TAboutHero;
let projectHeroSnap: TProjectHero;
let cmsLinksSnap: TCmsLinks;

beforeAll(async () => {
  const [[hh], [cf], [ah], [ph], [cl]] = await Promise.all([
    db.select().from(homeHero).limit(1),
    db.select().from(cmsFeatures).limit(1),
    db.select().from(aboutHero).limit(1),
    db.select().from(projectHero).limit(1),
    db.select().from(cmsLinks).limit(1),
  ]);
  if (!hh || !cf || !ah || !ph || !cl) {
    throw new Error("CMS seed is missing — run db:migrate first");
  }
  homeHeroSnap = hh;
  cmsFeaturesSnap = cf;
  aboutHeroSnap = ah;
  projectHeroSnap = ph;
  cmsLinksSnap = cl;
});

afterEach(async () => {
  const { id: _id1, createdAt: _ca1, updatedAt: _ua1, oneRow: _or1, ...hhData } = homeHeroSnap;
  const { id: _id2, createdAt: _ca2, updatedAt: _ua2, oneRow: _or2, ...cfData } = cmsFeaturesSnap;
  const { id: _id3, createdAt: _ca3, updatedAt: _ua3, oneRow: _or3, ...ahData } = aboutHeroSnap;
  const { id: _id4, createdAt: _ca4, updatedAt: _ua4, oneRow: _or4, ...phData } = projectHeroSnap;
  const { id: _id5, createdAt: _ca5, updatedAt: _ua5, oneRow: _or5, ...clData } = cmsLinksSnap;
  await Promise.all([
    db.insert(homeHero).values(hhData).onConflictDoUpdate({ target: homeHero.oneRow, set: hhData }),
    db
      .insert(cmsFeatures)
      .values(cfData)
      .onConflictDoUpdate({ target: cmsFeatures.oneRow, set: cfData }),
    db
      .insert(aboutHero)
      .values(ahData)
      .onConflictDoUpdate({ target: aboutHero.oneRow, set: ahData }),
    db
      .insert(projectHero)
      .values(phData)
      .onConflictDoUpdate({ target: projectHero.oneRow, set: phData }),
    db.insert(cmsLinks).values(clData).onConflictDoUpdate({ target: cmsLinks.oneRow, set: clData }),
  ]);
});

beforeEach(() => {
  mockAdmin();
});

// ---------------------------------------------------------------------------
// Public reads are unguarded
// ---------------------------------------------------------------------------

describe("public reads — unguarded", () => {
  it("getPublicLinks() returns data with a non-admin session", async () => {
    mockNonAdmin();
    const links = await getPublicLinks();
    expect(links).toBeDefined();
    expect(typeof links!.linkedinUrl).toBe("string");
  });

  it("getPublicAbout() returns data with a non-admin session", async () => {
    mockAdmin();
    await saveAboutCms(VALID_ABOUT);

    mockNonAdmin();
    const row = await getPublicAbout();
    expect(row).toBeDefined();
    expect(row!.heroGreeting).toBe(VALID_ABOUT.heroGreeting);
  });

  it("getPublicHome() returns data with a non-admin session", async () => {
    mockAdmin();
    await saveHomeCms(VALID_HOME);

    mockNonAdmin();
    const { homeHero: hh, features } = await getPublicHome();
    expect(hh).toBeDefined();
    expect(features).toBeDefined();
  });

  it("getPublicProject() returns data with a non-admin session", async () => {
    mockAdmin();
    await saveProjectCms(VALID_PROJECT);

    mockNonAdmin();
    const row = await getPublicProject();
    expect(row).toBeDefined();
    expect(row!.heroTitle).toBe(VALID_PROJECT.heroTitle);
  });
});

// ---------------------------------------------------------------------------
// Visibility flags
// ---------------------------------------------------------------------------

describe("visibility flags", () => {
  it("getPublicLinks() reflects aboutUrlAccessible = false", async () => {
    await saveGlobalCms({ ...VALID_GLOBAL, aboutUrlAccessible: false });
    const links = await getPublicLinks();
    expect(links!.aboutUrlAccessible).toBe(false);
  });

  it("getPublicLinks() reflects projectNavVisible = false", async () => {
    await saveGlobalCms({ ...VALID_GLOBAL, projectNavVisible: false });
    const links = await getPublicLinks();
    expect(links!.projectNavVisible).toBe(false);
  });

  it("getPublicLinks() reflects all four flags when all false", async () => {
    await saveGlobalCms({
      ...VALID_GLOBAL,
      aboutNavVisible: false,
      aboutUrlAccessible: false,
      projectNavVisible: false,
      projectUrlAccessible: false,
    });
    const links = await getPublicLinks();
    expect(links!.aboutNavVisible).toBe(false);
    expect(links!.aboutUrlAccessible).toBe(false);
    expect(links!.projectNavVisible).toBe(false);
    expect(links!.projectUrlAccessible).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Content source — DB value is returned, not stale data
// ---------------------------------------------------------------------------

describe("content source", () => {
  it("getPublicHome() returns updated heroTitle after saveHomeCms", async () => {
    await saveHomeCms({ ...VALID_HOME, heroTitle: "Updated home title" });
    const { homeHero: hh } = await getPublicHome();
    expect(hh!.heroTitle).toBe("Updated home title");
  });

  it("getPublicHome() returns updated feature cards after saveHomeCms", async () => {
    await saveHomeCms({
      ...VALID_HOME,
      featureCards: [{ title: "Updated feature", body: "Updated body" }, CARD, CARD, CARD],
    });
    const { features } = await getPublicHome();
    expect(features!.feature1Title).toBe("Updated feature");
    expect(features!.feature1Body).toBe("Updated body");
  });

  it("getPublicAbout() returns updated worksWith after saveAboutCms", async () => {
    const worksWith = "Paragraph one.\n\nParagraph two.";
    await saveAboutCms({ ...VALID_ABOUT, worksWith });
    const row = await getPublicAbout();
    expect(row!.worksWith).toBe(worksWith);
  });

  it("getPublicProject() returns updated heroTitle and status after saveProjectCms", async () => {
    await saveProjectCms({ ...VALID_PROJECT, heroTitle: "Updated project", status: "Done." });
    const row = await getPublicProject();
    expect(row!.heroTitle).toBe("Updated project");
    expect(row!.status).toBe("Done.");
  });

  it("getPublicLinks() returns updated projectRepoUrl after saveGlobalCms", async () => {
    await saveGlobalCms({ ...VALID_GLOBAL, projectRepoUrl: "https://github.com/updated/repo" });
    const links = await getPublicLinks();
    expect(links!.projectRepoUrl).toBe("https://github.com/updated/repo");
  });
});

// ---------------------------------------------------------------------------
// Empty table — defensive undefined, not throw
// ---------------------------------------------------------------------------

describe("empty table handling", () => {
  it("getPublicAbout() returns undefined when table is empty", async () => {
    await db.delete(aboutHero);
    const row = await getPublicAbout();
    expect(row).toBeUndefined();
  });

  it("getPublicProject() returns undefined when table is empty", async () => {
    await db.delete(projectHero);
    const row = await getPublicProject();
    expect(row).toBeUndefined();
  });

  it("getPublicHome() returns { homeHero: undefined, features: undefined } when tables empty", async () => {
    await Promise.all([db.delete(homeHero), db.delete(cmsFeatures)]);
    const { homeHero: hh, features } = await getPublicHome();
    expect(hh).toBeUndefined();
    expect(features).toBeUndefined();
  });
});
