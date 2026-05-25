import { ProviderRow } from "@/app/(app)/providers/_components/providers-client/components/provider-row";
import type { TProvider } from "@/lib/db/schema";
import { ProvidersListActions } from "@/app/(app)/providers/_components/providers-client/components/providers-list-actions";

type TProps = {
  providers: TProvider[];
};

export const Providers = ({ providers }: TProps) => {
  return (
    <ProvidersListActions>
      <div className="flex flex-col gap-2">
        {providers.map((provider) => (
          <ProviderRow key={provider.id} provider={provider} />
        ))}
      </div>
    </ProvidersListActions>
  );
};
