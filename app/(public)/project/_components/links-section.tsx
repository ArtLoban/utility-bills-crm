import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";

export const LinksSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="bg-zinc-100/45 py-24 dark:bg-zinc-900/80">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="flex max-w-[640px] flex-col gap-6">
          <div className="flex flex-col gap-[3px]">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-base font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
            >
              {t("project.links.githubLabel")} <ArrowRight className="size-3.5" strokeWidth={2} />
            </a>
            <span className="text-sm text-zinc-500">
              <span className="text-zinc-300 dark:text-zinc-600">—</span>{" "}
              {t("project.links.githubCaption")}
            </span>
          </div>

          <div className="flex flex-col gap-[3px]">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-base font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
            >
              {t("project.links.demoLabel")} <ArrowRight className="size-3.5" strokeWidth={2} />
            </a>
            <span className="text-sm text-zinc-500">
              <span className="text-zinc-300 dark:text-zinc-600">—</span>{" "}
              {t("project.links.demoCaption")}
            </span>
          </div>

          <div className="flex flex-col gap-[3px]">
            <Link
              href={ROUTES.about}
              className="inline-flex items-center gap-1.5 text-base font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
            >
              {t("project.links.aboutLabel")} <ArrowRight className="size-3.5" strokeWidth={2} />
            </Link>
            <span className="text-sm text-zinc-500">
              <span className="text-zinc-300 dark:text-zinc-600">—</span>{" "}
              {t("project.links.aboutCaption")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
