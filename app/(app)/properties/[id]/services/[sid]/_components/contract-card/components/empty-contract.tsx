import { SectionCardEmpty } from "@/components/section-card-empty";
import { FileText } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { SectionCard } from "@/components/section-card";
import { useTranslations } from "next-intl";

type TProps = {
  canEdit: boolean;
  href: string;
};

export const EmptyContract = ({ canEdit, href }: TProps) => {
  const t = useTranslations("services.detail.contract");

  return (
    <SectionCard title={t("title")}>
      <SectionCardEmpty
        icon={FileText}
        caption={t("empty")}
        action={canEdit && <LinkButton href={href} text={t("addContract")} size="default" />}
      />
    </SectionCard>
  );
};
