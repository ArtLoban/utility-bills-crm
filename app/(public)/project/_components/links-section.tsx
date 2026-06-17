import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { TryDemoForm } from "@/components/try-demo-form";

type TProps = {
  projectRepoUrl: string;
};

const cardClass =
  "flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-150 ease-in-out hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(24,24,27,0.12),0_3px_8px_rgba(24,24,27,0.06)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:translate-y-0 dark:hover:border-zinc-700 dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.55)]";

const cardLabel =
  "inline-flex items-center gap-1.5 text-base font-medium text-violet-600 dark:text-violet-400";

export const LinksSection = ({ projectRepoUrl }: TProps) => {
  return (
    <section className="border-border border-t py-[56px] md:py-[92px]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a href={projectRepoUrl} target="_blank" rel="noopener noreferrer" className={cardClass}>
            <span className={cardLabel}>
              GitHub
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </span>
            <span className="text-sm leading-[1.55] text-zinc-500">
              full source, README, decision log.
            </span>
          </a>

          <TryDemoForm className="contents">
            <button type="submit" className={`${cardClass} cursor-pointer text-left`}>
              <span className={cardLabel}>
                Live demo
                <ArrowRight className="size-3.5" strokeWidth={2} />
              </span>
              <span className="text-sm leading-[1.55] text-zinc-500">
                view-only, with sample data.
              </span>
            </button>
          </TryDemoForm>

          <Link href={ROUTES.about} className={cardClass}>
            <span className={cardLabel}>
              About me
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </span>
            <span className="text-sm leading-[1.55] text-zinc-500">who built this.</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
