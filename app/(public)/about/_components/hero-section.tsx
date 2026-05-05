import { getTranslations } from "next-intl/server";

export const HeroSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-[640px]">
          <h1 className="mb-5 text-[clamp(34px,4.5vw,52px)] leading-[1.12] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-50">
            {t("about.hero.h1")}
          </h1>
          <p className="mb-1.5 text-lg leading-relaxed text-zinc-900 dark:text-zinc-50">
            {t("about.hero.role")}
          </p>
          <p className="text-base text-zinc-500">{t("about.hero.location")}</p>
        </div>
      </div>
    </section>
  );
};
