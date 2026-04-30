import { MoreHorizontal, Pencil } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SERVICE_COLORS } from "@/lib/constants/service-colors";
import { SERVICE_ICONS } from "@/lib/constants/service-icons";
import type { TServiceDetail } from "../_data/mock";

type TProps = { serviceDetail: TServiceDetail };

const ServicePageHeader = ({ serviceDetail }: TProps) => {
  const { serviceKey, name, providerShort, propertyName } = serviceDetail;
  const color = SERVICE_COLORS[serviceKey];
  const Icon = SERVICE_ICONS[serviceKey];

  return (
    <div style={{ marginBottom: 28 }}>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: propertyName, href: "/properties/1" },
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
            {providerShort} · {propertyName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* devnote: wire Edit notes button to NotesEditModal when implemented */}
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white text-[13px] font-medium text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{ height: 32, padding: "0 12px" }}
          >
            <Pencil size={13} />
            Edit notes
          </button>
          {/* devnote: wire ⋮ to DropdownMenu when kebab actions are defined */}
          <button
            className="flex cursor-pointer items-center justify-center rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            style={{ width: 30, height: 30 }}
          >
            <MoreHorizontal size={15} className="text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { ServicePageHeader };
