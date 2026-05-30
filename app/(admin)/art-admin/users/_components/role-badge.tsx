import type { TSystemRole } from "@/lib/auth/constants";

type TProps = {
  role: TSystemRole;
};

export const RoleBadge = ({ role }: TProps) => {
  if (role === "admin") {
    return (
      <span className="rounded border border-amber-200 bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
        Admin
      </span>
    );
  }

  return (
    <span className="rounded border px-1.5 py-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
      User
    </span>
  );
};
