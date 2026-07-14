import { type ReactNode } from "react";

export const FieldHint = ({ children }: { children: ReactNode }) => (
  <span className="text-muted-foreground text-xs">{children}</span>
);
