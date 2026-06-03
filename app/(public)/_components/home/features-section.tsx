import { getTranslations } from "next-intl/server";
import { Users, History, Wallet, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    badgeBg: "bg-violet-100 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    titleKey: "features.propertiesTitle",
    bodyKey: "features.propertiesBody",
  },
  {
    icon: History,
    badgeBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleKey: "features.tariffsTitle",
    bodyKey: "features.tariffsBody",
  },
  {
    icon: Wallet,
    badgeBg: "bg-teal-100 dark:bg-teal-900/30",
    iconColor: "text-teal-600 dark:text-teal-400",
    titleKey: "features.walletTitle",
    bodyKey: "features.walletBody",
  },
  {
    icon: TrendingUp,
    badgeBg: "bg-sky-100 dark:bg-sky-900/30",
    iconColor: "text-sky-600 dark:text-sky-400",
    titleKey: "features.trendsTitle",
    bodyKey: "features.trendsBody",
  },
] as const;

export const FeaturesSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="relative overflow-hidden py-24">
      {/* Radial glow — bottom-left bloom, bleeds slightly below into the dark mockup section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          bottom: "-180px",
          left: "-120px",
          width: "720px",
          height: "580px",
          background: "radial-gradient(at 30% 70%, var(--section-glow) 0%, transparent 62%)",
        }}
      />
      <div className="relative mx-auto max-w-[1100px] px-6">
        <div className="mb-10">
          <p className="mb-2.5 text-xs font-medium tracking-[0.08em] text-violet-600 uppercase dark:text-violet-400">
            {t("features.sectionLabel")}
          </p>
          <h2 className="text-[clamp(26px,3vw,36px)] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
            {t("features.sectionTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, badgeBg, iconColor, titleKey, bodyKey }) => (
            <div
              key={titleKey}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
            >
              <div
                className={`mb-5 inline-flex size-11 items-center justify-center rounded-xl ${badgeBg}`}
              >
                <Icon className={`size-5 ${iconColor}`} strokeWidth={1.75} />
              </div>
              <p className="text-md mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                {t(titleKey)}
              </p>
              <p className="text-sm leading-[1.65] text-zinc-500">{t(bodyKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
