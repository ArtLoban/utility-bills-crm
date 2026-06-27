import { initialsOf, slotFromSeed } from "./utils";

type TProps = {
  name: string;
  seed?: string;
  size?: number;
};

export const Avatar = ({ name, seed, size = 36 }: TProps) => {
  const slot = slotFromSeed(seed ?? name);

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{
        width: size,
        height: size,
        background: `var(--avatar-${slot}-bg)`,
        color: `var(--avatar-${slot}-fg)`,
        fontSize: size * 0.35,
        letterSpacing: -0.3,
      }}
    >
      {initialsOf(name)}
    </div>
  );
};
