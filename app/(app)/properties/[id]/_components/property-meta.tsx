import { getTranslations } from "next-intl/server";
import { format } from "date-fns";
import { PageMeta } from "@/components/page-meta";
import { DISPLAY_DATE_FORMAT } from "@/lib/format/date";
import type { TPropertyDetail } from "../_data/queries";

type TProps = {
  property: TPropertyDetail;
};

export const PropertyMeta = async ({ property }: TProps) => {
  const t = await getTranslations("properties");
  const { address, createdAt, serviceCount } = property;

  const createdFormatted = format(createdAt, DISPLAY_DATE_FORMAT);

  return (
    <PageMeta
      items={[
        address,
        t("detail.services", { count: serviceCount }),
        t("detail.createdOn", { date: createdFormatted }),
      ]}
    />
  );
};
