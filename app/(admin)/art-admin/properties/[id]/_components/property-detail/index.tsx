import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/page-container";
import { PageMeta } from "@/components/page-meta";

import { type TPropertyDetail } from "../../_data/mock";
import { SoftDeleteBanner } from "./components/soft-delete-banner";
import { PropertyInfoCard } from "./components/property-info-card";
import { ServicesCard } from "./components/services-card";
import { SharingCard } from "./components/sharing-card";

type TProps = { property: TPropertyDetail };

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const PropertyDetail = ({ property }: TProps) => {
  const isDeleted = property.status === "deleted";

  const metaItems = [
    capitalize(property.type),
    property.address,
    `${property.servicesCount} ${property.servicesCount === 1 ? "service" : "services"}`,
    ...(!isDeleted ? ["Active"] : []),
  ];

  return (
    <PageContainer
      title={
        <span className={cn(isDeleted && "decoration-muted-foreground line-through opacity-65")}>
          {property.name}
        </span>
      }
      meta={<PageMeta items={metaItems} />}
      breadcrumbs={[
        { label: "art-admin", href: "/art-admin" },
        { label: "properties", href: "/art-admin/properties" },
        { label: property.name },
      ]}
      banner={
        isDeleted ? (
          <SoftDeleteBanner propertyId={property.id} deletedAt={property.deletedAt} />
        ) : undefined
      }
    >
      <div className="flex flex-col gap-4">
        <PropertyInfoCard property={property} />
        {!isDeleted && <ServicesCard services={property.services} />}
        <SharingCard sharing={property.sharing} isDeleted={isDeleted} />
      </div>

      <div className="border-border mt-8 border-t pt-4">
        <p className="text-muted-foreground font-mono text-xs">
          Property ID: {property.propertyId}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Internal record. For support reference only.
        </p>
      </div>
    </PageContainer>
  );
};
