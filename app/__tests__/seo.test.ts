import { describe, expect, it, vi } from "vitest";

import sitemapFn from "../sitemap";
import robotsFn from "../robots";

vi.mock("@/features/landing-cms", () => ({
  getPublicLinks: vi.fn(),
}));

import type { getPublicLinks as TGetPublicLinks } from "@/features/landing-cms";
import { getPublicLinks } from "@/features/landing-cms";

type TLinksResult = Awaited<ReturnType<typeof TGetPublicLinks>>;

const mockLinks = (
  overrides: Partial<{ aboutUrlAccessible: boolean; projectUrlAccessible: boolean }> = {},
) => {
  vi.mocked(getPublicLinks).mockResolvedValue({
    aboutUrlAccessible: true,
    projectUrlAccessible: true,
    ...overrides,
  } as unknown as TLinksResult);
};

// ---------------------------------------------------------------------------
// sitemap
// ---------------------------------------------------------------------------

describe("sitemap", () => {
  it("includes / always", async () => {
    mockLinks();
    const entries = await sitemapFn();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("localhost:3000"))).toBe(true);
  });

  it("includes /about when aboutUrlAccessible is true", async () => {
    mockLinks({ aboutUrlAccessible: true });
    const entries = await sitemapFn();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/about"))).toBe(true);
  });

  it("excludes /about when aboutUrlAccessible is false", async () => {
    mockLinks({ aboutUrlAccessible: false });
    const entries = await sitemapFn();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/about"))).toBe(false);
  });

  it("includes /project when projectUrlAccessible is true", async () => {
    mockLinks({ projectUrlAccessible: true });
    const entries = await sitemapFn();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/project"))).toBe(true);
  });

  it("excludes /project when projectUrlAccessible is false", async () => {
    mockLinks({ projectUrlAccessible: false });
    const entries = await sitemapFn();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/project"))).toBe(false);
  });

  it("excludes both conditional pages when both flags are false", async () => {
    mockLinks({ aboutUrlAccessible: false, projectUrlAccessible: false });
    const entries = await sitemapFn();
    expect(entries).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// robots
// ---------------------------------------------------------------------------

describe("robots", () => {
  it("references sitemap.xml", () => {
    const result = robotsFn();
    const sitemap = Array.isArray(result.sitemap) ? result.sitemap[0] : result.sitemap;
    expect(sitemap).toMatch(/sitemap\.xml$/);
  });

  it("does not enumerate private paths in Disallow", () => {
    const result = robotsFn();
    const disallow = Array.isArray(result.rules)
      ? result.rules.flatMap((r) =>
          Array.isArray(r.disallow) ? r.disallow : r.disallow ? [r.disallow] : [],
        )
      : Array.isArray(result.rules.disallow)
        ? result.rules.disallow
        : result.rules.disallow
          ? [result.rules.disallow]
          : [];
    expect(disallow).toHaveLength(0);
  });
});
