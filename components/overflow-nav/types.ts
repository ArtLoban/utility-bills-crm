import type { ReactNode } from "react";

export type TOverflowNavItem = {
  href: string;
  label: string;
  active: boolean;
};

export type TOverflowNavProps = {
  items: TOverflowNavItem[];
  renderInline: (item: TOverflowNavItem) => ReactNode;
  renderMenuItem: (item: TOverflowNavItem) => ReactNode;
  moreLabel: string;
  triggerAccentClassName?: string;
  className?: string;
};
