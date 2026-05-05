"use client";

import { useState } from "react";
import { Home, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PropertyModal } from "@/components/feature/properties/property-modal";
import { MOCK_PROPERTIES } from "../_data/mock";
import { PropertyCard } from "./property-card";

export const PropertiesClient = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const hasProperties = MOCK_PROPERTIES.length > 0;

  return (
    <div
      style={{
        maxWidth: 1360,
        margin: "0 auto",
        padding: "32px 32px 48px",
        width: "100%",
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 28 }}>
        <h2
          className="text-zinc-950 dark:text-zinc-50"
          style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: -0.6 }}
        >
          My Properties
        </h2>

        {hasProperties && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Add property
          </Button>
        )}
      </div>

      {hasProperties ? (
        <div className="grid grid-cols-3 gap-5">
          {MOCK_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <EmptyStateCard
          icon={<Home size={40} className="text-zinc-500" />}
          title="No properties yet"
          body="Add your first property to start tracking utility bills."
          cta={
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={16} />
              Add property
            </Button>
          }
        />
      )}

      <PropertyModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};
