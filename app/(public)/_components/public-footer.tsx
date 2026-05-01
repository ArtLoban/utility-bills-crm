import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";

export const PublicFooter = async () => {
  const t = await getTranslations("landing");

  return (
    <footer className="bg-zinc-100/45 dark:bg-zinc-900/80">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="flex flex-wrap items-center justify-center gap-7 py-9">
          <Link
            href={ROUTES.about}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            {t("footer.aboutDeveloper")}
          </Link>
          <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800" />
          <Link
            href={ROUTES.project}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            {t("footer.architectureCode")}
          </Link>
          <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-[13px] text-zinc-400 dark:text-zinc-700">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </span>
        </div>
      </div>
    </footer>
  );
};
