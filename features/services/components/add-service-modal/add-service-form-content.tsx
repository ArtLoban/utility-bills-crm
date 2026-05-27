"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/form-field";
import { SERVICE_LIMITS } from "@/features/services/schema";
import type { PropertyId } from "@/lib/db/schema/properties";
import type { TServiceType, TServiceTypeId } from "@/lib/db/schema/service-types";
import { useAddService } from "./hooks/use-add-service";
import { ServiceTypeCard } from "./components/service-type-card";
import { getServiceTypeVisuals, TServiceTypeCode } from "@/features/services/service-type";

type TProps = {
  propertyId: PropertyId;
  serviceTypes: TServiceType[];
  existingTypeIds: TServiceTypeId[];
};

export const AddServiceFormContent = ({ propertyId, serviceTypes, existingTypeIds }: TProps) => {
  const router = useRouter();
  const t = useTranslations("services.types");
  const existingSet = new Set(existingTypeIds);

  const { selectedTypeId, selectType, notes, setNotes, formError, isSaving, canSave, handleSave } =
    useAddService({ propertyId });

  return (
    <div className="flex flex-col gap-5">
      <FormField label="Service type">
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {serviceTypes.map((st) => {
            const { color, Icon } = getServiceTypeVisuals(st.code as TServiceTypeCode);
            const label = t(st.code as Parameters<typeof t>[0]);
            return (
              <ServiceTypeCard
                key={st.id}
                id={st.id}
                Icon={Icon}
                color={color}
                label={label}
                isSelected={selectedTypeId === st.id}
                isDisabled={existingSet.has(st.id)}
                onClick={() => selectType(st.id as TServiceTypeId)}
              />
            );
          })}
        </div>
      </FormField>

      <FormField label="Notes" optional>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about this service…"
          maxLength={SERVICE_LIMITS.notes}
          rows={3}
        />
      </FormField>

      {formError && <p className="text-destructive -mt-2 text-sm">{formError}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} disabled={!canSave || isSaving}>
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Adding…
            </>
          ) : (
            "Add service"
          )}
        </Button>
      </div>
    </div>
  );
};
