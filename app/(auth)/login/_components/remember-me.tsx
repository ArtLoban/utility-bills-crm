type TProps = {
  label: string;
};

export const RememberMe = ({ label }: TProps) => (
  <label className="group mb-5 flex cursor-pointer items-center gap-2 text-[13px] text-zinc-500 select-none dark:text-zinc-400">
    <input type="checkbox" name="rememberMe" className="sr-only" />
    <span className="flex size-4 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] border-zinc-300 bg-white transition-all group-has-[:checked]:border-violet-600 group-has-[:checked]:bg-violet-600 dark:border-zinc-700 dark:bg-zinc-950">
      <svg
        width="9"
        height="9"
        viewBox="0 0 12 12"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden group-has-[:checked]:block"
        aria-hidden="true"
      >
        <path d="M2 6l3 3 5-5" />
      </svg>
    </span>
    {label}
  </label>
);
