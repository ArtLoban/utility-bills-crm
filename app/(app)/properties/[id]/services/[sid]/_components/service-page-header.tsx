import type { ReactNode } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ROUTES } from "@/lib/routes";
import { getServiceTypeDisplay } from "@/lib/constants/service-types";
import type { TPropertyRole } from "@/lib/db/schema/properties";
import type { TService } from "@/lib/db/schema/services";
import type { TServiceType } from "@/lib/db/schema/service-types";

type TProps = {
  service: TService;
  serviceType: TServiceType;
  role: TPropertyRole;
  propertyId: string;
  propertyName: string;
  // Slot for client-side action controls (e.g. DeleteServiceAction).
  // Rendered to the right of "Edit notes" when role >= editor.
  extraActions?: ReactNode;
};

const ServicePageHeader = async ({
  service,
  serviceType,
  role,
  propertyId,
  propertyName,
  extraActions,
}: TProps) => {
  const t = await getTranslations("services.types");
  const name = t(serviceType.code as Parameters<typeof t>[0]);
  const { color, Icon } = getServiceTypeDisplay(serviceType.code);
  const canEdit = role !== "viewer";
  const editHref = `/properties/${propertyId}/services/${service.id}/edit`;

  return (
    <div style={{ marginBottom: 28 }}>
      <Breadcrumbs
        items={[
          { label: "Home", href: ROUTES.home },
          { label: propertyName, href: `${ROUTES.properties}/${propertyId}` },
          { label: name },
        ]}
      />

      <div className="flex items-center gap-4">
        <div
          className="flex shrink-0 items-center justify-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: color + "18",
            border: `1.5px solid ${color}30`,
          }}
        >
          <Icon size={22} style={{ color }} />
        </div>

        <div className="min-w-0 flex-1">
          <h1
            className="text-zinc-950 dark:text-zinc-50"
            style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, margin: 0 }}
          >
            {name}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13.5, margin: 0 }}>
            {propertyName}
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            <Link
              href={editHref}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-950 no-underline dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              style={{ height: 32, padding: "0 12px" }}
            >
              <Pencil size={13} />
              Edit notes
            </Link>
            {extraActions}
          </div>
        )}
      </div>
    </div>
  );
};

export { ServicePageHeader };
