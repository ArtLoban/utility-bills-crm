import { MOCK_METER_DETAIL, MOCK_METER_FOR_READING, MOCK_READINGS } from "./_data/mock";
import { ConsumptionChart } from "./_components/consumption-chart";
import { DetailsCard } from "./_components/details-card";
import { MeterPageHeader } from "./_components/meter-page-header";
import { ReadingsSection } from "./_components/readings-section";

const SectionHeading = ({ children }: { children: string }) => (
  <div style={{ marginBottom: 12 }}>
    <h2
      className="text-zinc-950 dark:text-zinc-50"
      style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}
    >
      {children}
    </h2>
  </div>
);

export default function MeterPage() {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 32px 80px", width: "100%" }}>
      <MeterPageHeader meter={MOCK_METER_DETAIL} />

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Details */}
        <div>
          <SectionHeading>Details</SectionHeading>
          <DetailsCard meter={MOCK_METER_DETAIL} />
        </div>

        {/* Readings */}
        <ReadingsSection readings={MOCK_READINGS} readingMeter={MOCK_METER_FOR_READING} />

        {/* Consumption */}
        <div>
          <SectionHeading>Consumption</SectionHeading>
          <ConsumptionChart readings={MOCK_READINGS} />
          <p
            className="text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 12, margin: "8px 0 0", textAlign: "right" }}
          >
            Raw meter readings over time · kWh
          </p>
        </div>
      </div>
    </div>
  );
}
