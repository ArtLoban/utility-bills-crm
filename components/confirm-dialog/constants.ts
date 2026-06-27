import type { TModalVariant } from "@/components/modal";
import type { TTone } from "./types";

export const TONE_ICON_COLOR: Record<TTone, string> = {
  destructive: "var(--destructive)",
  warning: "var(--warning)",
  info: "var(--primary)",
};

export const TONE_VARIANT: Record<TTone, TModalVariant> = {
  destructive: "destructiveStrong",
  warning: "warning",
  info: "default",
};
