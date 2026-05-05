import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

const strongTag = (chunks: ReactNode) => (
  <strong className="font-semibold text-zinc-900 dark:text-zinc-200">{chunks}</strong>
);

export const StatusSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-[640px]">
          <h2 className="mb-6 text-[clamp(22px,2.5vw,30px)] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
            {t("project.status.sectionTitle")}
          </h2>
          <div className="flex flex-col gap-5">
            <p className="text-md leading-[1.75] text-zinc-500">
              {t.rich("project.status.p1", { strong: strongTag })}
            </p>
            <p className="text-md leading-[1.75] text-zinc-500">
              {t.rich("project.status.p2", { strong: strongTag })}
            </p>
            <p className="text-md leading-[1.75] text-zinc-500">
              {t.rich("project.status.p3", { strong: strongTag })}
            </p>
            <p className="text-md leading-[1.75] text-zinc-500">
              {t.rich("project.status.p4", { strong: strongTag })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
