const AVATAR_PALETTE = [
  { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200" },
  { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
] as const;

type TAvatarColor = (typeof AVATAR_PALETTE)[number];

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const getAvatarColor = (userId: string): TAvatarColor =>
  AVATAR_PALETTE[hashString(userId) % AVATAR_PALETTE.length]!;
