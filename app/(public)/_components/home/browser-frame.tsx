import type { ReactNode } from "react";

type TProps = {
  url: string;
  children: ReactNode;
};

export const BrowserFrame = ({ url, children }: TProps) => {
  return (
    <div
      className="overflow-hidden rounded-[10px]"
      style={{
        border: "1px solid var(--mockup-border)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Chrome bar */}
      <div
        className="flex h-[34px] items-center gap-3 px-3"
        style={{
          background: "var(--mockup-frame-bg)",
          borderBottom: "1px solid var(--mockup-border)",
        }}
      >
        <div className="flex gap-[5px]">
          <div className="size-2.5 rounded-full" style={{ background: "var(--mockup-dot-1)" }} />
          <div className="size-2.5 rounded-full" style={{ background: "var(--mockup-dot-2)" }} />
          <div className="size-2.5 rounded-full" style={{ background: "var(--mockup-dot-3)" }} />
        </div>
        <div
          className="mx-auto flex h-5 max-w-[340px] flex-1 items-center rounded-md px-2"
          style={{
            background: "var(--mockup-url-bg)",
            border: "1px solid var(--mockup-border)",
          }}
        >
          <span className="font-sans text-[10px]" style={{ color: "var(--mockup-url-text)" }}>
            {url}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
};
