import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { CmsText } from "@/components/cms-text";

type TProps = {
  techHighlights: string;
};

export const TechSection = ({ techHighlights }: TProps) => {
  return (
    <section className="relative overflow-hidden py-16 md:py-[116px]">
      {/* Radial glows — bottom-left + top-right, matching features section bloom */}
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: "-180px",
          right: "-120px",
          width: "720px",
          height: "580px",
          background: "radial-gradient(at 70% 30%, var(--section-glow) 0%, transparent 62%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-[600px] text-center">
          <p className="mb-2.5 text-xs font-medium tracking-[0.08em] text-violet-600 uppercase dark:text-violet-400">
            Stack
          </p>
          <h2 className="mb-5 text-[clamp(28px,3vw,36px)] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
            How it&apos;s built
          </h2>
          <p className="text-base leading-[1.75] text-zinc-500">
            <CmsText value={techHighlights} />
          </p>
          <Link
            href={ROUTES.project}
            className="text-md mt-5 inline-flex items-center gap-1 font-medium text-violet-600 transition-opacity hover:opacity-75 dark:text-violet-400"
          >
            Architecture deep-dive
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
};
