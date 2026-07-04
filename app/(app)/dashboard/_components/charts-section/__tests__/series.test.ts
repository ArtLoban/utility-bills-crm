import { describe, expect, it } from "vitest";

import type { TMonthlyExpensesAggregate, TServiceExpenseRow } from "@/features/ledger";
import type { TServiceId } from "@/lib/db/schema/services";
import {
  SERVICE_TYPE_CODES,
  SERVICE_TYPE_COLORS,
  type TServiceTypeCode,
} from "@/features/services/service-type";

import { buildChartSeries } from "../series";
import { CUSTOM_SERIES_COLORS } from "../constants";

// Fake branded service id for fixtures.
const sid = (v: string): TServiceId => v as TServiceId;

// Minimal stand-in for the next-intl "services.types" translator.
const makeTranslator = (dict: Partial<Record<TServiceTypeCode, string>>) => {
  const t = ((code: TServiceTypeCode): string => dict[code] ?? code) as ((
    code: TServiceTypeCode,
  ) => string) & { has: (code: TServiceTypeCode) => boolean };
  t.has = (code: TServiceTypeCode): boolean => code in dict;
  return t;
};

const t = makeTranslator({
  [SERVICE_TYPE_CODES.ELECTRICITY]: "Electricity",
  [SERVICE_TYPE_CODES.OTHER]: "Other",
});

const aggregate = (services: TServiceExpenseRow[]): TMonthlyExpensesAggregate => ({
  months: ["2025-01-01"],
  services,
});

describe("buildChartSeries", () => {
  it("resolves a regular type series to its type label, semantic color and type drill", () => {
    const [series] = buildChartSeries(
      aggregate([
        {
          kind: "type",
          key: "electricity",
          code: SERVICE_TYPE_CODES.ELECTRICITY,
          monthlyAmounts: [100],
        },
      ]),
      t,
    );

    expect(series).toEqual({
      key: "electricity",
      label: "Electricity",
      color: SERVICE_TYPE_COLORS[SERVICE_TYPE_CODES.ELECTRICITY],
      drill: { kind: "type", code: "electricity" },
    });
  });

  it("resolves a custom series to its name, a palette color and a service drill", () => {
    const [series] = buildChartSeries(
      aggregate([
        {
          kind: "custom",
          key: "svc-1",
          serviceId: sid("svc-1"),
          name: "Garage",
          monthlyAmounts: [50],
        },
      ]),
      t,
    );

    expect(series).toEqual({
      key: "svc-1",
      label: "Garage",
      color: CUSTOM_SERIES_COLORS[0],
      drill: { kind: "custom", serviceId: sid("svc-1") },
    });
  });

  it("gives each custom series a distinct palette color by index", () => {
    const result = buildChartSeries(
      aggregate([
        { kind: "custom", key: "a", serviceId: sid("a"), name: "A", monthlyAmounts: [1] },
        { kind: "custom", key: "b", serviceId: sid("b"), name: "B", monthlyAmounts: [1] },
      ]),
      t,
    );

    expect(result.map((s) => s.color)).toEqual([CUSTOM_SERIES_COLORS[0], CUSTOM_SERIES_COLORS[1]]);
  });

  it("only custom series advance the palette index; type series in between do not", () => {
    const result = buildChartSeries(
      aggregate([
        { kind: "custom", key: "a", serviceId: sid("a"), name: "A", monthlyAmounts: [1] },
        {
          kind: "type",
          key: "electricity",
          code: SERVICE_TYPE_CODES.ELECTRICITY,
          monthlyAmounts: [1],
        },
        { kind: "custom", key: "b", serviceId: sid("b"), name: "B", monthlyAmounts: [1] },
      ]),
      t,
    );

    expect(result.map((s) => s.color)).toEqual([
      CUSTOM_SERIES_COLORS[0],
      SERVICE_TYPE_COLORS[SERVICE_TYPE_CODES.ELECTRICITY],
      CUSTOM_SERIES_COLORS[1],
    ]);
  });

  it("cycles the palette when custom series exceed its length", () => {
    const many: TServiceExpenseRow[] = Array.from(
      { length: CUSTOM_SERIES_COLORS.length + 1 },
      (_, i) => ({
        kind: "custom",
        key: `s${i}`,
        serviceId: sid(`s${i}`),
        name: `S${i}`,
        monthlyAmounts: [1],
      }),
    );

    const colors = buildChartSeries(aggregate(many), t).map((s) => s.color);

    expect(colors[CUSTOM_SERIES_COLORS.length]).toBe(CUSTOM_SERIES_COLORS[0]);
  });

  it("falls back to the type label for a custom series with no name", () => {
    const [series] = buildChartSeries(
      aggregate([
        { kind: "custom", key: "svc-x", serviceId: sid("svc-x"), name: null, monthlyAmounts: [1] },
      ]),
      t,
    );

    expect(series!.label).toBe("Other");
  });
});
