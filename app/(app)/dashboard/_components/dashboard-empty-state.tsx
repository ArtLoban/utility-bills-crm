"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/empty-state-card";
import { PropertyModal } from "@/components/feature/properties/property-modal";

type TProps = {
  firstName: string | null;
};

const DashboardEmptyState = ({ firstName }: TProps) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreated = (id: string) => {
    router.push(`/properties/${id}`);
  };

  return (
    <div>
      <h2
        className="text-zinc-950 dark:text-zinc-50"
        style={{
          margin: 0,
          marginBottom: 28,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: -0.6,
        }}
      >
        {firstName ? `Hi, ${firstName}` : "Hello!"}
      </h2>

      <EmptyStateCard
        icon={<Home size={40} className="text-zinc-500" />}
        title="Welcome to UtilityBills!"
        body="Start by adding your first property to track your utility bills."
        cta={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Add property
          </Button>
        }
      />

      <PropertyModal open={modalOpen} onOpenChange={setModalOpen} onCreated={handleCreated} />
    </div>
  );
};

export { DashboardEmptyState };
