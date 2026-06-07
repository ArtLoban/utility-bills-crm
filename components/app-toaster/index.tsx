"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import { CircleCheck, CircleX, Info, X } from "lucide-react";

export const AppToaster = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={resolvedTheme as "light" | "dark"}
      closeButton
      icons={{
        success: <CircleCheck size={18} />,
        error: <CircleX size={18} />,
        info: <Info size={18} />,
        close: <X size={14} />,
      }}
    />
  );
};
