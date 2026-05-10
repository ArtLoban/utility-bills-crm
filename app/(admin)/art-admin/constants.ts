import { type ElementType } from "react";
import { Archive, Home, Receipt, Users } from "lucide-react";

type TStatCardConfig = {
  icon: ElementType;
  iconColor: string;
  value: string;
  label: string;
};

// denote: value - это мок значение!
export const STAT_CARDS: TStatCardConfig[] = [
  { icon: Users, iconColor: "#7c3aed", value: "12", label: "Total users" },
  { icon: Home, iconColor: "#71717a", value: "11", label: "Active properties" },
  { icon: Receipt, iconColor: "#0284c7", value: "1,847", label: "Bills recorded" },
  { icon: Archive, iconColor: "#d97706", value: "7", label: "Soft-deleted items" },
];
