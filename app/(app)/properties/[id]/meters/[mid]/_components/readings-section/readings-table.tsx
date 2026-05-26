import type { TReading } from "@/lib/db/schema/readings";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ReadingRow } from "./reading-row";

type TProps = {
  readings: TReading[];
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
  canMutate: boolean;
};

const columnLabel = (text: string) => (
  <th
    className="text-left text-zinc-500 dark:text-zinc-400"
    style={{
      padding: "10px 16px",
      fontSize: 11.5,
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: 0.3,
      borderBottom: "1px solid",
    }}
  >
    {text}
  </th>
);

const ReadingsTable = ({ readings, meter, serviceType, propertyName, canMutate }: TProps) => {
  const zoneHeader = meter.zoneCount === 1 ? `Value (${serviceType.unit ?? "units"})` : null;

  return (
    <div className="overflow-hidden rounded-[8px] border border-zinc-200 dark:border-zinc-800">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800/50">
            {columnLabel("Date")}
            {meter.zoneCount === 1 ? (
              columnLabel(zoneHeader!)
            ) : (
              <>
                {columnLabel(`T1 day (${serviceType.unit ?? "units"})`)}
                {columnLabel(`T2 night (${serviceType.unit ?? "units"})`)}
                {meter.zoneCount === 3 && columnLabel(`T3 peak (${serviceType.unit ?? "units"})`)}
              </>
            )}
            {columnLabel("Notes")}
            <th style={{ width: 40 }} />
          </tr>
        </thead>
        <tbody>
          {readings.map((reading, i) => (
            <ReadingRow
              key={reading.id}
              reading={reading}
              meter={meter}
              serviceType={serviceType}
              propertyName={propertyName}
              // Pass the reading immediately before this one (next in the array, since sorted DESC)
              lastReadingBeforeThis={readings[i + 1] ?? null}
              isLast={i === readings.length - 1}
              canMutate={canMutate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ReadingsTable };
