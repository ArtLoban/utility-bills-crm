import type { TTone } from "./types";

type TToneConfig = {
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  confirmBg: string;
};

export const TONE_CONFIG: Record<TTone, TToneConfig> = {
  destructive: {
    iconBg: "var(--confirm-destructive-icon-bg)",
    iconBorder: "var(--confirm-destructive-icon-border)",
    iconColor: "var(--destructive)",
    confirmBg: "var(--destructive)",
  },
  warning: {
    iconBg: "var(--confirm-warning-icon-bg)",
    iconBorder: "var(--confirm-warning-icon-border)",
    iconColor: "var(--confirm-warning-accent)",
    confirmBg: "var(--confirm-warning-accent)",
  },
  info: {
    iconBg: "var(--confirm-info-icon-bg)",
    iconBorder: "var(--confirm-info-icon-border)",
    iconColor: "var(--primary)",
    confirmBg: "var(--primary)",
  },
};
