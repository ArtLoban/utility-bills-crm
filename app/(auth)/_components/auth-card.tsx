import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

type TProps = {
  children: ReactNode;
};

export const AuthCard = async ({ children }: TProps) => {
  const t = await getTranslations("auth");

  return (
    <div className="w-full max-w-[400px]">
      <div className="rounded-[10px] border border-zinc-200 bg-white px-4 py-8 shadow-[0_1px_3px_rgba(24,24,27,0.07),0_1px_2px_rgba(24,24,27,0.05)] sm:px-7 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        {children}
      </div>
      <p className="mt-5 text-center text-xs leading-relaxed text-zinc-500">
        {t.rich("legal.agreement", {
          terms: (chunks) => (
            <a href="#" className="underline underline-offset-2">
              {chunks}
            </a>
          ),
          privacy: (chunks) => (
            <a href="#" className="underline underline-offset-2">
              {chunks}
            </a>
          ),
        })}
      </p>
    </div>
  );
};
