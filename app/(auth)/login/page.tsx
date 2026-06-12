import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { signIn } from "@/lib/auth";
import { LOGIN_REASONS } from "@/lib/auth/constants";
import { ROUTES } from "@/lib/routes";
import { Logo } from "@/components/logo";
import { AuthCard } from "@/app/(auth)/_components/auth-card";
import { GoogleIcon } from "./_components/google-icon";
import { RememberMe } from "./_components/remember-me";
import { SessionExpiredNotice } from "./_components/session-expired-notice";

const googleSignIn = async () => {
  "use server";
  await signIn("google", { redirectTo: ROUTES.dashboard });
};

type TProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function LoginPage({ searchParams }: TProps) {
  const { reason } = await searchParams;
  const t = await getTranslations("auth");

  return (
    <AuthCard>
      <div className="mb-7 flex justify-center">
        <Logo href={ROUTES.home} />
      </div>

      {reason === LOGIN_REASONS.SESSION_EXPIRED && <SessionExpiredNotice />}

      <h1 className="mb-1.5 text-center text-2xl font-bold">{t("login.title")}</h1>
      <p className="mb-7 text-center text-sm text-zinc-500">{t("login.subtitle")}</p>

      <form action={googleSignIn} className="mb-3.5">
        <button
          type="submit"
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-md bg-violet-700 text-sm font-semibold text-white transition-colors hover:bg-violet-800"
        >
          <GoogleIcon />
          {t("login.google")}
        </button>
      </form>

      <RememberMe label={t("login.rememberMe")} />

      <div className="flex items-center gap-2.5">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs font-medium text-zinc-500">{t("login.divider")}</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <Link
        href="/auth/demo"
        className="mt-4 mb-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-zinc-200 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        {t("login.demo")}
        <ArrowRight className="size-3.5" strokeWidth={2} />
      </Link>
      <p className="text-center text-xs text-zinc-500">{t("login.demoHint")}</p>

      <Link
        href={ROUTES.home}
        className="mt-6 flex items-center justify-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        <ArrowLeft className="size-3" strokeWidth={2} />
        {t("backToHome")}
      </Link>
    </AuthCard>
  );
}
