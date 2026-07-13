import { hashString } from "@/lib/utils/hash-string";

const MONOGRAM_PALETTE = [
  "var(--amber-500)",
  "var(--red-500)",
  "var(--blue-500)",
  "var(--pink-500)",
  "var(--violet-500)",
  "var(--teal-500)",
] as const;

export const getMonogramColor = (seed: string): string =>
  MONOGRAM_PALETTE[hashString(seed) % MONOGRAM_PALETTE.length]!;
