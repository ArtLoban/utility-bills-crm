import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/lib/routes";

export const TechSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="relative overflow-hidden py-24">
      {/* Radial glow — same bottom-left bloom as features section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          bottom: "-180px",
          left: "-120px",
          width: "720px",
          height: "580px",
          background: "radial-gradient(at 30% 70%, var(--section-glow) 0%, transparent 62%)",
        }}
      />
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto max-w-[600px] text-center">
          <p className="mb-2.5 text-xs font-medium tracking-[0.08em] text-violet-600 uppercase dark:text-violet-400">
            {t("tech.sectionLabel")}
          </p>
          <h2 className="mb-5 text-[clamp(26px,3vw,36px)] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
            {t("tech.sectionTitle")}
          </h2>
          <p className="text-base leading-[1.75] text-zinc-500">
            {t.rich("tech.description", {
              b: (chunks) => (
                <strong className="font-medium text-zinc-700 dark:text-zinc-300">{chunks}</strong>
              ),
            })}
          </p>
          <Link
            href={ROUTES.project}
            className="text-md mt-5 inline-flex items-center gap-1 font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
          >
            {t("tech.link")}
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
};
