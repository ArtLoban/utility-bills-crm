"use client";

import { useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { signOutAllDevices } from "@/lib/auth/actions";
import { useActionErrorHandler } from "@/lib/hooks/use-action-error-handler";
import { IconBadge } from "@/components/icon-badge";
import { Modal } from "@/components/modal";

import { SettingsCardBody, SettingsCardHeader } from "./settings-card-parts";
import { GoogleGIcon } from "./google-g-icon";
import { Surface } from "@/components/surface";

type TProps = {
  email: string | null;
};

export const AccountSection = ({ email }: TProps) => {
  const t = useTranslations("settings.account");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const handleError = useActionErrorHandler({ onClose: () => setDialogOpen(false) });

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await signOutAllDevices();
      if (result && !result.ok) {
        handleError(result.error);
        setDialogOpen(false);
      }
    });
  };

  return (
    <>
      <Surface>
        <SettingsCardHeader title={t("title")} description={t("description")} />
        <SettingsCardBody>
          <div className="border-border bg-muted/50 flex items-center gap-3 rounded-lg border p-3">
            <GoogleGIcon />
            <div>
              <div className="text-muted-foreground text-xs">{t("google.badge")}</div>
              <div className="text-foreground text-sm font-medium">{email ?? "—"}</div>
            </div>
          </div>

          <div>
            <div className="text-foreground mb-1 text-sm font-medium">{t("sessions.title")}</div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("sessions.comingSoon")}
            </p>
          </div>

          <hr className="border-border" />

          <div>
            <div className="text-foreground mb-1.5 text-sm font-semibold">
              {t("signOutEverywhere.title")}
            </div>
            <p className="text-muted-foreground mb-3.5 text-sm leading-relaxed">
              {t("signOutEverywhere.description")}
            </p>
            <Button variant="destructive" size="lg" onClick={() => setDialogOpen(true)}>
              {t("signOutEverywhere.button")}
            </Button>
          </div>
        </SettingsCardBody>
      </Surface>

      <Modal
        title={t("signOutEverywhere.dialog.title")}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirm}
        variant="warning"
        confirmIcon={LogOut}
        confirmLabel={t("signOutEverywhere.dialog.confirm")}
        isSaving={isPending}
      >
        <div className="my-3 flex flex-col items-center gap-4">
          <IconBadge icon={LogOut} color="var(--warning)" size="xl" border={true} />
          <p className="text-center text-sm">{t("signOutEverywhere.dialog.description")}</p>
          <p className="text-muted-foreground text-sm">
            {t("signOutEverywhere.dialog.secondaryText")}
          </p>
        </div>
      </Modal>
    </>
  );
};
