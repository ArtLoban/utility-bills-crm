import { TPropertyDetail } from "@/app/(app)/properties/_data/mock";
import { PageMeta } from "@/components/page-meta";

type TProps = {
  property: TPropertyDetail;
};

export const PropertyMeta = ({ property }: TProps) => {
  const { address, serviceCount, createdAt } = property;

  return <PageMeta items={[address, `${serviceCount} services`, `Created ${createdAt}`]} />;
};
