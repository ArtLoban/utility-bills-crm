"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { softDeleteProvider } from "@/features/providers";
import { ROUTES } from "@/lib/routes";
import type { TProvider } from "@/lib/db/schema/providers";

type TProps = {
  provider: TProvider;
};

export const ProviderRow = ({ provider }: TProps) => {
  const router = useRouter();
  const t = useTranslations("providers");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await softDeleteProvider(provider.id);
      if (!result.ok) {
        if (result.error.name === "ValidationError") {
          const key = result.error.message as Parameters<typeof t>[0];
          toast.error(t(key));
        } else {
          toast.error(t("toast.deleteError"));
        }
        setConfirmOpen(false);
        return;
      }
      toast.success(t("toast.deleted"));
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-card flex items-center justify-between rounded-lg border p-4 shadow-[0_1px_2px_rgba(24,24,27,0.05)]">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-medium">{provider.name}</span>
          <div className="text-muted-foreground flex gap-3 text-xs">
            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground truncate transition-colors"
              >
                {provider.website}
              </a>
            )}
            {provider.phone && <span>{provider.phone}</span>}
          </div>
          {provider.notes && (
            <span className="text-muted-foreground mt-0.5 truncate text-xs">{provider.notes}</span>
          )}
        </div>

        <div className="ml-4 flex shrink-0 items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" asChild>
            <Link href={`${ROUTES.providers}/${provider.id}/edit`}>
              <Pencil size={14} />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive h-8 w-8"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("delete.title")}
        tone="destructive"
        icon={<Trash2 size={28} />}
        description={
          <>
            {t("delete.descriptionPrefix")} <strong>{provider.name}</strong>?
          </>
        }
        warningText={t("delete.description")}
        confirmLabel={t("delete.menuItem")}
        confirmIcon={<Trash2 size={14} />}
        isPending={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
};
