"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreateContractFormContent } from "@/features/contracts";
import { useCreateContractForm } from "@/features/contracts/components/create-contract-modal/hooks/use-create-contract-form";
import type { TProvider } from "@/lib/db/schema/providers";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  serviceId: TServiceId;
  providers: TProvider[];
};

export const NewContractForm = ({ serviceId, providers }: TProps) => {
  const t = useTranslations("contracts");
  const router = useRouter();
  const { form, errors, formError, set, handleSave, isSaving, canSave } = useCreateContractForm({
    serviceId,
  });

  return (
    <div className="flex flex-col gap-6">
      <CreateContractFormContent
        form={form}
        errors={errors}
        formError={formError}
        set={set}
        providers={providers}
      />
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={!canSave || isSaving}>
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : (
            t("modal.add.submit")
          )}
        </Button>
        <Button variant="outline" onClick={() => router.back()} disabled={isSaving}>
          {t("modal.cancel")}
        </Button>
      </div>
    </div>
  );
};
