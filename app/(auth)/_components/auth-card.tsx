import type { ReactNode } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";

type TProps = {
  children: ReactNode;
};

export const AuthCard = async ({ children }: TProps) => {
  const t = await getTranslations("auth");

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-lg border border-zinc-200 bg-white px-4 py-8 shadow-sm sm:px-7 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        {children}
      </div>
      <p className="mt-5 text-center text-xs leading-relaxed text-zinc-500">
        {t.rich("legal.agreement", {
          terms: (chunks) => (
            <Link href={ROUTES.terms} className="underline underline-offset-2">
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link href={ROUTES.privacy} className="underline underline-offset-2">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  );
};
