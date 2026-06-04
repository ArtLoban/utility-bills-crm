import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/lib/db/client";
import { aboutHero, cmsFeatures, cmsLinks, homeHero, projectHero } from "@/lib/db/schema/cms";
import type { TCmsLinks } from "@/lib/db/schema/cms";
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
// Snapshot / restore
// ---------------------------------------------------------------------------

let cmsLinksSnap: TCmsLinks;

beforeAll(async () => {
  const [[cl]] = await Promise.all([db.select().from(cmsLinks).limit(1)]);
  cmsLinksSnap = cl!;
});

afterEach(async () => {
  const { id: _id, createdAt: _ca, updatedAt: _ua, oneRow: _or, ...clData } = cmsLinksSnap;
  await Promise.all([
    db.insert(cmsLinks).values(clData).onConflictDoUpdate({ target: cmsLinks.oneRow, set: clData }),
    db.delete(homeHero),
    db.delete(cmsFeatures),
    db.delete(aboutHero),
    db.delete(projectHero),
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
