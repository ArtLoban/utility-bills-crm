import { ProviderCard } from "@/app/(app)/providers/_components/providers-client/components/provider-card";
import type { TProviderWithUsage } from "@/app/(app)/providers/_data/queries";
import { ProvidersListActions } from "@/app/(app)/providers/_components/providers-client/components/providers-list-actions";

type TProps = {
  providers: TProviderWithUsage[];
};

export const Providers = ({ providers }: TProps) => {
  return (
    <ProvidersListActions>
      <div className="flex flex-col gap-2.5">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </ProvidersListActions>
  );
};
