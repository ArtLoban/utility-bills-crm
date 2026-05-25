import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type TProps = {
  href: string;
  text: string;
};

export const AddButton = ({ href, text }: TProps) => {
  return (
    <Button asChild>
      <Link href={href}>
        <Plus />
        {text}
      </Link>
    </Button>
  );
};
