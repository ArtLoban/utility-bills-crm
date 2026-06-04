import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";

type TProps = {
  linkedinUrl: string;
  githubUrl: string;
};

export const LinksSection = async ({ linkedinUrl, githubUrl }: TProps) => {
  const t = await getTranslations("landing");

  return (
    <section className="border-border border-t py-14 md:py-[88px]">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <div className="flex max-w-[640px] flex-col gap-[26px]">
          <div className="flex flex-col gap-1">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-[7px] text-[17px] font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
            >
              LinkedIn <ArrowRight className="size-3.5" strokeWidth={2} />
            </a>
            <span className="text-sm text-zinc-500">
              <span className="text-zinc-300 dark:text-zinc-700">—</span>{" "}
              {t("about.links.linkedinCaption")}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-[7px] text-[17px] font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
            >
              GitHub <ArrowRight className="size-3.5" strokeWidth={2} />
            </a>
            <span className="text-sm text-zinc-500">
              <span className="text-zinc-300 dark:text-zinc-700">—</span>{" "}
              {t("about.links.githubCaption")}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <Link
              href={ROUTES.project}
              className="inline-flex w-fit items-center gap-[7px] text-[17px] font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
            >
              {t("about.links.projectLabel")} <ArrowRight className="size-3.5" strokeWidth={2} />
            </Link>
            <span className="text-sm text-zinc-500">
              <span className="text-zinc-300 dark:text-zinc-700">—</span>{" "}
              {t("about.links.projectCaption")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
