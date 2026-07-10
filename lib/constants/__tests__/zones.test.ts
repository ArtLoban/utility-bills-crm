import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";
import ru from "@/messages/ru.json";
import uk from "@/messages/uk.json";
import {
  ZONE_LABEL_KEYS,
  ZONE_SHORT_TAGS,
  ZONE_SUMMARY_KEYS,
  tariffZoneCount,
  zoneLabelKeys,
  zoneSummaryKey,
} from "../zones";

describe("tariffZoneCount", () => {
  it("returns 1 when only T1 is populated", () => {
    expect(tariffZoneCount({ rateT2: null, rateT3: null })).toBe(1);
  });

  it("returns 2 when T1 and T2 are populated", () => {
    expect(tariffZoneCount({ rateT2: "1.5", rateT3: null })).toBe(2);
  });

  it("returns 3 when all three zones are populated", () => {
    expect(tariffZoneCount({ rateT2: "1.5", rateT3: "0.8" })).toBe(3);
  });
});

describe("zoneLabelKeys / zoneSummaryKey — number → typed maps", () => {
  it("maps counts 1/2/3 to their label-key arrays", () => {
    expect(zoneLabelKeys(1)).toEqual(["single"]);
    expect(zoneLabelKeys(2)).toEqual(["t1Day", "t2Night"]);
    expect(zoneLabelKeys(3)).toEqual(["t1Peak", "t2Shoulder", "t3OffPeak"]);
  });

  it("maps counts 1/2/3 to their summary keys", () => {
    expect(zoneSummaryKey(1)).toBe("summary.single");
    expect(zoneSummaryKey(2)).toBe("summary.two");
    expect(zoneSummaryKey(3)).toBe("summary.three");
  });

  it("falls back to the single-zone entry for out-of-range counts", () => {
    expect(zoneLabelKeys(0)).toEqual(["single"]);
    expect(zoneSummaryKey(9)).toBe("summary.single");
  });
});

describe("ZONE_LABEL_KEYS — ordering and canonical labels (en)", () => {
  it("orders 2-zone keys as day/night", () => {
    expect(ZONE_LABEL_KEYS[2]).toEqual(["t1Day", "t2Night"]);
    expect([en.zones.t1Day, en.zones.t2Night]).toEqual(["T1 — Day", "T2 — Night"]);
  });

  it("orders 3-zone keys as peak/shoulder/off-peak", () => {
    expect(ZONE_LABEL_KEYS[3]).toEqual(["t1Peak", "t2Shoulder", "t3OffPeak"]);
    expect([en.zones.t1Peak, en.zones.t2Shoulder, en.zones.t3OffPeak]).toEqual([
      "T1 — Peak",
      "T2 — Shoulder",
      "T3 — Off-peak",
    ]);
  });

  it("uses the single-rate label for one zone", () => {
    expect(ZONE_LABEL_KEYS[1]).toEqual(["single"]);
    expect(en.zones.single).toBe("Single rate");
  });
});

describe("zone-count summaries (en)", () => {
  it("maps each count to its canonical summary string", () => {
    expect(ZONE_SUMMARY_KEYS).toEqual({
      1: "summary.single",
      2: "summary.two",
      3: "summary.three",
    });
    expect(en.zones.summary.single).toBe("Single zone");
    expect(en.zones.summary.two).toBe("2 zones (Day, Night)");
    expect(en.zones.summary.three).toBe("3 zones (Peak, Shoulder, Off-peak)");
  });
});

describe("short tier tags", () => {
  it("exposes count-independent T1/T2/T3 tags", () => {
    expect(ZONE_SHORT_TAGS).toEqual(["T1", "T2", "T3"]);
  });
});

describe("locale completeness — every canon key exists in en/ru/uk", () => {
  const locales = { en, ru, uk };
  const labelKeys = [...new Set(Object.values(ZONE_LABEL_KEYS).flat())];
  const summaryLeaves = Object.values(ZONE_SUMMARY_KEYS)
    .map((path) => path.split(".")[1])
    .filter((leaf): leaf is string => leaf !== undefined);

  for (const [name, messages] of Object.entries(locales)) {
    const zones = messages.zones as Record<string, unknown>;
    const summary = zones.summary as Record<string, unknown>;

    it(`${name} has every zone label key`, () => {
      for (const key of labelKeys) {
        expect(typeof zones[key], `${name}.zones.${key}`).toBe("string");
      }
    });

    it(`${name} has every summary key`, () => {
      for (const leaf of summaryLeaves) {
        expect(typeof summary[leaf], `${name}.zones.summary.${leaf}`).toBe("string");
      }
    });
  }
});
