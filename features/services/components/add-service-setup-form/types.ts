import type { PropertyId } from "@/lib/db/schema/properties";
import type { TProvider } from "@/lib/db/schema/providers";
import type { TServiceType, TServiceTypeId } from "@/lib/db/schema/service-types";

export type TProps = {
  propertyId: PropertyId;
  serviceTypes: TServiceType[];
  existingTypeIds: TServiceTypeId[];
  providers: TProvider[];
};
