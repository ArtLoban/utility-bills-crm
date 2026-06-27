"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/icon-badge";
import { ROUTES } from "@/lib/routes";

type TProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: TProps) {
  const t = useTranslations("fatalError");

  // Report the boundary-caught error to Sentry. The server already captured it
  // via onRequestError; this covers client-side render errors too.
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center md:pb-[80px]">
      <IconBadge icon={TriangleAlert} color="var(--destructive)" size="xl" />

      <h2 className="mt-6 text-xl font-semibold tracking-tight md:text-2xl">{t("title")}</h2>

      <p className="text-muted-foreground mt-2.5 max-w-xs text-sm leading-relaxed md:max-w-md">
        {t("description")}
      </p>

      <div className="mt-6 flex w-full max-w-72 flex-col-reverse gap-2.5 md:w-auto md:max-w-none md:flex-row md:gap-3">
        <Button asChild variant="outline" className="h-11 w-full md:h-9 md:w-auto">
          <Link href={ROUTES.home}>{t("goHome")}</Link>
        </Button>
        <Button variant="default" className="h-11 w-full md:h-9 md:w-auto" onClick={reset}>
          {t("tryAgain")}
        </Button>
      </div>
    </main>
  );
}
