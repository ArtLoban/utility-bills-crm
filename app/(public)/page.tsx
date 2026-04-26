import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function LandingPage() {
  const t = await getTranslations();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t("common.appName")}
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400">{t("landing.comingSoon")}</p>
      <div className="flex gap-4 text-sm">
        <Link
          href="/login"
          className="text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          {t("landing.login")}
        </Link>
        <Link
          href="/dashboard"
          className="text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          {t("landing.dashboard")}
        </Link>
      </div>
    </div>
  );
}
