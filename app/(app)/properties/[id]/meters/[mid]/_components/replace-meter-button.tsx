import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import type { MeterId } from "@/lib/db/schema/meters";

type TProps = {
  propertyId: string;
  meterId: MeterId;
};

export const ReplaceMeterButton = async ({ propertyId, meterId }: TProps) => {
  const t = await getTranslations("meters.detail.actions");

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={`${ROUTES.properties}/${propertyId}/meters/${meterId}/replace`}>
        {t("replace")}
      </Link>
    </Button>
  );
};
