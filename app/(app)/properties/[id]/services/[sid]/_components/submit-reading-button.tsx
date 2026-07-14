import { Gauge } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LinkButton } from "@/components/link-button";
import { ROUTES } from "@/lib/routes";
import type { TMeter } from "@/lib/db/schema/meters";

type TProps = {
  meter: TMeter;
};

export const SubmitReadingButton = async ({ meter }: TProps) => {
  const t = await getTranslations("services.detail.meter");

  return (
    <LinkButton
      href={`${ROUTES.properties}/${meter.propertyId}/meters/${meter.id}/reading/new`}
      icon={Gauge}
      text={t("submitReading")}
      variant="default"
    />
  );
};
