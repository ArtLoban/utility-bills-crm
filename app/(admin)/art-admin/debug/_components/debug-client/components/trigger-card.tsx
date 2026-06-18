import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type TProps = {
  title: string;
  description: ReactNode;
  buttonLabel: string;
  onTrigger: () => void;
  pending?: boolean;
  variant?: "destructive" | "secondary";
};

export const TriggerCard = ({
  title,
  description,
  buttonLabel,
  onTrigger,
  pending = false,
  variant = "secondary",
}: TProps) => (
  <Card className="gap-3">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription className="leading-relaxed">{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Button variant={variant} size="lg" onClick={onTrigger} disabled={pending}>
        {buttonLabel}
      </Button>
    </CardContent>
  </Card>
);
