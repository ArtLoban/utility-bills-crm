import { NotesCard } from "@/components/notes-card";
import type { TMeter } from "@/lib/db/schema/meters";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { getMeterReadings } from "../../_data/queries";
import { DetailsCard } from "../details-card";
import { ConsumptionChart } from "../consumption-chart";

type TProps = {
  meter: TMeter;
  serviceType: TServiceType;
  propertyName: string;
};

export const OverviewTab = async ({ meter, serviceType, propertyName }: TProps) => {
  const readingsResult = await getMeterReadings(meter.id);
  const readings = readingsResult.ok ? readingsResult.value : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <DetailsCard meter={meter} serviceType={serviceType} propertyName={propertyName} />
        <NotesCard notes={meter.notes} />
      </div>
      <ConsumptionChart readings={readings} meter={meter} serviceType={serviceType} />
    </div>
  );
};
