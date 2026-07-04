import { getTranslations } from "next-intl/server";

import type { TService } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";

import { resolveServiceLabel, resolveServiceTypeLabel } from "./service-label";
import type { TServiceTypeCode } from "./service-type";

export const resolveServiceLabelServer = async (
  service: Pick<TService, "name">,
  serviceType: Pick<TServiceType, "code">,
): Promise<string> => {
  const t = await getTranslations("services.types");

  return resolveServiceLabel({ name: service.name, code: serviceType.code as TServiceTypeCode }, t);
};

export const resolveServiceTypeLabelServer = async (
  serviceType: Pick<TServiceType, "code">,
): Promise<string> => {
  const t = await getTranslations("services.types");

  return resolveServiceTypeLabel(serviceType.code as TServiceTypeCode, t);
};
