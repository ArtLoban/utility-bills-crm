import { describe, expect, it } from "vitest";

import { db } from "@/lib/db/client";
import { serviceTypes } from "@/lib/db/schema/service-types";
import { SERVICE_TYPE_CODES } from "@/lib/constants/service-types";

describe("SERVICE_TYPE_CODES", () => {
  it("matches service_types rows in the DB — divergence means a migration was added without updating the enum", async () => {
    const rows = await db.select({ code: serviceTypes.code }).from(serviceTypes);

    const dbCodes = rows.map((r) => r.code).sort();
    const enumCodes = Object.values(SERVICE_TYPE_CODES).slice().sort();

    expect(dbCodes).toEqual(enumCodes);
  });
});
