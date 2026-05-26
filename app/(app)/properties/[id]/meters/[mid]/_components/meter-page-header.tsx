import { Breadcrumbs } from "@/components/breadcrumbs";
import { ROUTES } from "@/lib/routes";
import { getServiceTypeDisplay } from "@/lib/constants/service-types";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ReplaceMeterButton } from "./replace-meter-button";
import { OverflowMenu } from "./overflow-menu";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyId: string;
  propertyName: string;
  canMutate: boolean;
};

const MeterPageHeader = ({ meter, serviceType, propertyId, propertyName, canMutate }: TProps) => {
  const { color } = getServiceTypeDisplay(serviceType.code);
  const isHistorical = meter.validTo !== null;

  const serviceLabel = serviceType.code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div style={{ marginBottom: 28 }}>
      <Breadcrumbs
        items={[
          { label: "Properties", href: ROUTES.properties },
          { label: propertyName, href: `${ROUTES.properties}/${propertyId}` },
          { label: "Meters", href: `${ROUTES.properties}/${propertyId}/meters` },
          { label: `${serviceLabel} meter` },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between" style={{ gap: 16 }}>
        <div>
          <h1
            className="text-zinc-950 dark:text-zinc-50"
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -0.5,
              lineHeight: 1.1,
            }}
          >
            {serviceLabel} meter
            {isHistorical && (
              <span
                className="ml-3 rounded bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "3px 8px",
                  verticalAlign: "middle",
                }}
              >
                Historical
              </span>
            )}
          </h1>
          <p
            className="text-zinc-500 dark:text-zinc-400"
            style={{ margin: "7px 0 0", fontSize: 13.5 }}
          >
            <span style={{ color }}>{meter.zoneCount}-zone</span>
            {meter.serialNumber && (
              <>
                <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">·</span>
                <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12.5 }}>
                  Serial {meter.serialNumber}
                </span>
              </>
            )}
            {meter.installedAt && (
              <>
                <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">·</span>
                <span>Installed {formatDate(meter.installedAt)}</span>
              </>
            )}
          </p>
        </div>

        {canMutate && !isHistorical && (
          <div className="flex shrink-0 items-center" style={{ gap: 8 }}>
            <ReplaceMeterButton meter={meter} />
            <OverflowMenu />
          </div>
        )}
      </div>
    </div>
  );
};

export { MeterPageHeader };
