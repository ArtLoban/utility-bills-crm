import type { TMeter } from "@/lib/db/schema/meters";

import { ReplaceMeterButton } from "./components/replace-meter-button";
import { OverflowMenu } from "./components/overflow-menu";

type TProps = {
  meter: TMeter;
  meterTitle: string;
  canMutate: boolean;
};

export const PageActions = ({ meter, meterTitle, canMutate }: TProps) => {
  const isHistorical = meter.validTo !== null;

  if (!canMutate || isHistorical) return null;

  return (
    <div className="flex items-center gap-2">
      <ReplaceMeterButton propertyId={meter.propertyId} meterId={meter.id} />
      <OverflowMenu propertyId={meter.propertyId} meterId={meter.id} meterTitle={meterTitle} />
    </div>
  );
};
