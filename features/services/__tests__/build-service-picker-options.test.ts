import { describe, expect, it } from "vitest";

import {
  buildServicePickerOptions,
  type TServicePickerSource,
} from "../build-service-picker-options";
import { SERVICE_TYPE_CODES, type TServiceTypeCode } from "../service-type";

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

const source = (
  over: Partial<TServicePickerSource> & Pick<TServicePickerSource, "id">,
): TServicePickerSource => ({
  name: null,
  typeCode: SERVICE_TYPE_CODES.ELECTRICITY,
  providerName: null,
  accountNumber: null,
  ...over,
});

describe("buildServicePickerOptions", () => {
  it("resolves the label and attaches no secondary when labels are unique", () => {
    const options = buildServicePickerOptions(
      [
        source({ id: "a", typeCode: SERVICE_TYPE_CODES.ELECTRICITY }),
        source({ id: "b", name: "Apartment insurance", typeCode: SERVICE_TYPE_CODES.OTHER }),
      ],
      t,
    );

    expect(options).toEqual([
      { id: "a", name: "Electricity" },
      { id: "b", name: "Apartment insurance" },
    ]);
  });

  it("disambiguates a colliding label by provider name", () => {
    const options = buildServicePickerOptions(
      [
        source({ id: "a", providerName: "PowerCo", accountNumber: "111" }),
        source({ id: "b", providerName: "GridCo", accountNumber: "222" }),
      ],
      t,
    );

    expect(options).toEqual([
      { id: "a", name: "Electricity", secondary: "PowerCo" },
      { id: "b", name: "Electricity", secondary: "GridCo" },
    ]);
  });

  it("falls back to account number when a colliding option has no provider", () => {
    const options = buildServicePickerOptions(
      [source({ id: "a", accountNumber: "ACC-1" }), source({ id: "b", accountNumber: "ACC-2" })],
      t,
    );

    expect(options).toEqual([
      { id: "a", name: "Electricity", secondary: "ACC-1" },
      { id: "b", name: "Electricity", secondary: "ACC-2" },
    ]);
  });

  it("falls back to the type label when a colliding option has no provider or account", () => {
    const options = buildServicePickerOptions([source({ id: "a" }), source({ id: "b" })], t);

    expect(options).toEqual([
      { id: "a", name: "Electricity", secondary: "Electricity" },
      { id: "b", name: "Electricity", secondary: "Electricity" },
    ]);
  });

  it("disambiguates two services sharing the same custom name", () => {
    const options = buildServicePickerOptions(
      [
        source({
          id: "a",
          name: "Insurance",
          typeCode: SERVICE_TYPE_CODES.OTHER,
          providerName: "AlphaIns",
        }),
        source({
          id: "b",
          name: "Insurance",
          typeCode: SERVICE_TYPE_CODES.OTHER,
          providerName: "BetaIns",
        }),
      ],
      t,
    );

    expect(options).toEqual([
      { id: "a", name: "Insurance", secondary: "AlphaIns" },
      { id: "b", name: "Insurance", secondary: "BetaIns" },
    ]);
  });

  it("only disambiguates the colliding pair, leaving a unique sibling untouched", () => {
    const options = buildServicePickerOptions(
      [
        source({ id: "a", providerName: "PowerCo" }),
        source({ id: "b", providerName: "GridCo" }),
        source({ id: "c", name: "Apartment insurance", typeCode: SERVICE_TYPE_CODES.OTHER }),
      ],
      t,
    );

    expect(options).toEqual([
      { id: "a", name: "Electricity", secondary: "PowerCo" },
      { id: "b", name: "Electricity", secondary: "GridCo" },
      { id: "c", name: "Apartment insurance" },
    ]);
  });
});
