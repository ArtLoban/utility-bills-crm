type TProps = {
  worksWith: string;
};

export const ProseSection = ({ worksWith }: TProps) => {
  const paragraphs = worksWith.split(/\n\n+/).filter(Boolean);

  return (
    <section className="border-border relative overflow-hidden border-t py-14 md:py-[88px]">
      {/* Glow — bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          bottom: "-180px",
          left: "-120px",
          width: "680px",
          height: "560px",
          background: "radial-gradient(at 30% 70%, var(--section-glow) 0%, transparent 64%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-4 md:px-6">
        <div className="flex max-w-[640px] flex-col gap-[22px] md:mx-auto">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-[19px] leading-[1.75] font-medium text-zinc-900 dark:text-zinc-50"
                  : "text-base leading-[1.75] text-zinc-500"
              }
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
