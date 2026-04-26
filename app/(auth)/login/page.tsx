import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const googleSignIn = async () => {
  "use server";
  await signIn("google", { redirectTo: "/dashboard" });
};

export default async function LoginPage() {
  const t = await getTranslations();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t("common.appName")}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("auth.subtitle")}</p>
      </div>
      <form action={googleSignIn}>
        <Button type="submit">{t("auth.signInWithGoogle")}</Button>
      </form>
      <Link
        href="/"
        className="text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
      >
        {t("auth.backToHome")}
      </Link>
    </div>
  );
}
