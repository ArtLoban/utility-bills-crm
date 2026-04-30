import { TUserRole } from "../../../types";

type TProps = {
  value: TUserRole;
  selected: TUserRole;
  onSelect: (value: TUserRole) => void;
  label: string;
  helper: string;
};

export const InviteRadio = ({ value, selected, onSelect, label, helper }: TProps) => {
  const isActive = value === selected;

  return (
    <div
      onClick={() => onSelect(value)}
      className={`flex cursor-pointer flex-row items-center gap-3 rounded-lg px-[14px] py-3 transition-[border-color,background] duration-[120ms] ${
        isActive
          ? "border-[1.5px] border-[#7c3aed] bg-[#f5f3ff]"
          : "border-[1.5px] border-zinc-200 bg-white"
      }`}
    >
      <div
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
        style={{
          border: `2px solid ${isActive ? "#7c3aed" : "#e4e4e7"}`,
          background: isActive ? "#7c3aed" : "white",
        }}
      >
        {isActive && <div className="h-[5px] w-[5px] rounded-full bg-white" />}
      </div>

      <div>
        <div className="text-[13.5px] font-semibold tracking-[-0.1px]">{label}</div>
        <div className="mt-[2px] text-[12.5px] text-zinc-500">{helper}</div>
      </div>
    </div>
  );
};
