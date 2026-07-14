export const CMS_CACHE_TAGS = {
  HOME: "cms-home",
  ABOUT: "cms-about",
  PROJECT: "cms-project",
  LINKS: "cms-links",
} as const;

export type TCmsCacheTag = (typeof CMS_CACHE_TAGS)[keyof typeof CMS_CACHE_TAGS];

export const CMS_CACHE_VERSION =
  process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local";
