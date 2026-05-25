import { Info } from "lucide-react";
import { format, subDays } from "date-fns";

type TAccountNumberFormFields = {
  value: string;
  setValue: (v: string) => void;
  changeDate: string;
  setChangeDate: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
};

type TProps = { fields: TAccountNumberFormFields };

const AccountNumberForm = ({ fields }: TProps) => {
  const closingDate = fields.changeDate
    ? format(subDays(new Date(fields.changeDate), 1), "MMM d, yyyy")
    : null;
  const openingDate = fields.changeDate ? format(new Date(fields.changeDate), "MMM d, yyyy") : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Effective date */}
      <div>
        <label
          className="mb-1.5 block text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 13.5, fontWeight: 500 }}
        >
          Effective from
        </label>
        <input
          type="date"
          value={fields.changeDate}
          onChange={(e) => fields.setChangeDate(e.target.value)}
          className="w-full text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          style={{
            height: 34,
            padding: "0 10px",
            fontSize: 13.5,
            borderRadius: 6,
            border: "1px solid #e4e4e7",
            outline: "none",
          }}
        />
      </div>

      {/* Account number */}
      <div>
        <label
          className="mb-1.5 block text-zinc-950 dark:text-zinc-50"
          style={{ fontSize: 13.5, fontWeight: 500 }}
        >
          New account number
        </label>
        <input
          type="text"
          value={fields.value}
          onChange={(e) => fields.setValue(e.target.value)}
          placeholder="e.g. UA21 3006 5000 0002 6007 3300 1"
          className="w-full text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          style={{
            height: 34,
            padding: "0 10px",
            fontSize: 13.5,
            borderRadius: 6,
            border: "1px solid #e4e4e7",
            outline: "none",
            fontFeatureSettings: '"tnum" 1',
          }}
        />
      </div>

      {/* Notes */}
      <div>
        <label
          className="mb-1.5 block text-zinc-500 dark:text-zinc-400"
          style={{ fontSize: 13, fontWeight: 500 }}
        >
          Notes (optional)
        </label>
        <textarea
          value={fields.notes}
          onChange={(e) => fields.setNotes(e.target.value)}
          rows={2}
          className="w-full resize-none text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          style={{
            padding: "8px 10px",
            fontSize: 13,
            borderRadius: 6,
            border: "1px solid #e4e4e7",
            outline: "none",
          }}
        />
      </div>

      {/* Info callout */}
      {closingDate && openingDate && (
        <div
          className="flex items-start gap-2.5 rounded-[8px] border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20"
          style={{ padding: "12px 14px" }}
        >
          <Info size={15} className="mt-px shrink-0 text-blue-500 dark:text-blue-400" />
          <p
            className="text-blue-800 dark:text-blue-300"
            style={{ fontSize: 12.5, margin: 0, lineHeight: 1.5 }}
          >
            The old account number will be closed on <strong>{closingDate}</strong>. New number
            applies from <strong>{openingDate}</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export { AccountNumberForm };
