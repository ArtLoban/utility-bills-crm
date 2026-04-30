import { AVATAR_PALETTE } from "../constants";

type TProps = { name: string; size?: number; idx?: number };

export const Avatar = ({ name, size = 36, idx = 0 }: TProps) => {
  // idx % 4 guarantees in-bounds access; noUncheckedIndexedAccess requires the assertion
  const palette = AVATAR_PALETTE[idx % 4]!;
  const words = name.trim().split(/\s+/);
  const initials = ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{
        width: size,
        height: size,
        background: palette.bg,
        color: palette.color,
        fontSize: size * 0.35,
        letterSpacing: -0.3,
      }}
    >
      {initials}
    </div>
  );
};
