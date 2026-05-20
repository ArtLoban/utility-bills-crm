import { Zap, Droplets, Flame, Wifi, type LucideIcon } from "lucide-react";

import { DataCard } from "@/components/data-card";
import { cn } from "@/lib/utils";
import { type TService, type TServiceType } from "../../../_data/mock";

type TProps = { services: TService[] };

const SERVICE_ICONS: Record<TServiceType, LucideIcon> = {
  electricity: Zap,
  "cold-water": Droplets,
  gas: Flame,
  internet: Wifi,
};

const formatBalance = (balance: number): string =>
  balance > 0 ? `${balance.toLocaleString("en-US")} UAH owed` : "0";

export const ServicesCard = ({ services }: TProps) => (
  <DataCard className="overflow-hidden">
    <div className="border-border border-b px-6 py-4">
      <h3 className="text-sm font-semibold">Services</h3>
    </div>
    <div className="px-6">
      {services.map((service, i) => {
        const Icon = SERVICE_ICONS[service.type];
        const isLast = i === services.length - 1;

        return (
          <div
            key={service.type}
            className={cn("flex items-center gap-3 py-3", !isLast && "border-border border-b")}
          >
            <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-md">
              <Icon size={15} strokeWidth={1.75} className="text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{service.name}</p>
              <p className="text-muted-foreground text-xs">{service.provider}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-muted-foreground text-xs">
                {service.lastReading ? `Last reading ${service.lastReading}` : "No readings"}
              </p>
              <p
                className={cn(
                  "text-sm font-medium",
                  service.balance > 0 ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {formatBalance(service.balance)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </DataCard>
);
