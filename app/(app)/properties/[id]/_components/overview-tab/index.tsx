import Link from "next/link";
import { Lightbulb, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TServiceListItem } from "@/lib/db/access/services";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TBalance } from "@/features/ledger/types";
import { ServiceRow } from "./service-row";

type TProps = {
  services: TServiceListItem[];
  role: TPropertyRole;
  propertyId: string;
  serviceBalances: Map<TServiceId, TBalance>;
};

const OverviewTab = ({ services, role, propertyId, serviceBalances }: TProps) => {
  const canEdit = role !== "viewer";
  const addHref = `/properties/${propertyId}/services/new`;

  if (services.length === 0) {
    return (
      <Card className="overflow-hidden rounded-lg p-0">
        <div className="flex justify-center px-6 py-12">
          <div className="flex max-w-[380px] flex-col items-center gap-4 text-center">
            <div
              className="flex items-center justify-center rounded-[14px] bg-zinc-100 dark:bg-zinc-800"
              style={{ width: 64, height: 64 }}
            >
              <Lightbulb size={32} className="text-zinc-500" />
            </div>
            <div>
              <p
                className="font-semibold text-zinc-950 dark:text-zinc-50"
                style={{ fontSize: 17, letterSpacing: -0.3 }}
              >
                No services yet
              </p>
              <p className="mt-2 leading-relaxed text-zinc-500" style={{ fontSize: 13.5 }}>
                Add your first utility service to start tracking bills and readings.
              </p>
            </div>
            {canEdit && (
              <Button asChild>
                <Link href={addHref}>
                  <Plus size={16} />
                  Add service
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-lg p-0">
      <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-[18px] dark:border-zinc-800">
        <div>
          <p
            className="font-semibold text-zinc-950 dark:text-zinc-50"
            style={{ fontSize: 14, letterSpacing: -0.1 }}
          >
            Services on this property
          </p>
          <p className="mt-0.5 text-zinc-500" style={{ fontSize: 12 }}>
            {services.length} {services.length === 1 ? "service" : "services"} · Tap a row to open
          </p>
        </div>
        {canEdit && (
          <Button asChild variant="outline">
            <Link href={addHref}>
              <Plus size={13} />
              Add service
            </Link>
          </Button>
        )}
      </div>

      <div>
        {services.map(({ service, serviceType }, index) => (
          <ServiceRow
            key={service.id}
            service={service}
            serviceType={serviceType}
            propertyId={propertyId}
            isLast={index === services.length - 1}
            balance={serviceBalances.get(service.id) ?? null}
          />
        ))}
      </div>
    </Card>
  );
};

export { OverviewTab };
