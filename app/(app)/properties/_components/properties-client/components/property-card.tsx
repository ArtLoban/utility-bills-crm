import Link from "next/link";
import { Building2, ChevronRight, Home, TreePine, Users } from "lucide-react";
import { type TProperty } from "@/app/(app)/properties/_data/mock";

const PROPERTY_ICONS = {
  apartment: Building2,
  house: Home,
  cottage: TreePine,
  other: Building2,
};

const formatBalance = (balance: number): { text: string; className: string } => {
  if (balance < 0) {
    return {
      text: `−${Math.abs(balance).toLocaleString()} UAH`,
      className: "text-destructive",
    };
  }
  if (balance > 0) {
    return {
      text: `+${balance.toLocaleString()} UAH`,
      className: "text-green-600",
    };
  }
  return { text: "0 UAH", className: "text-zinc-500" };
};

type TProps = {
  property: TProperty;
};

const PropertyCard = ({ property }: TProps) => {
  const Icon = PROPERTY_ICONS[property.type];
  const { text: balanceText, className: balanceClass } = formatBalance(property.balance);

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block rounded-lg border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_0_rgba(24,24,27,0.05)] transition-[box-shadow,transform] duration-150 hover:-translate-y-px hover:shadow-[0_4px_8px_-2px_rgba(24,24,27,0.08),_0_2px_4px_-2px_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:border-violet-500/30"
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg border"
        style={{
          background: "var(--field-tint-bg)",
          borderColor: "var(--field-tint-border)",
        }}
      >
        <Icon size={20} style={{ color: "var(--field-tint-fg)" }} strokeWidth={1.75} />
      </div>

      <div className="mt-4">
        <p
          className="overflow-hidden font-semibold tracking-[-0.2px] text-ellipsis whitespace-nowrap text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: "var(--font-size-md)" }}
        >
          {property.name}
        </p>
        {property.address && <p className="mt-0.5 text-xs text-zinc-500">{property.address}</p>}
      </div>

      <div className="mt-4 flex items-center gap-2.5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <span className="text-xs text-zinc-500">{property.serviceCount} services</span>

        {property.isShared && (
          <span className="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium dark:bg-zinc-800">
            <Users size={11} className="text-zinc-500" />
            Shared
          </span>
        )}

        {property.isShared && (
          <span className="text-xs text-zinc-500">
            · Role:{" "}
            <span className="font-medium text-zinc-950 dark:text-zinc-50">{property.myRole}</span>
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <div>
          <p className="mb-1 text-[11px] font-medium tracking-[0.3px] text-zinc-500 uppercase">
            Balance
          </p>
          <p className={`text-[22px] font-semibold tracking-[-0.4px] tabular-nums ${balanceClass}`}>
            {balanceText}
          </p>
        </div>

        <div className="flex items-center gap-0.5 text-zinc-500 group-hover:text-violet-600">
          <span className="text-[13px] font-medium">Open</span>
          <ChevronRight size={14} strokeWidth={2} />
        </div>
      </div>
    </Link>
  );
};

export { PropertyCard };
