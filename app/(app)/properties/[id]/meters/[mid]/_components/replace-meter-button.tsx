import { getTranslations } from "next-intl/server";

import { LinkButton } from "@/components/link-button";
import { ROUTES } from "@/lib/routes";
import type { MeterId } from "@/lib/db/schema/meters";

type TProps = {
  propertyId: string;
  meterId: MeterId;
};

export const ReplaceMeterButton = async ({ propertyId, meterId }: TProps) => {
  const t = await getTranslations("meters.detail.actions");

  return (
    <LinkButton
      href={`${ROUTES.properties}/${propertyId}/meters/${meterId}/replace`}
      text={t("replace")}
    />
  );
};
