import { type ReactNode } from "react";

type TProps = {
  children: ReactNode;
  hint?: string;
  htmlFor?: string;
};

export const FieldLabel = ({ children, hint, htmlFor }: TProps) => (
  <div className="mb-1.5 flex items-baseline justify-between">
    <label htmlFor={htmlFor} className="text-foreground text-[13.5px] font-medium">
      {children}
    </label>
    {hint && <span className="text-muted-foreground text-xs">{hint}</span>}
  </div>
);
