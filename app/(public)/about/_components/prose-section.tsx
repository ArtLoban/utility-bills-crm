import { getTranslations } from "next-intl/server";

export const ProseSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="bg-zinc-100/45 py-24 dark:bg-zinc-900/80">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="flex max-w-[640px] flex-col gap-5">
          <p className="text-[16px] leading-[1.75] text-zinc-500">{t("about.prose.p1")}</p>
          <p className="text-[16px] leading-[1.75] text-zinc-500">{t("about.prose.p2")}</p>
          <p className="text-[16px] leading-[1.75] text-zinc-500">{t("about.prose.p3")}</p>
        </div>
      </div>
    </section>
  );
};
