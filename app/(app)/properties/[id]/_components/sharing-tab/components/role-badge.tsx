import { TUserRole } from "../types";

type TProps = { role: TUserRole };

const ROLE_CLASSES: Record<TUserRole, string> = {
  Owner: "bg-[#f5f3ff] border border-[#ede9fe] text-[#7c3aed]",
  Editor: "bg-[#eff6ff] border border-[#bfdbfe] text-[#1d4ed8]",
  Viewer: "bg-[#f4f4f5] border border-[#e4e4e7] text-[#71717a]",
};

export const RoleBadge = ({ role }: TProps) => (
  <span className={`rounded-full px-2 py-[2px] text-[11.5px] font-semibold ${ROLE_CLASSES[role]}`}>
    {role}
  </span>
);
