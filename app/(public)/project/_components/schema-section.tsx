import { getTranslations } from "next-intl/server";

const SCHEMA_TREE = `User
├── PropertyAccess (role: owner / editor / viewer)
└── Property
    ├── Service (electricity, gas, water, …)
    │   ├── Contract (provider, period)
    │   │   ├── Tariff (rates over time)
    │   │   ├── AccountNumber (over time)
    │   │   └── PaymentDetails (over time)
    │   ├── Bill (period, amount)
    │   └── Payment (date, amount)
    └── Meter (physical device)
        └── Reading (date, value(s))`;

export const SchemaSection = async () => {
  const t = await getTranslations("landing");

  return (
    <section className="bg-zinc-100/45 py-24 dark:bg-zinc-900/80">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto max-w-[640px]">
          <h2 className="mb-6 text-[clamp(22px,2.5vw,30px)] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-zinc-50">
            {t("project.schema.sectionTitle")}
          </h2>
          <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-white px-7 py-6 font-mono text-sm leading-[1.8] text-zinc-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:shadow-none">
            {SCHEMA_TREE}
          </pre>
          <p className="mt-4 text-sm text-zinc-500">{t("project.schema.caption")}</p>
        </div>
      </div>
    </section>
  );
};
