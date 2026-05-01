import { getTranslations } from "next-intl/server";
import { Users, History, Wallet, TrendingUp } from "lucide-react";

const FEATURES = [
  { icon: Users, titleKey: "features.propertiesTitle", bodyKey: "features.propertiesBody" },
  { icon: History, titleKey: "features.tariffsTitle", bodyKey: "features.tariffsBody" },
  { icon: Wallet, titleKey: "features.walletTitle", bodyKey: "features.walletBody" },
  { icon: TrendingUp, titleKey: "features.trendsTitle", bodyKey: "features.trendsBody" },
] as const;

export const FeaturesSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-10">
          <p className="mb-2.5 text-[12px] font-medium tracking-[0.08em] text-violet-600 uppercase dark:text-violet-400">
            {t("features.sectionLabel")}
          </p>
          <h2 className="text-[clamp(26px,3vw,36px)] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
            {t("features.sectionTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, titleKey, bodyKey }) => (
            <div
              key={titleKey}
              className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
            >
              <Icon
                className="mb-3.5 size-8 text-violet-600 dark:text-violet-400"
                strokeWidth={1.75}
              />
              <p className="mb-2 text-[15px] font-semibold text-zinc-900 dark:text-zinc-50">
                {t(titleKey)}
              </p>
              <p className="text-[14px] leading-[1.65] text-zinc-500">{t(bodyKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
