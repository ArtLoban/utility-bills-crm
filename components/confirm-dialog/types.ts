import type { ReactNode } from "react";

export type TTone = "destructive" | "warning" | "info";

export type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  tone?: TTone;
  icon: ReactNode;
  entityPreview?: ReactNode;
  description: ReactNode;
  secondaryText?: ReactNode;
  warningText?: ReactNode;

  requireType?: string;

  confirmLabel?: string;
  confirmIcon?: ReactNode;
  cancelLabel?: string | null;
  closeButton?: boolean;

  isPending?: boolean;
  onConfirm: () => void;
};
