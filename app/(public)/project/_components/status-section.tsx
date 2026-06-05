import { getTranslations } from "next-intl/server";
import { CmsText } from "@/components/cms-text";

type TProps = {
  status: string;
};

export const StatusSection = async ({ status }: TProps) => {
  const t = await getTranslations("landing");
  const paragraphs = status.split(/\n\n+/).filter(Boolean);

  return (
    <section className="py-[56px] md:py-[92px]">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <div className="max-w-[640px]">
          <h2 className="mb-8 text-[clamp(28px,3vw,38px)] font-semibold tracking-[-0.025em] text-zinc-900 dark:text-zinc-50">
            {t("project.status.sectionTitle")}
          </h2>
          <div className="flex flex-col gap-5">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-md leading-[1.75] text-zinc-500">
                <CmsText value={para} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
