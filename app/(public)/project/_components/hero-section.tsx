import { getTranslations } from "next-intl/server";

const GithubIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const HeroSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <h1 className="mb-5 max-w-[680px] text-[clamp(32px,4.5vw,52px)] leading-[1.12] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-50">
          {t("project.hero.h1")}
        </h1>
        <p className="mb-8 max-w-[560px] text-lg leading-[1.7] text-zinc-500">
          {t("project.hero.subtitle")}
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-[18px] py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          <GithubIcon />
          {t("project.hero.githubLink")}
        </a>
      </div>
    </section>
  );
};
