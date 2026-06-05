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
import { ValidationError } from "@/lib/errors";

import { saveAboutCms, saveGlobalCms, saveHomeCms, saveProjectCms } from "../actions";
import { getAboutCms, getGlobalCms, getHomeCms, getProjectCms } from "../query";
import type { TAboutPayload, TGlobalPayload, THomePayload, TProjectPayload } from "../types";

// ---------------------------------------------------------------------------
// next/navigation mock — notFound() must not throw in tests, but must be
// trackable. Without the mock the real Next.js notFound() throws an error
// that would surface as a passing guard test for the wrong reason.
// ---------------------------------------------------------------------------

vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

const mockAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "cms-actions-test-admin", systemRole: "admin" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

const mockNonAdmin = () =>
  vi.mocked(auth).mockResolvedValue({
    user: { id: "cms-actions-test-nonadmin", systemRole: "user" },
  } as unknown as Awaited<ReturnType<typeof auth>>);

// ---------------------------------------------------------------------------
// Valid test payloads — short strings satisfying min(1), no full seed prose.
// ---------------------------------------------------------------------------

const CARD = { title: "Card title", body: "Card body" } as const;
const ARCH = { title: "Arch title", body: "Arch body" } as const;

const VALID_HOME: THomePayload = {
  heroTitle: "Test hero title",
  heroDesc: "Test hero description.",
  dashboardCaption: "Test dashboard caption.",
  propertyCaption: "Test property caption.",
  techHighlights: "Next.js, TypeScript.",
  featureCards: [CARD, CARD, CARD, CARD],
};

const VALID_ABOUT: TAboutPayload = {
  heroGreeting: "Hi, test.",
  heroDesc: "Test about description.",
  heroText: "Working remotely.",
  worksWithTitle: "Day-to-day: React with TypeScript.",
  worksWith: "React, TypeScript.",
};

const VALID_PROJECT: TProjectPayload = {
  heroTitle: "Test project hero",
  heroDesc: "Test project description.",
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
// Snapshot — capture initial DB state; restore after each test that writes.
// CMS tables are singletons: there is always exactly one row.
// afterEach restores directly via db (no auth) to avoid test pollution.
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

  homeHeroSnap = hh!;
  cmsFeaturesSnap = cf!;
  aboutHeroSnap = ah!;
  projectHeroSnap = ph!;
  cmsLinksSnap = cl!;
});

