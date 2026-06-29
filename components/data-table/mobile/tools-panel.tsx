import type { ReactNode } from "react";

type TProps = {
  filter: ReactNode;
  sort: ReactNode;
  chips?: ReactNode;
};

export const MobileToolsPanel = ({ filter, sort, chips }: TProps) => (
  <div>
    <div className="mb-3.5 flex items-center justify-between">
      {filter}
      {sort}
    </div>
    {chips}
  </div>
);
