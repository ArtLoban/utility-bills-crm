import type { Metadata } from "next";

import { getAboutCms, getGlobalCms, getHomeCms, getProjectCms } from "@/features/landing-cms";
import type {
  TAboutPayload,
  TGlobalPayload,
  THomePayload,
  TProjectPayload,
} from "@/features/landing-cms";
import type {
  TAboutHero,
  TCmsFeatures,
  TCmsLinks,
  THomeHero,
  TProjectHero,
} from "@/lib/db/schema/cms";

import { LandingCmsClient } from "./_components/landing-cms-client";
import {
  INITIAL_ABOUT,
  INITIAL_GLOBAL,
  INITIAL_HOME,
  INITIAL_PROJECT,
} from "./_components/landing-cms-client/constants";

export const metadata: Metadata = {
  title: "Landing content — Admin",
  description: "Edit the public landing pages.",
};

// ---------------------------------------------------------------------------
// Mapper helpers — reconstruct form payload shapes from flat DB rows.
// Falls back to INITIAL_* when a row is missing (seed guarantees rows exist;
// undefined signals a transiently empty table — defensive, not expected).
// ---------------------------------------------------------------------------

const mapHomeContent = (
  hero: THomeHero | undefined,
  features: TCmsFeatures | undefined,
): THomePayload => {
  if (!hero || !features) return INITIAL_HOME;
  return {
    heroTitle: hero.heroTitle,
    heroDesc: hero.heroDesc,
    dashboardCaption: hero.dashboardCaption,
    propertyCaption: hero.propertyCaption,
    techHighlights: hero.techHighlights,
    featureCards: [
      { title: features.feature1Title, body: features.feature1Body },
      { title: features.feature2Title, body: features.feature2Body },
      { title: features.feature3Title, body: features.feature3Body },
      { title: features.feature4Title, body: features.feature4Body },
    ],
  };
};

const mapAboutContent = (row: TAboutHero | undefined): TAboutPayload => {
  if (!row) return INITIAL_ABOUT;
  return {
    heroGreeting: row.heroGreeting,
    heroDesc: row.heroDesc,
    heroText: row.heroText,
    worksWithTitle: row.worksWithTitle,
    worksWith: row.worksWith,
  };
};

const mapProjectContent = (row: TProjectHero | undefined): TProjectPayload => {
  if (!row) return INITIAL_PROJECT;
  return {
    heroTitle: row.heroTitle,
    heroDesc: row.heroDesc,
    status: row.status,
    archCards: [
      { title: row.arch1Title, body: row.arch1Body },
      { title: row.arch2Title, body: row.arch2Body },
      { title: row.arch3Title, body: row.arch3Body },
      { title: row.arch4Title, body: row.arch4Body },
      { title: row.arch5Title, body: row.arch5Body },
      { title: row.arch6Title, body: row.arch6Body },
    ],
  };
};

const mapGlobalContent = (row: TCmsLinks | undefined): TGlobalPayload => {
  if (!row) return INITIAL_GLOBAL;
  return {
    linkedinUrl: row.linkedinUrl,
    githubUrl: row.githubUrl,
    projectRepoUrl: row.projectRepoUrl,
    aboutNavVisible: row.aboutNavVisible,
    aboutUrlAccessible: row.aboutUrlAccessible,
    projectNavVisible: row.projectNavVisible,
    projectUrlAccessible: row.projectUrlAccessible,
  };
};

// ---------------------------------------------------------------------------

export default async function AdminLandingPage() {
  const [homeData, aboutData, projectData, globalData] = await Promise.all([
    getHomeCms(),
    getAboutCms(),
    getProjectCms(),
    getGlobalCms(),
  ]);

  const initialData = {
    home: mapHomeContent(homeData.homeHero, homeData.cmsFeatures),
    about: mapAboutContent(aboutData),
    project: mapProjectContent(projectData),
    global: mapGlobalContent(globalData),
  };

  return <LandingCmsClient initialData={initialData} />;
}
