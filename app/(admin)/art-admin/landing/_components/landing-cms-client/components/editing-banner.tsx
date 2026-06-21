import { ExternalLink } from "lucide-react";

import { TAB_PAGE_META, type TCmsTab } from "../constants";

type TProps = {
  activeTab: TCmsTab;
};

export const EditingBanner = ({ activeTab }: TProps) => {
  const meta = TAB_PAGE_META[activeTab];

  return (
    <div className="border-border text-muted-foreground mb-5 flex items-center gap-2.5 rounded-lg border bg-zinc-50 px-3.5 py-2.5 text-[12.5px] dark:bg-zinc-900">
      <span
        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: "#10b981" }}
      />
      <span>
        Editing <span className="text-foreground font-medium">{meta.label}</span>
      </span>
      {meta.url && (
        <a
          href={meta.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground ml-auto flex items-center gap-1 font-mono text-xs"
        >
          {meta.url}
          <ExternalLink className="size-[11px]" />
        </a>
      )}
    </div>
  );
};
