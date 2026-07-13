import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { capitalize } from "@/lib/utils/capitalize";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";
import { DemoBadge } from "@/app/(secure)/(admin)/art-admin/_components/demo-badge";
import type { TAdminPropertyDetail } from "@/features/admin-properties";

import { SoftDeleteBanner } from "./components/soft-delete-banner";
import { PropertyInfoCard } from "./components/property-info-card";
import { SharingCard } from "./components/sharing-card";
import { formatServiceCount } from "./utils/format-service-count";

type TProps = {
  property: TAdminPropertyDetail;
};

export const PropertyDetail = ({ property }: TProps) => {
  const isDeleted = property.deletedAt !== null;
  const isDemo = property.owners.some((o) => o.isDemo);

  const metaItems = [
    capitalize(property.type),
    property.address ?? null,
    formatServiceCount(property.servicesCount),
    isDemo ? <DemoBadge key="demo" /> : null,
    isDeleted ? "Deleted" : "Active",
  ].filter(Boolean);

  return (
    <PageContainer
      title={
        <span className={cn(isDeleted && "decoration-muted-foreground line-through opacity-65")}>
          {property.name}
        </span>
      }
      meta={<PageMeta items={metaItems} />}
      breadcrumbs={[
        { label: "art-admin", href: ROUTES.admin.root },
        { label: "properties", href: ROUTES.admin.properties },
        { label: property.name },
      ]}
      banner={
        isDeleted ? (
          <SoftDeleteBanner
            propertyId={property.id}
            propertyName={property.name}
            deletedAt={property.deletedAt!}
          />
        ) : undefined
      }
      actions={
        !isDeleted ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`${ROUTES.properties}/${property.id}`}>
              <ArrowUpRight size={14} strokeWidth={1.75} />
              Go to property
            </Link>
          </Button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-4">
        <PropertyInfoCard property={property} />
        <SharingCard owners={property.owners} isDeleted={isDeleted} />
      </div>

      <div className="border-border mt-8 border-t pt-4">
        <p className="text-muted-foreground font-mono text-xs">Property ID: {property.id}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Internal record. For support reference only.
        </p>
      </div>
    </PageContainer>
  );
};
