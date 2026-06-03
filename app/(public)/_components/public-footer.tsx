import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";

export const PublicFooter = async () => {
  const t = await getTranslations("landing");

  return (
    <footer className="bg-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="flex flex-wrap items-center justify-center gap-7 py-9">
          <Link
            href={ROUTES.about}
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
          >
            {t("footer.aboutDeveloper")}
          </Link>
          <div className="h-3.5 w-px bg-zinc-700" />
          <Link
            href={ROUTES.project}
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
          >
            {t("footer.architectureCode")}
          </Link>
          <div className="h-3.5 w-px bg-zinc-700" />
          <span className="text-sm text-zinc-500">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </span>
        </div>
      </div>
    </footer>
  );
};
