import type { ComponentProps } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type TProps = Pick<ComponentProps<typeof Button>, "variant" | "size" | "className"> & {
  text: string;
  href: string;
  icon?: LucideIcon;
};

export const LinkButton = ({
  text,
  href,
  icon: Icon,
  variant = "outline",
  size = "sm",
  ...buttonProps
}: TProps) => (
  <Button asChild variant={variant} size={size} {...buttonProps}>
    <Link href={href}>
      {Icon && <Icon />}
      {text}
    </Link>
  </Button>
);
