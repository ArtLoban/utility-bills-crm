import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/routes";

type TProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export const LegalPage = ({ title, lastUpdated, children }: TProps) => {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-5 md:px-6 md:py-12">
      <Link
        href={ROUTES.home}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ArrowLeft className="size-4" strokeWidth={2} />
        Back to home
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      <p className="mt-2 text-sm text-zinc-500">Last updated: {lastUpdated}</p>

      <div className="mt-8 flex flex-col gap-6 [&_a]:font-medium [&_a]:text-violet-600 [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-opacity dark:[&_a]:text-violet-400 [&_a:hover]:opacity-75 [&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-zinc-600 [&_li]:marker:text-zinc-400 dark:[&_li]:text-zinc-300 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-zinc-600 dark:[&_p]:text-zinc-300 [&_strong]:font-semibold [&_strong]:text-zinc-900 dark:[&_strong]:text-zinc-50 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2.5 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
};
