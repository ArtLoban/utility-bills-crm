import { Plus } from "lucide-react";
import { LinkButton } from "@/components/link-button";

type TProps = {
  href: string;
  text: string;
};

export const AddButton = ({ href, text }: TProps) => (
  <LinkButton href={href} icon={Plus} text={text} variant="default" size="default" />
);
