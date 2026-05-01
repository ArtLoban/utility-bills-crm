import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";

export default async function AboutPage() {
  const t = await getTranslations("landing");

  return (
    <>
      {/* § 1 Hero */}
      <section className="py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="max-w-[640px]">
            <h1 className="mb-5 text-[clamp(34px,4.5vw,52px)] leading-[1.12] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-zinc-50">
              {t("about.hero.h1")}
            </h1>
            <p className="mb-1.5 text-[18px] leading-relaxed text-zinc-900 dark:text-zinc-50">
              {t("about.hero.role")}
            </p>
            <p className="text-[16px] text-zinc-500">{t("about.hero.location")}</p>
          </div>
        </div>
      </section>

      {/* § 2 What I work with */}
      <section className="bg-zinc-100/45 py-24 dark:bg-zinc-900/80">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="flex max-w-[640px] flex-col gap-5">
            <p className="text-[16px] leading-[1.75] text-zinc-500">{t("about.prose.p1")}</p>
            <p className="text-[16px] leading-[1.75] text-zinc-500">{t("about.prose.p2")}</p>
            <p className="text-[16px] leading-[1.75] text-zinc-500">{t("about.prose.p3")}</p>
          </div>
        </div>
      </section>

      {/* § 3 See more */}
      <section className="py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="max-w-[640px]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[16px] font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
                >
                  LinkedIn <ArrowRight className="size-3.5" strokeWidth={2} />
                </a>
                <span className="text-[14px] text-zinc-500">
                  <span className="text-zinc-300 dark:text-zinc-600">—</span>{" "}
                  {t("about.links.linkedinCaption")}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[16px] font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
                >
                  GitHub <ArrowRight className="size-3.5" strokeWidth={2} />
                </a>
                <span className="text-[14px] text-zinc-500">
                  <span className="text-zinc-300 dark:text-zinc-600">—</span>{" "}
                  {t("about.links.githubCaption")}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <Link
                  href={ROUTES.project}
                  className="inline-flex items-center gap-1.5 text-[16px] font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
                >
                  {t("about.links.projectLabel")}{" "}
                  <ArrowRight className="size-3.5" strokeWidth={2} />
                </Link>
                <span className="text-[14px] text-zinc-500">
                  <span className="text-zinc-300 dark:text-zinc-600">—</span>{" "}
                  {t("about.links.projectCaption")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
