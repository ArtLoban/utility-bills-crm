import { TProperty } from "@/app/(admin)/art-admin/properties/_data/mock";
import { PropertyCard } from "./property-card";

type TProps = {
  rows: TProperty[];
};

const PropertiesMobile = ({ rows }: TProps) => (
  <div style={{ padding: "12px 14px 32px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rows.map((row) => (
        <PropertyCard key={row.id} row={row} />
      ))}
    </div>
  </div>
);

export { PropertiesMobile };
