import { type ReactNode } from "react";

type TProps = {
  children: ReactNode;
};

export const FieldAdornment = ({ children }: TProps) => (
  <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
    {children}
  </span>
);
