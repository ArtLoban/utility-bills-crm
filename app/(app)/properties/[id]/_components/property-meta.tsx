import { getTranslations } from "next-intl/server";
import { format } from "date-fns";
import { PageMeta } from "@/components/page-meta";
import type { TPropertyDetail } from "../_data/queries";

type TProps = {
  property: TPropertyDetail;
};

export const PropertyMeta = async ({ property }: TProps) => {
  const t = await getTranslations("properties");
  const { address, createdAt } = property;

  const createdFormatted = format(createdAt, "MMM yyyy");

  return <PageMeta items={[address, t("detail.createdOn", { date: createdFormatted })]} />;
};
