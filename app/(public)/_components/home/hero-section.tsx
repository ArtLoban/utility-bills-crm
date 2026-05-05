import { getTranslations } from "next-intl/server";

export const HeroSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="relative overflow-hidden py-24">
      {/* Radial glow — decorative, pointer-events disabled */}
      <div
        className="pointer-events-none absolute -top-[60px] right-[-80px] h-[500px] w-[600px]"
        style={{
          background: "radial-gradient(ellipse at 70% 30%, var(--hero-glow) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6">
        {/* Eyebrow badge */}
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 dark:border-violet-800/50 dark:bg-violet-950/40">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="0.5" y="0.5" width="4" height="4" rx="0.75" fill="#7c3aed" />
            <rect x="7.5" y="0.5" width="4" height="4" rx="0.75" fill="#7c3aed" opacity="0.5" />
            <rect x="0.5" y="7.5" width="4" height="4" rx="0.75" fill="#7c3aed" opacity="0.5" />
            <rect x="7.5" y="7.5" width="4" height="4" rx="0.75" fill="#7c3aed" opacity="0.3" />
          </svg>
          <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
            {t("hero.eyebrow")}
          </span>
        </div>

        <h1 className="mb-5 max-w-[720px] text-[clamp(36px,5vw,56px)] leading-[1.12] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-50">
          {t("hero.h1")}
        </h1>

        <p className="max-w-[580px] text-lg leading-[1.65] text-zinc-500">{t("hero.subtitle1")}</p>

        <p className="text-md mt-4 max-w-[580px] leading-[1.65] text-zinc-500">
          {t("hero.subtitle2")}
        </p>
      </div>
    </section>
  );
};
