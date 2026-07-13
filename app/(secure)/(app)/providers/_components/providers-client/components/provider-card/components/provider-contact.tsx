import { Globe, Phone } from "lucide-react";
import { toExternalHref } from "../utils/to-external-href";

type TProps = {
  phone: string | null;
  website: string | null;
};

export const ProviderContact = ({ phone, website }: TProps) => {
  if (!phone && !website) return null;

  return (
    <div className="mb-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
      {phone && (
        <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm leading-none whitespace-nowrap">
          <Phone size={12} />
          {phone}
        </span>
      )}
      {website && (
        <a
          href={toExternalHref(website)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center gap-1.5 text-sm leading-none whitespace-nowrap hover:underline"
        >
          <Globe size={12} />
          {website}
        </a>
      )}
    </div>
  );
};
