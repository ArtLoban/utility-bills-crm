"use server";

import type { TPropertyInput } from "@/lib/validation/property";

type TPropertyType = "apartment" | "house" | "cottage" | "other";

type TProperty = {
  id: string;
  name: string;
  type: TPropertyType;
  address: string | null;
  notes: string | null;
};

type TResult<T> = { ok: true; data: T } | { ok: false; error: string };

// TODO: replace with real DB insert when properties table is implemented
// On success, also insert propertyAccess row granting creator 'owner' role (same transaction)
export const createProperty = async (input: TPropertyInput): Promise<TResult<TProperty>> => {
  await new Promise((r) => setTimeout(r, 400));
  return {
    ok: true,
    data: {
      id: `mock-${Date.now()}`,
      name: input.name,
      type: input.type as TPropertyType,
      address: input.address || null,
      notes: input.notes || null,
    },
  };
};

// TODO: replace with real DB update when properties table is implemented
// TODO: verify propertyRole === 'owner' before allowing update (editors and viewers cannot edit metadata)
export const updateProperty = async (
  id: string,
  input: TPropertyInput,
): Promise<TResult<TProperty>> => {
  await new Promise((r) => setTimeout(r, 400));
  return {
    ok: true,
    data: {
      id,
      name: input.name,
      type: input.type as TPropertyType,
      address: input.address || null,
      notes: input.notes || null,
    },
  };
};
