import Link from "next/link";
import { Gauge } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import type { TMeter } from "@/lib/db/schema/meters";

type TProps = {
  meter: TMeter;
};

export const SubmitReadingButton = async ({ meter }: TProps) => {
  const t = await getTranslations("services.detail.meter");

  return (
    <Button size="sm" asChild>
      <Link href={`${ROUTES.properties}/${meter.propertyId}/meters/${meter.id}/reading/new`}>
        <Gauge className="size-3.5" />
        {t("submitReading")}
      </Link>
    </Button>
  );
};
