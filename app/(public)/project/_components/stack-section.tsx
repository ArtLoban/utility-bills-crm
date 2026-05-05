import { getTranslations } from "next-intl/server";

const FRONTEND_CHIPS = [
  "Next.js",
  "TypeScript",
  "Tailwind v4",
  "shadcn/ui",
  "Base UI",
  "TanStack Table",
  "React Hook Form",
  "Zod",
  "Recharts",
  "next-intl",
  "next-themes",
  "sonner",
];

const BACKEND_CHIPS = [
  "Next.js Server Components & Actions",
  "PostgreSQL",
  "Drizzle ORM",
  "drizzle-zod",
  "Auth.js v5",
  "pino",
  "Sentry",
];

export const StackSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="bg-zinc-100/45 py-24 dark:bg-zinc-900/80">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-xs font-medium tracking-[0.08em] text-violet-600 uppercase dark:text-violet-400">
          {t("project.stack.sectionLabel")}
        </p>
        <h2 className="mb-10 text-[clamp(24px,2.8vw,32px)] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
          {t("project.stack.sectionTitle")}
        </h2>
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-10">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.06em] text-zinc-900 uppercase dark:text-zinc-200">
              {t("project.stack.frontendLabel")}
            </p>
            <div className="flex flex-wrap gap-2">
              {FRONTEND_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-md border border-zinc-200 px-[11px] py-1 text-sm whitespace-nowrap text-zinc-600 transition-colors hover:border-violet-400/40 hover:text-violet-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-violet-400/50 dark:hover:text-violet-400"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.06em] text-zinc-900 uppercase dark:text-zinc-200">
              {t("project.stack.backendLabel")}
            </p>
            <div className="flex flex-wrap gap-2">
              {BACKEND_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-md border border-zinc-200 px-[11px] py-1 text-sm whitespace-nowrap text-zinc-600 transition-colors hover:border-violet-400/40 hover:text-violet-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-violet-400/50 dark:hover:text-violet-400"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
