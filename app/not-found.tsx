import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SearchX } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/icon-badge";

export const metadata: Metadata = {
  title: "404 — Page not found",
};

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-1 flex-col">
      <PublicHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center md:pb-20">
        <IconBadge icon={SearchX} color="var(--muted-foreground)" size="xl" />

        <h2 className="mt-6 text-xl font-semibold md:text-2xl">{t("title")}</h2>

        <p className="text-muted-foreground mt-2.5 max-w-xs text-sm leading-relaxed md:max-w-md">
          {t("description")}
        </p>

        <div className="mt-6 w-full max-w-72 md:w-auto">
          <Button asChild variant="default" className="h-11 w-full md:h-9 md:w-auto">
            <Link href="/">{t("goHome")}</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
