import { describe, expect, it } from "vitest";

import { db } from "@/lib/db/client";
import { aboutHero, cmsFeatures, cmsLinks, homeHero, projectHero } from "@/lib/db/schema/cms";

// ---------------------------------------------------------------------------
// Baseline seed — each singleton table must have exactly one populated row.
// ---------------------------------------------------------------------------

describe("cms seed", () => {
  it("home_hero has exactly one row with non-null heroTitle", async () => {
    const rows = await db.select().from(homeHero);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.heroTitle).toBeTruthy();
  });

  it("features has exactly one row with non-null feature1Title", async () => {
    const rows = await db.select().from(cmsFeatures);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.feature1Title).toBeTruthy();
  });

  it("about_hero has exactly one row with non-null heroGreeting", async () => {
    const rows = await db.select().from(aboutHero);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.heroGreeting).toBeTruthy();
  });

  it("project_hero has exactly one row with non-null heroTitle", async () => {
    const rows = await db.select().from(projectHero);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.heroTitle).toBeTruthy();
  });

  it("links has exactly one row with non-null linkedinUrl", async () => {
    const rows = await db.select().from(cmsLinks);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.linkedinUrl).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Singleton enforcement — inserting a second row must fail.
// ---------------------------------------------------------------------------

describe("cms singleton enforcement", () => {
  it("home_hero rejects a second row", async () => {
    await expect(
      db.insert(homeHero).values({
        heroTitle: "duplicate",
        heroDesc: "duplicate",
        dashboardCaption: "duplicate",
        propertyCaption: "duplicate",
        techHighlights: "duplicate",
      }),
    ).rejects.toThrow();
  });

  it("features rejects a second row", async () => {
    await expect(
      db.insert(cmsFeatures).values({
        feature1Title: "d",
        feature1Body: "d",
        feature2Title: "d",
        feature2Body: "d",
        feature3Title: "d",
        feature3Body: "d",
        feature4Title: "d",
        feature4Body: "d",
      }),
    ).rejects.toThrow();
  });

  it("about_hero rejects a second row", async () => {
    await expect(
      db.insert(aboutHero).values({
        heroGreeting: "duplicate",
        heroDesc: "duplicate",
        heroText: "duplicate",
        worksWithTitle: "duplicate",
        worksWith: "duplicate",
      }),
    ).rejects.toThrow();
  });

  it("project_hero rejects a second row", async () => {
    await expect(
      db.insert(projectHero).values({
        heroTitle: "d",
        heroDesc: "d",
        arch1Title: "d",
        arch1Body: "d",
        arch2Title: "d",
        arch2Body: "d",
        arch3Title: "d",
        arch3Body: "d",
        arch4Title: "d",
        arch4Body: "d",
        arch5Title: "d",
        arch5Body: "d",
        arch6Title: "d",
        arch6Body: "d",
        status: "d",
      }),
    ).rejects.toThrow();
  });

  it("links rejects a second row", async () => {
    await expect(
      db.insert(cmsLinks).values({
        linkedinUrl: "https://example.com",
        githubUrl: "https://example.com",
        projectRepoUrl: "https://example.com",
        liveDemoUrl: "https://example.com",
      }),
    ).rejects.toThrow();
  });
});
