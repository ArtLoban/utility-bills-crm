import { Breadcrumbs } from "@/components/breadcrumbs";

import type { TMeterDetail } from "../_data/mock";
import { ReplaceMeterButton } from "./replace-meter-button";
import { OverflowMenu } from "./overflow-menu";

type TProps = { meter: TMeterDetail };

const MeterPageHeader = ({ meter }: TProps) => (
  <div style={{ marginBottom: 28 }}>
    <Breadcrumbs
      items={[
        { label: "Properties", href: "/properties" },
        { label: meter.propertyName, href: "/properties/1" },
        { label: "Meters", href: "/properties/1/meters" },
        { label: "Electricity meter" },
      ]}
    />

    <div className="flex flex-wrap items-start justify-between" style={{ gap: 16 }}>
      <div>
        <h1
          className="text-zinc-950 dark:text-zinc-50"
          style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.1 }}
        >
          Electricity meter
        </h1>
        <p
          className="text-zinc-500 dark:text-zinc-400"
          style={{ margin: "7px 0 0", fontSize: 13.5 }}
        >
          <span>{meter.zones}-zone</span>
          <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">·</span>
          <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12.5 }}>
            Serial {meter.serialNumber}
          </span>
          <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">·</span>
          <span>Installed {meter.installedAt}</span>
        </p>
      </div>

      <div className="flex shrink-0 items-center" style={{ gap: 8 }}>
        <ReplaceMeterButton meter={meter} />
        <OverflowMenu />
      </div>
    </div>
  </div>
);

export { MeterPageHeader };
