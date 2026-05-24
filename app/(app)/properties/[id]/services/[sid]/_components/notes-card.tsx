import Link from "next/link";
import { Pencil } from "lucide-react";

import type { TPropertyRole } from "@/lib/db/schema/properties";

type TProps = {
  notes: string | null;
  editHref: string;
  role: TPropertyRole;
};

const NotesCard = ({ notes, editHref, role }: TProps) => (
  <div
    className="rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    style={{ boxShadow: "0 1px 2px rgba(24,24,27,0.05)" }}
  >
    <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
      <span
        className="text-zinc-950 dark:text-zinc-50"
        style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: -0.1 }}
      >
        Notes
      </span>
      {role !== "viewer" && (
        <Link
          href={editHref}
          className="flex items-center justify-center rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          style={{ width: 30, height: 30 }}
        >
          <Pencil size={13} className="text-zinc-500 dark:text-zinc-400" />
        </Link>
      )}
    </div>

    <div style={{ padding: "0 20px 20px" }}>
      {notes ? (
        <p
          className="text-zinc-700 dark:text-zinc-300"
          style={{ fontSize: 13.5, lineHeight: 1.65, whiteSpace: "pre-wrap", margin: "16px 0 0" }}
        >
          {notes}
        </p>
      ) : (
        <p
          className="text-zinc-400 dark:text-zinc-600"
          style={{ fontSize: 13.5, fontStyle: "italic", margin: "16px 0 0" }}
        >
          No notes added yet.
        </p>
      )}
    </div>
  </div>
);

export { NotesCard };
