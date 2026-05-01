import type { ReactNode } from "react";
import { BrowserFrame } from "./browser-frame";

type TProps = {
  url: string;
  caption: ReactNode;
  children: ReactNode;
};

export const MockupSection = ({ url, caption, children }: TProps) => {
  return (
    <section className="bg-zinc-100/45 py-24 dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center px-6">
        <div className="relative w-full max-w-[900px]">
          <BrowserFrame url={url}>{children}</BrowserFrame>
        </div>
        <div className="mt-5 max-w-[560px] text-center">
          <p className="text-[14px] leading-[1.6] text-zinc-500">{caption}</p>
        </div>
      </div>
    </section>
  );
};
