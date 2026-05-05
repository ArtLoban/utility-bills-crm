import { ChevronDown } from "lucide-react";
import { TUserRole } from "../types";

type TProps = { value: TUserRole };

export const RoleDropdown = ({ value }: TProps) => (
  <div className="relative inline-flex items-center">
    <select
      defaultValue={value}
      // devnote: wire onChange to role update Server Action when role management is implemented
      className="h-7 cursor-pointer appearance-none rounded-[6px] border border-[#ede9fe] bg-[#f5f3ff] py-0 pr-[26px] pl-[10px] text-xs font-medium text-[#7c3aed]"
    >
      <option value="Owner">Owner</option>
      <option value="Editor">Editor</option>
      <option value="Viewer">Viewer</option>
    </select>
    <ChevronDown size={12} color="#7c3aed" className="pointer-events-none absolute right-[7px]" />
  </div>
);
