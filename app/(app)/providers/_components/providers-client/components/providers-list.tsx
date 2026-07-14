import { ProviderCard } from "@/app/(app)/providers/_components/providers-client/components/provider-card";
import type { TProviderWithUsage } from "@/app/(app)/providers/_data/queries";
import { ProvidersListActions } from "./providers-list-actions";

type TProps = {
  providers: TProviderWithUsage[];
};

export const ProvidersList = ({ providers }: TProps) => (
  <ProvidersListActions>
    <div className="flex flex-col gap-2.5">
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  </ProvidersListActions>
);
