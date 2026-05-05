import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

type TProps = {
  children: ReactNode;
};

export const AuthCard = async ({ children }: TProps) => {
  const t = await getTranslations("auth");

  return (
    <div className="w-full max-w-[400px]">
      <div className="rounded-[10px] border border-zinc-200 bg-white px-7 py-8 shadow-[0_1px_3px_rgba(24,24,27,0.07),0_1px_2px_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        {children}
      </div>
      <p className="mt-5 text-center text-xs leading-relaxed text-zinc-500">
        {t("legal.prefix")}{" "}
        <a href="#" className="underline underline-offset-2">
          {t("legal.terms")}
        </a>{" "}
        {t("legal.and")}{" "}
        <a href="#" className="underline underline-offset-2">
          {t("legal.privacy")}
        </a>
        .
      </p>
    </div>
  );
};
