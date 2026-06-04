import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";

type TProps = {
  projectRepoUrl: string;
  liveDemoUrl: string | null | undefined;
};

export const LinksSection = async ({ projectRepoUrl, liveDemoUrl }: TProps) => {
  const t = await getTranslations("landing");
  const demoVisible = !!liveDemoUrl?.trim();

  return (
    <section className="border-border border-t py-[56px] md:py-[92px]">
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a
            href={projectRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-150 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(24,24,27,0.12),0_3px_8px_rgba(24,24,27,0.06)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:translate-y-0 dark:hover:border-zinc-700 dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
          >
            <span className="inline-flex items-center gap-1.5 text-base font-medium text-violet-600 dark:text-violet-400">
              {t("project.links.githubLabel")}
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </span>
            <span className="text-sm leading-[1.55] text-zinc-500">
              {t("project.links.githubCaption")}
            </span>
          </a>

          {demoVisible && (
            <a
              href={liveDemoUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-150 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(24,24,27,0.12),0_3px_8px_rgba(24,24,27,0.06)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:translate-y-0 dark:hover:border-zinc-700 dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
            >
              <span className="inline-flex items-center gap-1.5 text-base font-medium text-violet-600 dark:text-violet-400">
                {t("project.links.demoLabel")}
                <ArrowRight className="size-3.5" strokeWidth={2} />
              </span>
              <span className="text-sm leading-[1.55] text-zinc-500">
                {t("project.links.demoCaption")}
              </span>
            </a>
          )}

          <Link
            href={ROUTES.about}
            className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-150 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(24,24,27,0.12),0_3px_8px_rgba(24,24,27,0.06)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:translate-y-0 dark:hover:border-zinc-700 dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
          >
            <span className="inline-flex items-center gap-1.5 text-base font-medium text-violet-600 dark:text-violet-400">
              {t("project.links.aboutLabel")}
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </span>
            <span className="text-sm leading-[1.55] text-zinc-500">
              {t("project.links.aboutCaption")}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
