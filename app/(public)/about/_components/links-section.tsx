import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";

export const LinksSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-[640px]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-base font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
              >
                LinkedIn <ArrowRight className="size-3.5" strokeWidth={2} />
              </a>
              <span className="text-sm text-zinc-500">
                <span className="text-zinc-300 dark:text-zinc-600">—</span>{" "}
                {t("about.links.linkedinCaption")}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-base font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
              >
                GitHub <ArrowRight className="size-3.5" strokeWidth={2} />
              </a>
              <span className="text-sm text-zinc-500">
                <span className="text-zinc-300 dark:text-zinc-600">—</span>{" "}
                {t("about.links.githubCaption")}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Link
                href={ROUTES.project}
                className="inline-flex items-center gap-1.5 text-base font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
              >
                {t("about.links.projectLabel")} <ArrowRight className="size-3.5" strokeWidth={2} />
              </Link>
              <span className="text-sm text-zinc-500">
                <span className="text-zinc-300 dark:text-zinc-600">—</span>{" "}
                {t("about.links.projectCaption")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
