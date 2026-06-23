"use client";

import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import type { TAdminPropertyRow } from "@/features/admin-properties/types";
import type { TServerPagination } from "@/lib/types/data-table";

import { PropertiesTableActions } from "./components/table-actions";
import { PropertiesTable } from "./components/properties-table";
import { formatPropertyCount } from "./components/properties-table/utils/format-property-count";

type TProps = {
  data: TAdminPropertyRow[];
  pagination: TServerPagination;
  ownerName: string | null;
};

export const PropertiesClient = ({ data, pagination, ownerName }: TProps) => (
  <PageContainer
    title="All properties"
    meta={<PageMeta items={[formatPropertyCount(pagination.total)]} />}
  >
    <PropertiesTableActions>
      <PropertiesTable data={data} pagination={pagination} ownerName={ownerName} />
    </PropertiesTableActions>
  </PageContainer>
);
