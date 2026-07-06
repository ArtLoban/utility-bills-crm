// Deterministic string hash: the classic `hash * 31 + charCode` fold, kept as an unsigned
// 32-bit integer. Same input always yields the same output across runs and machines, which is
// what lets callers derive stable pseudo-values from a key (seed jitter, winter severity) without
// Math.random. Not cryptographic — distribution quality is "good enough for buckets/noise" only.
//
// Tech debt: a private copy of this algorithm still lives in lib/utils/avatar-color.ts
// (`hashString`) and components/avatar/utils.ts (`slotFromSeed`). Converging them onto this shared
// util is a later cleanup slice — out of scope here.
export const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
};
