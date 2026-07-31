import type { ReactNode } from "react";

import { SkeletonLine } from "@/components/skeleton-line";

type TProps = {
  titleWidth: string;
  descriptionWidth?: string;
  actions?: ReactNode;
};

export const SectionCardHeaderSkeleton = ({ titleWidth, descriptionWidth, actions }: TProps) => (
  <div className="border-border flex flex-col items-start gap-2.5 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5">
    <div className="flex flex-col gap-0.5">
      <SkeletonLine size="sm" className={titleWidth} />
      {descriptionWidth && <SkeletonLine size="xs" className={descriptionWidth} />}
    </div>
    {actions && <div className="flex w-full justify-end sm:w-auto">{actions}</div>}
  </div>
);
