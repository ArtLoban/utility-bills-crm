"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import { SuccessIcon, ErrorIcon, InfoIcon, CloseIcon } from "./icons";

export const AppToaster = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={resolvedTheme as "light" | "dark"}
      closeButton
      icons={{
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        info: <InfoIcon />,
        close: <CloseIcon />,
      }}
    />
  );
};
