import { AlertTriangle } from "lucide-react";

type TProps = {
  children: React.ReactNode;
  warning?: boolean;
};

const HintText = ({ children, warning = false }: TProps) => (
  <div
    className={!warning ? "text-zinc-500 dark:text-zinc-400" : undefined}
    style={{
      marginTop: 6,
      fontSize: 12.5,
      display: "flex",
      alignItems: "flex-start",
      gap: 6,
      lineHeight: 1.4,
      ...(warning ? { color: "#d97706" } : {}),
    }}
  >
    {warning && <AlertTriangle size={13} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />}
    <span>{children}</span>
  </div>
);

export { HintText };
