import { cache } from "react";
import { unstable_cache } from "next/cache";

import { db } from "@/lib/db/client";
import { aboutHero, cmsFeatures, cmsLinks, homeHero, projectHero } from "@/lib/db/schema/cms";
import type {
  TAboutHero,
  TCmsFeatures,
  TCmsLinks,
  THomeHero,
  TProjectHero,
} from "@/lib/db/schema/cms";
import { requireAdmin } from "@/lib/auth/guards";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";

import { CMS_CACHE_TAGS, CMS_CACHE_VERSION, type TCmsCacheTag } from "./cache-tags";

// ---------------------------------------------------------------------------
// Admin guard
// Layer 1: admin layout guard. Layer 2: page-level guard. Layer 3: here.
// ---------------------------------------------------------------------------

const assertAdmin = async (): Promise<void> => {
  await unwrapOrThrow(await requireAdmin());
};

// ---------------------------------------------------------------------------
// Private query helpers — no auth guard.
// Factored so the future public landing read path can reuse these without the
// admin guard, without duplicating the SQL.
// ---------------------------------------------------------------------------

const _queryHomeHero = async (): Promise<THomeHero | undefined> => {
  const rows = await db.select().from(homeHero).limit(1);
  return rows[0];
};

const _queryCmsFeatures = async (): Promise<TCmsFeatures | undefined> => {
  const rows = await db.select().from(cmsFeatures).limit(1);
  return rows[0];
};

const _queryAboutHero = async (): Promise<TAboutHero | undefined> => {
  const rows = await db.select().from(aboutHero).limit(1);
  return rows[0];
};

const _queryProjectHero = async (): Promise<TProjectHero | undefined> => {
  const rows = await db.select().from(projectHero).limit(1);
  return rows[0];
};

const _queryCmsLinks = async (): Promise<TCmsLinks | undefined> => {
  const rows = await db.select().from(cmsLinks).limit(1);
  return rows[0];
};

// ---------------------------------------------------------------------------
// Exported admin-guarded reads — one per CMS tab.
// The seed guarantees a row exists; undefined signals a transiently empty table
// (treated defensively — callers use INITIAL_* fallbacks rather than throwing).
// ---------------------------------------------------------------------------

// Home tab spans both home_hero and features tables — both are needed at once.
export const getHomeCms = async (): Promise<{
  homeHero: THomeHero | undefined;
  cmsFeatures: TCmsFeatures | undefined;
}> => {
  await assertAdmin();
  const [homeHeroRow, cmsFeaturesRow] = await Promise.all([_queryHomeHero(), _queryCmsFeatures()]);
  return { homeHero: homeHeroRow, cmsFeatures: cmsFeaturesRow };
};

export const getAboutCms = async (): Promise<TAboutHero | undefined> => {
  await assertAdmin();
  return _queryAboutHero();
};

export const getProjectCms = async (): Promise<TProjectHero | undefined> => {
  await assertAdmin();
  return _queryProjectHero();
};

export const getGlobalCms = async (): Promise<TCmsLinks | undefined> => {
  await assertAdmin();
  return _queryCmsLinks();
};

// ---------------------------------------------------------------------------
// Public unguarded reads — for the public landing pages. No assertAdmin().
// Callers treat undefined as "table transiently empty" — use ?? fallback,
// never throw.
// ---------------------------------------------------------------------------

const publicRead = <T>(read: () => Promise<T>, tag: TCmsCacheTag): (() => Promise<T>) =>
  cache(unstable_cache(read, [CMS_CACHE_VERSION, tag], { tags: [tag], revalidate: false }));

export const getPublicHome = publicRead(async () => {
  const [homeHeroRow, featuresRow] = await Promise.all([_queryHomeHero(), _queryCmsFeatures()]);
  return { homeHero: homeHeroRow, features: featuresRow };
}, CMS_CACHE_TAGS.HOME);

export const getPublicAbout = publicRead(_queryAboutHero, CMS_CACHE_TAGS.ABOUT);

export const getPublicProject = publicRead(_queryProjectHero, CMS_CACHE_TAGS.PROJECT);

export const getPublicLinks = publicRead(_queryCmsLinks, CMS_CACHE_TAGS.LINKS);
