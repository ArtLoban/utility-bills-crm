import { type TPropertyAccessRole } from "../../../_data/mock";

type TProps = {
  role: TPropertyAccessRole;
};

const ROLE_LABELS: Record<TPropertyAccessRole, string> = {
  owner: "Owner",
  editor: "Editor",
  viewer: "Viewer",
};

export const PropertyRoleBadge = ({ role }: TProps) => (
  <span className="rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-xs font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-400">
    {ROLE_LABELS[role]}
  </span>
);
