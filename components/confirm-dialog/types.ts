import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type TTone = "destructive" | "warning" | "info";

export type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  tone?: TTone;
  icon: LucideIcon;

  entityPreview?: ReactNode;
  description: ReactNode;
  secondaryText?: ReactNode;
  warningText?: ReactNode;
  children?: ReactNode;
  requireType?: string;

  confirmLabel: string;
  confirmIcon?: LucideIcon;
  cancelLabel: string | null;
  isPending?: boolean;
  onConfirm: () => void;
};
