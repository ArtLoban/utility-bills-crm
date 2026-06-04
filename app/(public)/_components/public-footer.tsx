import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";

export const PublicFooter = async () => {
  const t = await getTranslations("landing");

  return (
    <footer style={{ background: "var(--lander-band-bg)" }}>
      <div className="mx-auto max-w-[1100px] px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 py-8 md:flex-row md:justify-center md:gap-7 md:py-9">
          <Link
            href={ROUTES.about}
            className="text-sm text-zinc-200 transition-colors hover:text-white"
          >
            {t("footer.aboutDeveloper")}
          </Link>
          <div className="hidden h-3.5 w-px bg-white/20 md:block" />
          <Link
            href={ROUTES.project}
            className="text-sm text-zinc-200 transition-colors hover:text-white"
          >
            {t("footer.architectureCode")}
          </Link>
          <div className="hidden h-3.5 w-px bg-white/20 md:block" />
          <span className="text-sm text-zinc-400">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </span>
        </div>
      </div>
    </footer>
  );
};
