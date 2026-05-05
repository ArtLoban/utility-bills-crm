"use client";

import { useState } from "react";
import { Home, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PropertyModal } from "@/components/feature/properties/property-modal";
import { MOCK_PROPERTIES } from "../../_data/mock";
import { PageContainer } from "@/components/page-container";
import { Properties } from "./components/properties";

export const PropertiesClient = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const hasProperties = MOCK_PROPERTIES.length > 0;

  const addButton = (
    <Button onClick={() => setModalOpen(true)}>
      <Plus size={16} />
      Add property
    </Button>
  );

  return (
    <PageContainer title="My Properties" actions={hasProperties && addButton}>
      {hasProperties ? (
        <Properties properties={MOCK_PROPERTIES} />
      ) : (
        <EmptyStateCard
          icon={<Home size={40} className="text-zinc-500" />}
          title="No properties yet"
          body="Add your first property to start tracking utility bills."
          cta={addButton}
        />
      )}
      <PropertyModal open={modalOpen} onOpenChange={setModalOpen} />
    </PageContainer>
  );
};
