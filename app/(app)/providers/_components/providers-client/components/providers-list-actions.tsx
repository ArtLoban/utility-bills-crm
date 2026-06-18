import { createSafeContext } from "@/lib/utils/create-safe-context";
import type { TProvider } from "@/lib/db/schema";
import { ReactNode, useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { softDeleteProvider } from "@/features/providers";
import { ERROR_CODES } from "@/lib/errors";
import { toast } from "sonner";
import { IconBadge } from "@/components/icon-badge";
import { Modal } from "@/components/modal";

type TProviderActionsContext = {
  requestDelete: (provider: TProvider) => void;
};

const [ProviderActionsContext, useProviderActions] =
  createSafeContext<TProviderActionsContext>("ProviderActions");

export { useProviderActions };

export const ProvidersListActions = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const t = useTranslations("providers");
  const [itemToDelete, setItemToDelete] = useState<TProvider | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (itemToDelete === null) return;

    setIsDeleting(true);

    try {
      const result = await softDeleteProvider(itemToDelete.id);

      if (!result.ok) {
        if (result.error.code === ERROR_CODES.VALIDATION) {
          const key = result.error.message as Parameters<typeof t>[0];
          toast.error(t(key));
        } else {
          toast.error(t("toast.deleteError"));
        }
        setItemToDelete(null);
        return;
      }
      toast.success(t("toast.deleted"));
      setItemToDelete(null);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProviderActionsContext value={{ requestDelete: setItemToDelete }}>
      {children}
      <Modal
        title={t("delete.title")}
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        onConfirm={handleDelete}
        variant="destructiveStrong"
        confirmIcon={Trash2}
        confirmLabel={t("delete.menuItem")}
        isSaving={isDeleting}
      >
        <div className="my-3 flex flex-col items-center gap-4">
          <IconBadge icon={Trash2} color="var(--destructive)" size="lg" border={true} />
          <p className="text-center text-sm">
            {t("delete.descriptionPrefix")} <strong>{itemToDelete?.name}</strong>?
          </p>
          <p className="text-destructive text-sm leading-snug font-semibold">
            {t("delete.description")}
          </p>
        </div>
      </Modal>
    </ProviderActionsContext>
  );
};