// Restore all tables after each test. Uses upsert with the exact snapshot values.
// id and createdAt are excluded from `set` to preserve original PK and creation time.
afterEach(async () => {
  const { id: _hhId, createdAt: _hhCa, updatedAt: _hhUa, oneRow: _hhOr, ...hhData } = homeHeroSnap;
  const {
    id: _cfId,
    createdAt: _cfCa,
    updatedAt: _cfUa,
    oneRow: _cfOr,
    ...cfData
  } = cmsFeaturesSnap;
  const { id: _ahId, createdAt: _ahCa, updatedAt: _ahUa, oneRow: _ahOr, ...ahData } = aboutHeroSnap;
  const {
    id: _phId,
    createdAt: _phCa,
    updatedAt: _phUa,
    oneRow: _phOr,
    ...phData
  } = projectHeroSnap;
  const { id: _clId, createdAt: _clCa, updatedAt: _clUa, oneRow: _clOr, ...clData } = cmsLinksSnap;

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
// Validation — home
// ---------------------------------------------------------------------------

describe("saveHomeCms — validation", () => {
  it("rejects empty heroTitle", async () => {
    const result = await saveHomeCms({ ...VALID_HOME, heroTitle: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBeInstanceOf(ValidationError);
    expect(result.error.message).toBe("Hero title is required.");
  });

  it("rejects empty heroDesc", async () => {
    const result = await saveHomeCms({ ...VALID_HOME, heroDesc: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe("Hero description is required.");
  });

  it("rejects empty dashboardCaption", async () => {
    const result = await saveHomeCms({ ...VALID_HOME, dashboardCaption: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe("Dashboard caption is required.");
  });

  it("rejects empty techHighlights", async () => {
    const result = await saveHomeCms({ ...VALID_HOME, techHighlights: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe("Tech highlights line is required.");
  });

  it("rejects empty featureCard title", async () => {
    const result = await saveHomeCms({
      ...VALID_HOME,
      featureCards: [{ title: "", body: "body" }, CARD, CARD, CARD],
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe("Feature card title is required.");
  });

  it("rejects empty featureCard body", async () => {
    const result = await saveHomeCms({
      ...VALID_HOME,
      featureCards: [{ title: "title", body: "" }, CARD, CARD, CARD],
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe("Feature card body is required.");
  });
});

// ---------------------------------------------------------------------------
// Validation — about
// ---------------------------------------------------------------------------

describe("saveAboutCms — validation", () => {
  it("rejects empty heroGreeting", async () => {
    const result = await saveAboutCms({ ...VALID_ABOUT, heroGreeting: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBeInstanceOf(ValidationError);
    expect(result.error.message).toBe("Greeting is required.");
  });

  it("rejects empty heroDesc", async () => {
    const result = await saveAboutCms({ ...VALID_ABOUT, heroDesc: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe("Description is required.");
  });

  it("rejects empty worksWith", async () => {
    const result = await saveAboutCms({ ...VALID_ABOUT, worksWith: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe('"What I work with" section is required.');
  });
});

// ---------------------------------------------------------------------------
// Validation — project
// ---------------------------------------------------------------------------

describe("saveProjectCms — validation", () => {
  it("rejects empty heroTitle", async () => {
    const result = await saveProjectCms({ ...VALID_PROJECT, heroTitle: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBeInstanceOf(ValidationError);
    expect(result.error.message).toBe("Hero title is required.");
  });

  it("rejects empty archCard title", async () => {
    const result = await saveProjectCms({
      ...VALID_PROJECT,
      archCards: [{ title: "", body: "body" }, ARCH, ARCH, ARCH, ARCH, ARCH],
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe("Architecture card title is required.");
  });

  it("rejects empty status", async () => {
    const result = await saveProjectCms({ ...VALID_PROJECT, status: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe("Status section is required.");
  });
});

// ---------------------------------------------------------------------------
// Validation — global
// ---------------------------------------------------------------------------

describe("saveGlobalCms — validation", () => {
  it("rejects malformed linkedinUrl", async () => {
    const result = await saveGlobalCms({ ...VALID_GLOBAL, linkedinUrl: "not-a-url" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBeInstanceOf(ValidationError);
    expect(result.error.message).toBe("Enter a valid LinkedIn URL.");
  });

  it("rejects malformed githubUrl", async () => {
    const result = await saveGlobalCms({ ...VALID_GLOBAL, githubUrl: "github.com/test" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe("Enter a valid GitHub URL.");
  });

  it("rejects malformed projectRepoUrl", async () => {
    const result = await saveGlobalCms({ ...VALID_GLOBAL, projectRepoUrl: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe("Enter a valid project repository URL.");
  });

  it("rejects malformed liveDemoUrl", async () => {
    const result = await saveGlobalCms({ ...VALID_GLOBAL, liveDemoUrl: "not a url at all" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.message).toBe("Enter a valid live demo URL.");
  });

  it("accepts all valid URLs", async () => {
    const result = await saveGlobalCms(VALID_GLOBAL);
    expect(result.ok).toBe(true);
  });

  it("accepts false for visibility booleans", async () => {
    const result = await saveGlobalCms({
      ...VALID_GLOBAL,
      aboutNavVisible: false,
      aboutUrlAccessible: false,
      projectNavVisible: false,
      projectUrlAccessible: false,
    });
    expect(result.ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Upsert semantics
// ---------------------------------------------------------------------------

describe("upsert semantics", () => {
  it("saveAboutCms updates existing singleton row", async () => {
    const result = await saveAboutCms({ ...VALID_ABOUT, heroGreeting: "Updated greeting" });
    expect(result.ok).toBe(true);
    const [row] = await db
      .select({ heroGreeting: aboutHero.heroGreeting })
      .from(aboutHero)
      .limit(1);
    expect(row!.heroGreeting).toBe("Updated greeting");
  });

  it("saveAboutCms creates the row when the table is empty", async () => {
    await db.delete(aboutHero);
    const result = await saveAboutCms(VALID_ABOUT);
    expect(result.ok).toBe(true);
    const rows = await db.select().from(aboutHero);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.heroGreeting).toBe(VALID_ABOUT.heroGreeting);
  });

  it("saveGlobalCms updates existing singleton row", async () => {
    const result = await saveGlobalCms({
      ...VALID_GLOBAL,
      linkedinUrl: "https://linkedin.com/in/updated",
    });
    expect(result.ok).toBe(true);
    const [row] = await db.select({ linkedinUrl: cmsLinks.linkedinUrl }).from(cmsLinks).limit(1);
    expect(row!.linkedinUrl).toBe("https://linkedin.com/in/updated");
  });

  it("saveProjectCms creates the row when the table is empty", async () => {
    await db.delete(projectHero);
    const result = await saveProjectCms(VALID_PROJECT);
    expect(result.ok).toBe(true);
    const rows = await db.select().from(projectHero);
    expect(rows).toHaveLength(1);
  });

  it("saveHomeCms updates both homeHero and cmsFeatures", async () => {
    const result = await saveHomeCms({
      ...VALID_HOME,
      heroTitle: "Updated hero",
      featureCards: [{ title: "Updated feature 1", body: "Body 1" }, CARD, CARD, CARD],
    });
    expect(result.ok).toBe(true);
    const [hh] = await db.select({ heroTitle: homeHero.heroTitle }).from(homeHero).limit(1);
    const [cf] = await db
      .select({ feature1Title: cmsFeatures.feature1Title })
      .from(cmsFeatures)
      .limit(1);
    expect(hh!.heroTitle).toBe("Updated hero");
    expect(cf!.feature1Title).toBe("Updated feature 1");
  });
});

// ---------------------------------------------------------------------------
// saveHomeCms transaction atomicity
// ---------------------------------------------------------------------------
// Zod validation runs before the transaction opens. An invalid payload causes
// validation to fail, so neither homeHero nor cmsFeatures is ever written.
// Both tables remain at their pre-call state — this is the atomicity guarantee
// provided at the validation layer (Zod rejects → no DB writes at all).

describe("saveHomeCms — transaction atomicity", () => {
  it("invalid featureCard leaves both homeHero and cmsFeatures unchanged", async () => {
    const [beforeHero] = await db.select({ heroTitle: homeHero.heroTitle }).from(homeHero).limit(1);
    const [beforeFeatures] = await db
      .select({ feature1Title: cmsFeatures.feature1Title })
      .from(cmsFeatures)
      .limit(1);

    const result = await saveHomeCms({
      ...VALID_HOME,
      heroTitle: "Should not be written",
      featureCards: [
        { title: "", body: "body" }, // invalid — Zod rejects before transaction opens
        CARD,
        CARD,
        CARD,
      ],
    });

    expect(result.ok).toBe(false);

    const [afterHero] = await db.select({ heroTitle: homeHero.heroTitle }).from(homeHero).limit(1);
    const [afterFeatures] = await db
      .select({ feature1Title: cmsFeatures.feature1Title })
      .from(cmsFeatures)
      .limit(1);

    expect(afterHero!.heroTitle).toBe(beforeHero!.heroTitle);
    expect(afterFeatures!.feature1Title).toBe(beforeFeatures!.feature1Title);
  });
});

// ---------------------------------------------------------------------------
// Auth guard enforcement
// ---------------------------------------------------------------------------

describe("auth guard", () => {
  it("saveHomeCms rejects a non-admin — notFound() is called", async () => {
    const { notFound } = await import("next/navigation");
    mockNonAdmin();
    // notFound() mock does not throw, so assertAdmin falls through to
    // throw result.error — expect both the rejection and the notFound call.
    await expect(saveHomeCms(VALID_HOME)).rejects.toThrow();
    expect(notFound).toHaveBeenCalled();
  });

  it("saveGlobalCms rejects a non-admin — notFound() is called", async () => {
    const { notFound } = await import("next/navigation");
    mockNonAdmin();
    await expect(saveGlobalCms(VALID_GLOBAL)).rejects.toThrow();
    expect(notFound).toHaveBeenCalled();
  });

  it("getAboutCms rejects a non-admin — notFound() is called", async () => {
    const { notFound } = await import("next/navigation");
    mockNonAdmin();
    await expect(getAboutCms()).rejects.toThrow();
    expect(notFound).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Round-trip fidelity
// ---------------------------------------------------------------------------

describe("round-trip", () => {
  it("saved aboutCms payload is returned unchanged by getAboutCms", async () => {
    const payload: TAboutPayload = {
      heroGreeting: "Round-trip greeting",
      heroDesc: "Round-trip desc",
      heroText: "Round-trip text",
      worksWithTitle: "Round-trip title",
      worksWith: "Round-trip worksWith",
    };
    const saveResult = await saveAboutCms(payload);
    expect(saveResult.ok).toBe(true);

    const row = await getAboutCms();
    expect(row).toBeDefined();
    expect(row!.heroGreeting).toBe(payload.heroGreeting);
    expect(row!.heroDesc).toBe(payload.heroDesc);
    expect(row!.worksWith).toBe(payload.worksWith);
  });

  it("saved globalCms payload is returned unchanged by getGlobalCms", async () => {
    const payload: TGlobalPayload = {
      ...VALID_GLOBAL,
      linkedinUrl: "https://linkedin.com/in/roundtrip",
      aboutNavVisible: false,
      projectUrlAccessible: false,
    };
    const saveResult = await saveGlobalCms(payload);
    expect(saveResult.ok).toBe(true);

    const row = await getGlobalCms();
    expect(row).toBeDefined();
    expect(row!.linkedinUrl).toBe(payload.linkedinUrl);
    expect(row!.aboutNavVisible).toBe(false);
    expect(row!.projectUrlAccessible).toBe(false);
  });

  it("saved homeCms payload is returned unchanged by getHomeCms", async () => {
    const payload: THomePayload = {
      ...VALID_HOME,
      heroTitle: "Round-trip home hero",
      featureCards: [{ title: "Round-trip feature", body: "Round-trip body" }, CARD, CARD, CARD],
    };
    const saveResult = await saveHomeCms(payload);
    expect(saveResult.ok).toBe(true);

    const { homeHero: hh, cmsFeatures: cf } = await getHomeCms();
    expect(hh).toBeDefined();
    expect(cf).toBeDefined();
    expect(hh!.heroTitle).toBe(payload.heroTitle);
    expect(cf!.feature1Title).toBe(payload.featureCards[0].title);
  });

  it("saved projectCms payload is returned unchanged by getProjectCms", async () => {
    const payload: TProjectPayload = {
      ...VALID_PROJECT,
      heroTitle: "Round-trip project hero",
      archCards: [
        { title: "Round-trip arch", body: "Round-trip arch body" },
        ARCH,
        ARCH,
        ARCH,
        ARCH,
        ARCH,
      ],
    };
    const saveResult = await saveProjectCms(payload);
    expect(saveResult.ok).toBe(true);

    const row = await getProjectCms();
    expect(row).toBeDefined();
    expect(row!.heroTitle).toBe(payload.heroTitle);
    expect(row!.arch1Title).toBe(payload.archCards[0].title);
  });
});
