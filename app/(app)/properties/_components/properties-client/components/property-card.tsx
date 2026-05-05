import Link from "next/link";
import { Building2, ChevronRight, Home, TreePine, Users } from "lucide-react";
import { type TProperty } from "@/app/(app)/properties/_data/mock";

const PROPERTY_ICONS = {
  apartment: Building2,
  house: Home,
  cottage: TreePine,
  other: Building2,
} as const;

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
        className="flex items-center justify-center rounded-lg border"
        style={{
          width: 40,
          height: 40,
          background: "#f5f3ff",
          borderColor: "#ede9fe",
        }}
      >
        <Icon size={20} style={{ color: "#7c3aed" }} strokeWidth={1.75} />
      </div>

      <div className="mt-4">
        <p
          className="overflow-hidden font-semibold text-ellipsis whitespace-nowrap text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 15, letterSpacing: -0.2 }}
        >
          {property.name}
        </p>
        {property.address && (
          <p className="mt-0.5 text-zinc-500" style={{ fontSize: 12.5 }}>
            {property.address}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2.5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <span className="text-zinc-500" style={{ fontSize: 12.5 }}>
          {property.serviceCount} services
        </span>

        {property.isShared && (
          <span
            className="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800"
            style={{ fontSize: 11, fontWeight: 500 }}
          >
            <Users size={11} className="text-zinc-500" />
            Shared
          </span>
        )}

        {property.isShared && (
          <span className="text-zinc-500" style={{ fontSize: 12 }}>
            · Role:{" "}
            <span className="font-medium text-zinc-950 dark:text-zinc-50">{property.myRole}</span>
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <div>
          <p
            className="mb-1 font-medium text-zinc-500 uppercase"
            style={{ fontSize: 11, letterSpacing: 0.3 }}
          >
            Balance
          </p>
          <p
            className={`font-semibold tabular-nums ${balanceClass}`}
            style={{ fontSize: 22, letterSpacing: -0.4 }}
          >
            {balanceText}
          </p>
        </div>

        <div className="flex items-center gap-0.5 text-zinc-500 group-hover:text-violet-600">
          <span style={{ fontSize: 13, fontWeight: 500 }}>Open</span>
          <ChevronRight size={14} strokeWidth={2} />
        </div>
      </div>
    </Link>
  );
};

export { PropertyCard };
