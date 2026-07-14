"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db/client";
import { aboutHero, cmsFeatures, cmsLinks, homeHero, projectHero } from "@/lib/db/schema/cms";
import { requireAdmin } from "@/lib/auth/guards";
import { appError, err, ok } from "@/lib/errors";
import type { Result, TAppError } from "@/lib/errors";
import { unwrapOrThrow } from "@/lib/unwrap-or-throw";
import { ROUTES } from "@/lib/routes";

import { aboutSchema, globalSchema, homeSchema, projectSchema } from "./schema";
import type { TAboutPayload, TGlobalPayload, THomePayload, TProjectPayload } from "./types";

// ---------------------------------------------------------------------------
// Admin guard
// Layer 1: admin layout guard. Layer 2: page-level guard. Layer 3: here.
// ---------------------------------------------------------------------------

const assertAdmin = async (): Promise<void> => {
  await unwrapOrThrow(await requireAdmin());
};

// ---------------------------------------------------------------------------
// Save actions — one per CMS tab (#98: per-tab save, not one global save)
// ---------------------------------------------------------------------------

// Home tab writes to home_hero AND features — both in one transaction so a
// partial Home save can never happen.
export const saveHomeCms = async (data: THomePayload): Promise<Result<void, TAppError>> => {
  await assertAdmin();

  const parsed = homeSchema.safeParse(data);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "landingCms.errors.generic"));
  }

  const { heroTitle, heroDesc, dashboardCaption, propertyCaption, techHighlights, featureCards } =
    parsed.data;

  const heroValues = { heroTitle, heroDesc, dashboardCaption, propertyCaption, techHighlights };
  const featuresValues = {
    feature1Title: featureCards[0].title,
    feature1Body: featureCards[0].body,
    feature2Title: featureCards[1].title,
    feature2Body: featureCards[1].body,
    feature3Title: featureCards[2].title,
    feature3Body: featureCards[2].body,
    feature4Title: featureCards[3].title,
    feature4Body: featureCards[3].body,
  };

  await db.transaction(async (tx) => {
    await tx
      .insert(homeHero)
      .values(heroValues)
      .onConflictDoUpdate({ target: homeHero.oneRow, set: heroValues });
    await tx
      .insert(cmsFeatures)
      .values(featuresValues)
      .onConflictDoUpdate({ target: cmsFeatures.oneRow, set: featuresValues });
  });

  revalidatePath(ROUTES.admin.landing);
  revalidatePath(ROUTES.home);
  return ok(undefined);
};

export const saveAboutCms = async (data: TAboutPayload): Promise<Result<void, TAppError>> => {
  await assertAdmin();

  const parsed = aboutSchema.safeParse(data);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "landingCms.errors.generic"));
  }

  const values = parsed.data;
  await db
    .insert(aboutHero)
    .values(values)
    .onConflictDoUpdate({ target: aboutHero.oneRow, set: values });

  revalidatePath(ROUTES.admin.landing);
  revalidatePath(ROUTES.about);
  return ok(undefined);
};

export const saveProjectCms = async (data: TProjectPayload): Promise<Result<void, TAppError>> => {
  await assertAdmin();

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "landingCms.errors.generic"));
  }

  const { heroTitle, heroDesc, archCards, status } = parsed.data;
  const values = {
    heroTitle,
    heroDesc,
    status,
    arch1Title: archCards[0].title,
    arch1Body: archCards[0].body,
    arch2Title: archCards[1].title,
    arch2Body: archCards[1].body,
    arch3Title: archCards[2].title,
    arch3Body: archCards[2].body,
    arch4Title: archCards[3].title,
    arch4Body: archCards[3].body,
    arch5Title: archCards[4].title,
    arch5Body: archCards[4].body,
    arch6Title: archCards[5].title,
    arch6Body: archCards[5].body,
  };

  await db
    .insert(projectHero)
    .values(values)
    .onConflictDoUpdate({ target: projectHero.oneRow, set: values });

  revalidatePath(ROUTES.admin.landing);
  revalidatePath(ROUTES.project);
  return ok(undefined);
};

// Global tab: links affect navigation and URLs on all public pages.
export const saveGlobalCms = async (data: TGlobalPayload): Promise<Result<void, TAppError>> => {
  await assertAdmin();

  const parsed = globalSchema.safeParse(data);
  if (!parsed.success) {
    return err(appError.validation(parsed.error.issues[0]?.message ?? "landingCms.errors.generic"));
  }

  const values = parsed.data;
  await db
    .insert(cmsLinks)
    .values(values)
    .onConflictDoUpdate({ target: cmsLinks.oneRow, set: values });

  revalidatePath(ROUTES.admin.landing);
  revalidatePath(ROUTES.home);
  revalidatePath(ROUTES.about);
  revalidatePath(ROUTES.project);
  return ok(undefined);
};
