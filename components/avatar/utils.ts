const AVATAR_SLOTS = 4;

export const slotFromSeed = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;

  return Math.abs(hash) % AVATAR_SLOTS;
};

export const initialsOf = (name: string): string => {
  const [first, second] = name.trim().split(/\s+/);

  return ((first?.[0] ?? "") + (second?.[0] ?? "")).toUpperCase();
};
