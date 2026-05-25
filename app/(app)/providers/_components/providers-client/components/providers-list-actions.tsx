import { createSafeContext } from "@/lib/utils/create-safe-context";
import type { TProvider } from "@/lib/db/schema";
import { ReactNode, useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { softDeleteProvider } from "@/features/providers";
import { toast } from "sonner";

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
        if (result.error.name === "ValidationError") {
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
      <ConfirmDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title={t("delete.title")}
        tone="destructive"
        icon={<Trash2 size={28} />}
        description={
          <>
            {t("delete.descriptionPrefix")} <strong>{itemToDelete?.name}</strong>?
          </>
        }
        warningText={t("delete.description")}
        confirmLabel={t("delete.menuItem")}
        confirmIcon={<Trash2 size={14} />}
        isPending={isDeleting}
        onConfirm={handleDelete}
      />
    </ProviderActionsContext>
  );
};
