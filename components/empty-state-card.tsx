import { Card } from "@/components/ui/card";

type TProps = {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
  cta?: React.ReactNode;
  hint?: React.ReactNode;
};

const EmptyStateCard = ({ icon, title, body, cta, hint }: TProps) => {
  return (
    <div className="flex justify-center pt-10">
      <Card className="flex w-full max-w-[440px] flex-col items-center gap-[18px] rounded-lg px-8 py-14 text-center">
        <div
          className="flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800"
          style={{ width: 72, height: 72 }}
        >
          {icon}
        </div>

        <div className="flex flex-col items-center gap-0">
          <p
            className="font-semibold text-zinc-950 dark:text-zinc-50"
            style={{ fontSize: 18, letterSpacing: -0.3 }}
          >
            {title}
          </p>
          <p className="mt-2 leading-relaxed text-zinc-500" style={{ fontSize: 14 }}>
            {body}
          </p>
        </div>

        {cta && <div className="mt-1">{cta}</div>}
        {hint && (
          <p className="text-zinc-500" style={{ fontSize: 12.5 }}>
            {hint}
          </p>
        )}
      </Card>
    </div>
  );
};

export { EmptyStateCard };
