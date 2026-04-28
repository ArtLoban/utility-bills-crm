import Link from "next/link";
import { Lightbulb, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type TServiceSummary } from "../../../_data/mock";
import { ServiceRow } from "./service-row";

type TProps = {
  services: TServiceSummary[];
  propertyId: string;
};

const OverviewTab = ({ services, propertyId }: TProps) => {
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
            <Button
              render={
                // devnote: link to correct route when /properties/[id]/services/new is implemented
                <Link href="#" />
              }
            >
              <Plus size={16} />
              Add service
            </Button>
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
            {services.length} services · Tap a row to open
          </p>
        </div>
        <Button
          variant="outline"
          render={
            // devnote: link to correct route when /properties/[id]/services/new is implemented
            <Link href="#" />
          }
        >
          <Plus size={13} />
          Add service
        </Button>
      </div>

      <div>
        {services.map((service, index) => (
          <ServiceRow
            key={service.id}
            service={service}
            propertyId={propertyId}
            isLast={index === services.length - 1}
          />
        ))}
      </div>
    </Card>
  );
};

export { OverviewTab };
