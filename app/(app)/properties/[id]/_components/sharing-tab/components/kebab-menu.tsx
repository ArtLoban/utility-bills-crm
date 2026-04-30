import { MoreHorizontal } from "lucide-react";

type TMenuItem = { label: string; destructive?: boolean; onClick?: () => void };

type TProps = { open: boolean; onToggle: () => void; items: TMenuItem[] };

export const KebabMenu = ({ open, onToggle, items }: TProps) => (
  <div className="relative">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[6px] ${
        open ? "border border-zinc-200 bg-zinc-100" : "border border-transparent bg-transparent"
      }`}
    >
      <MoreHorizontal size={15} color="#71717a" />
    </button>

    {open && (
      <div className="absolute top-[34px] right-0 z-20 w-40 overflow-hidden rounded-[6px] border border-zinc-200 bg-white shadow-[0_4px_16px_rgba(9,9,11,0.10)]">
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick?.();
            }}
            className={`block w-full cursor-pointer border-0 bg-transparent px-[14px] py-[9px] text-left text-[13px] ${
              item.destructive ? "text-[#dc2626]" : "text-[#09090b]"
            } ${i === 0 ? "" : "border-t border-zinc-100"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    )}
  </div>
);
