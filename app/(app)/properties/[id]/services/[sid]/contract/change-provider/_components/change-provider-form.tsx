"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChangeProviderFormContent } from "@/features/contracts";
import { useChangeProviderForm } from "@/features/contracts/components/change-provider-modal/hooks/use-change-provider-form";
import type { ProviderId, TProvider } from "@/lib/db/schema/providers";
import type { TServiceId } from "@/lib/db/schema/services";

type TProps = {
  serviceId: TServiceId;
  currentProviderId: ProviderId;
  providers: TProvider[];
};

export const ChangeProviderForm = ({ serviceId, currentProviderId, providers }: TProps) => {
  const t = useTranslations("contracts");
  const router = useRouter();
  const { form, errors, formError, set, handleSave, isSaving, canSave } = useChangeProviderForm({
    serviceId,
  });

  const availableProviders = providers.filter((p) => p.id !== currentProviderId);

  return (
    <div className="flex flex-col gap-6">
      <ChangeProviderFormContent
        form={form}
        errors={errors}
        formError={formError}
        set={set}
        providers={providers}
        currentProviderId={currentProviderId}
      />
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={!canSave || isSaving || availableProviders.length === 0}
        >
          {isSaving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : (
            t("modal.changeProvider.submit")
          )}
        </Button>
        <Button variant="outline" onClick={() => router.back()} disabled={isSaving}>
          {t("modal.cancel")}
        </Button>
      </div>
    </div>
  );
};
