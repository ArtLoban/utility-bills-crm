import { getTranslations } from "next-intl/server";

import { IconBadge } from "@/components/icon-badge";
import { PROPERTY_TYPE_ICONS } from "@/features/properties/property-type";
import type { TPropertyType } from "@/lib/db/schema/properties";

type TProps = {
  name: string;
  type: TPropertyType;
};

export const PropertyIdentity = async ({ name, type }: TProps) => {
  const t = await getTranslations("properties.type");

  return (
    <span className="inline-flex items-center gap-2">
      <IconBadge icon={PROPERTY_TYPE_ICONS[type]} color="var(--neutral-400)" size="xs" />
      <span>
        {name} <span className="text-muted-foreground">· {t(type)}</span>
      </span>
    </span>
  );
};
