"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";

import type { TContractId } from "@/lib/db/schema/contracts";
import type { TServiceId } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";
import { ACCENT } from "@/lib/constants/ui-tokens";
import { UpdateContractModal } from "./update-contract-modal";

type TProps = {
  contractId: TContractId;
  serviceId: TServiceId;
  serviceType: TServiceType;
  propertyId: string;
};

const UpdateContractButton = ({ contractId, serviceId, serviceType, propertyId }: TProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-0 text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ height: 32, padding: "0 14px", background: ACCENT }}
      >
        <Settings2 size={13} />
        Update contract
      </button>

      <UpdateContractModal
        open={open}
        onOpenChange={setOpen}
        contractId={contractId}
        serviceId={serviceId}
        serviceType={serviceType}
        propertyId={propertyId}
      />
    </>
  );
};

export { UpdateContractButton };
