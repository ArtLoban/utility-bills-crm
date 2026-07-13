"use client";

import { useTranslations } from "next-intl";

import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import type { TMetersListResult } from "@/lib/db/access/meters";
import type { TPropertyOption } from "@/features/properties";

import { MetersTable } from "./components/meters-table";

type TProps = {
  metersList: TMetersListResult;
  properties: TPropertyOption[];
};

export const MetersClient = ({ metersList, properties }: TProps) => {
  const t = useTranslations("meters.list");
  const { pagination, totals } = metersList;

  return (
    <PageContainer
      title={t("title")}
      meta={
        <PageMeta
          items={[
            t("subtitle", { count: pagination.total, propertyCount: totals.propertyCount }),
            t("subtitleActive", { activeCount: totals.activeCount }),
          ]}
        />
      }
    >
      <MetersTable metersList={metersList} properties={properties} />
    </PageContainer>
  );
};
