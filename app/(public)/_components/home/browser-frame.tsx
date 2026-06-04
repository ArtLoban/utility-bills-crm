import type { ReactNode } from "react";

import styles from "./mockup.module.css";

type TProps = {
  url: string;
  children: ReactNode;
};

export const BrowserFrame = ({ url, children }: TProps) => {
  return (
    <div
      className={`overflow-hidden rounded-[10px] ${styles.mockup}`}
      style={{
        border: "1px solid var(--mockup-border)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,1)",
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
          <div
            className="size-2.5 rounded-full"
            style={{ background: "var(--mockup-dot-close)" }}
          />
          <div className="size-2.5 rounded-full" style={{ background: "var(--mockup-dot-min)" }} />
          <div className="size-2.5 rounded-full" style={{ background: "var(--mockup-dot-max)" }} />
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
