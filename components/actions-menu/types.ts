import type { ReactNode } from "react";

type TBaseAction = {
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
};

type TItemAction = TBaseAction & {
  kind?: "item";
  onSelect: () => void;
};

type TLinkAction = TBaseAction & {
  kind: "link";
  href: string;
};

type TSeparatorAction = {
  kind: "separator";
};

export type TAction = TItemAction | TLinkAction | TSeparatorAction;
