import Link from "next/link";
import { ChevronRight, Droplets, Flame, Thermometer, Wifi, Zap } from "lucide-react";
import { SERVICE_COLORS, type TServiceKey } from "@/lib/constants/service-colors";
import { type TServiceSummary } from "../../../_data/mock";

const SERVICE_ICONS: Record<TServiceKey, React.ElementType> = {
  electricity: Zap,
  gas: Flame,
  coldWater: Droplets,
  hotWater: Droplets,
  heating: Thermometer,
  internet: Wifi,
};

const buildSubtitle = (service: TServiceSummary): string => {
  const provider = service.provider ?? "No provider set";
  if (!service.isMetered) return `${provider} · No meter`;
  if (!service.lastReadingDate) return `${provider} · No readings yet`;
  return `${provider} · Last reading: ${service.lastReadingDate}`;
};

const formatBalance = (balance: number): { text: string; className: string } => {
  if (balance < 0) {
    return { text: `−${Math.abs(balance).toLocaleString()} UAH`, className: "text-destructive" };
  }
  if (balance > 0) {
    return { text: `+${balance.toLocaleString()} UAH`, className: "text-green-600" };
  }
  return { text: "0 UAH", className: "text-zinc-500" };
};

type TProps = {
  service: TServiceSummary;
  propertyId: string;
  isLast: boolean;
};

const ServiceRow = ({ service, propertyId, isLast }: TProps) => {
  const Icon = SERVICE_ICONS[service.serviceKey];
  const color = SERVICE_COLORS[service.serviceKey];
  const { text: balanceText, className: balanceClass } = formatBalance(service.balance);

  return (
    <Link
      href={`/properties/${propertyId}/services/${service.id}`}
      className={`group flex items-center gap-4 px-6 py-[18px] transition-colors duration-[120ms] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${!isLast ? "border-b border-zinc-100 dark:border-zinc-800" : ""}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-lg"
        style={{
          width: 36,
          height: 36,
          background: `${color}1A`,
        }}
      >
        <Icon size={18} style={{ color }} strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="font-semibold text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 14.5, letterSpacing: -0.1, marginBottom: 2 }}
        >
          {service.name}
        </p>
        <p className="truncate text-zinc-500" style={{ fontSize: 12.5 }}>
          {buildSubtitle(service)}
        </p>
      </div>

      <p className={`shrink-0 font-semibold tabular-nums ${balanceClass}`} style={{ fontSize: 15 }}>
        {balanceText}
      </p>

      <ChevronRight
        size={16}
        strokeWidth={2}
        className="shrink-0 text-zinc-400 group-hover:text-violet-600"
      />
    </Link>
  );
};

export { ServiceRow };
