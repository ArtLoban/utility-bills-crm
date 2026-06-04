import { getTranslations } from "next-intl/server";

export const HeroSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="relative overflow-hidden py-14 md:pt-[104px] md:pb-[96px]">
      {/* Glow 1 — top-right violet bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: "-160px",
          right: "-120px",
          width: "760px",
          height: "620px",
          background: "radial-gradient(at 70% 30%, var(--hero-glow) 0%, transparent 62%)",
        }}
      />
      {/* Glow 2 — sub-glow over the heading area */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 md:right-[200px]"
        style={{
          top: "40px",
          width: "480px",
          height: "420px",
          background: "radial-gradient(var(--hero-glow-sub) 0%, transparent 66%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-4 md:px-6">
        <div className="max-w-[720px]">
          <h1 className="mb-[22px] text-[clamp(40px,5vw,64px)] leading-[1.06] font-semibold tracking-[-0.035em] text-zinc-900 dark:text-zinc-50">
            {t("about.hero.h1")}
          </h1>
          <p className="mb-2 text-xl leading-[1.5] font-normal text-zinc-900 dark:text-zinc-50">
            {t("about.hero.role")}
          </p>
          <p className="text-[17px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            {t("about.hero.location")}
          </p>
        </div>
      </div>
    </section>
  );
};
