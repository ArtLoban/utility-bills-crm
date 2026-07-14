import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";
import { Logo } from "@/components/logo";
import { AuthCard } from "@/app/(auth)/_components/auth-card";

export default async function AuthErrorPage() {
  const t = await getTranslations("auth");

  return (
    <AuthCard>
      <div className="mb-7 flex justify-center">
        <Logo href={ROUTES.home} />
      </div>

      <div className="mb-5 flex justify-center">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50 dark:border-zinc-700 dark:bg-zinc-800">
          <AlertCircle className="size-8 text-red-600 dark:text-red-400" strokeWidth={1.5} />
        </div>
      </div>

      <h1 className="mb-3 text-center text-2xl font-bold tracking-[-0.4px]">{t("error.title")}</h1>
      <p className="mb-7 text-center text-sm leading-[1.55] text-zinc-500">
        {t("error.description")}
      </p>

      <Link
        href={ROUTES.login}
        className="mb-4 flex h-10 w-full items-center justify-center rounded-md bg-violet-700 text-sm font-semibold text-white transition-colors hover:bg-violet-800"
      >
        {t("error.tryAgain")}
      </Link>

      <Link
        href={ROUTES.home}
        className="flex items-center justify-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        <ArrowLeft className="size-3" strokeWidth={2} />
        {t("backToHome")}
      </Link>
    </AuthCard>
  );
}
