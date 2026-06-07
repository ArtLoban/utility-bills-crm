"use client";

import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "next-themes";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";

export const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      position="bottom-right"
      theme={resolvedTheme as ToasterProps["theme"]}
      closeButton
      icons={{
        success: <CircleCheck size={18} style={{ color: "var(--success)" }} />,
        error: <CircleX size={18} style={{ color: "var(--destructive)" }} />,
        warning: <TriangleAlert size={18} style={{ color: "var(--warning)" }} />,
        info: <Info size={18} style={{ color: "var(--primary)" }} />,
        close: <X size={14} />,
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--foreground)",
          "--toast-close-button-start": "unset",
          "--toast-close-button-end": "0",
          "--toast-close-button-transform": "translate(35%, -35%)",
        } as CSSProperties
      }
      {...props}
    />
  );
};
