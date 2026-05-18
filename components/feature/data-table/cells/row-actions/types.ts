import type { ReactNode } from "react";

type TBaseRowAction = {
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
};

type TItemRowAction = TBaseRowAction & {
  kind?: "item";
  onSelect: () => void;
};

type TLinkRowAction = TBaseRowAction & {
  kind: "link";
  href: string;
};

type TSeparatorRowAction = {
  kind: "separator";
};

export type TRowAction = TItemRowAction | TLinkRowAction | TSeparatorRowAction;
