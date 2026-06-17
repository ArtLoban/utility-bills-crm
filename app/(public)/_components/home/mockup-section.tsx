import type { ReactNode } from "react";
import { BrowserFrame } from "./browser-frame";

type TProps = {
  url: string;
  caption: ReactNode;
  children: ReactNode;
};

export const MockupSection = ({ url, caption, children }: TProps) => {
  return (
    <section className="py-14 md:py-[108px]" style={{ background: "var(--lander-band-bg)" }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 md:px-6">
        {/* Mobile: fixed 900px renders the full desktop UI, zoom scales it to the ~342px column.
            Desktop: responsive width up to 900px, no zoom. */}
        <div className="relative w-[900px] [zoom:0.4] md:w-full md:max-w-[900px] md:[zoom:1]">
          <BrowserFrame url={url}>{children}</BrowserFrame>
        </div>
        <div className="mt-7 max-w-[600px] text-center md:mt-11">
          <p className="text-sm leading-[1.6] text-zinc-200">{caption}</p>
        </div>
      </div>
    </section>
  );
};
