import {
  ALL_PROPERTIES,
  ACTIVE_COUNT,
  DELETED_COUNT,
} from "@/app/(admin)/art-admin/properties/_data/mock";

const PropertiesFooter = () => (
  <div
    className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50"
    style={{ padding: "14px 16px" }}
  >
    <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13.5 }}>
      {ALL_PROPERTIES.length} properties · {ACTIVE_COUNT} active · {DELETED_COUNT} soft-deleted
    </span>
    <span className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 13 }}>
      1 / 1
    </span>
  </div>
);

export { PropertiesFooter };
