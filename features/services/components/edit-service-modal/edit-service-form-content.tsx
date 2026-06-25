"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/form-field";
import { SERVICE_LIMITS } from "@/features/services/schema";
import type { TServiceId } from "@/lib/db/schema/services";
import { useEditService } from "./hooks/use-edit-service";

type TProps = {
  serviceId: TServiceId;
  initialNotes: string | null;
};

export const EditServiceFormContent = ({ serviceId, initialNotes }: TProps) => {
  const router = useRouter();
  const { notes, setNotes, formError, isSaving, handleSave } = useEditService({
    serviceId,
    initialNotes,
  });

  return (
    <div className="flex flex-col gap-5">
      <FormField label="Notes" optional>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about this service…"
          maxLength={SERVICE_LIMITS.notes}
          rows={4}
        />
      </FormField>

      {formError && <p className="text-destructive -mt-2 text-sm">{formError}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : (
            "Save notes"
          )}
        </Button>
      </div>
    </div>
  );
};
