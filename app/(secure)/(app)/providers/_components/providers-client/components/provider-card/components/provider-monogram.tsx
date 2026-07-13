import { getMonogramColor } from "../utils/get-monogram-color";

type TProps = {
  seed: string;
  letter: string;
};

export const ProviderMonogram = ({ seed, letter }: TProps) => {
  const color = getMonogramColor(seed);

  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-xl text-base leading-none font-semibold select-none sm:size-11 sm:text-lg"
      style={{ color, background: `color-mix(in oklch, ${color} 13%, transparent)` }}
      aria-hidden="true"
    >
      {letter}
    </div>
  );
};
