import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { RECORD_STATUS } from "@/lib/types/record-status";
import { TProperty } from "@/app/(admin)/art-admin/properties/_data/mock";

type TProps = {
  row: TProperty;
  isLast: boolean;
};

const formatOwners = (owners: TProperty["owners"]): string => {
  const primary = owners[0];
  if (!primary) return "";
  if (owners.length === 1) return primary.name;
  return `${primary.name} (+${owners.length - 1})`;
};

const PropertyRow = ({ row, isLast }: TProps) => {
  const isDeleted = row.status === RECORD_STATUS.DELETED;
  const tdBorderClass = isLast ? "" : "border-b border-zinc-200 dark:border-zinc-800";
  const tdBaseClass = `${tdBorderClass} text-zinc-950 dark:text-zinc-50`;

  const tdStyle: React.CSSProperties = {
    padding: "13px 16px",
    fontSize: 13.5,
  };

  return (
    <tr
      className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${isDeleted ? "opacity-60" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <td className={tdBaseClass} style={{ ...tdStyle, fontWeight: 500 }}>
        <span style={{ textDecoration: isDeleted ? "line-through" : "none" }}>{row.name}</span>
      </td>
      <td className={tdBaseClass} style={tdStyle}>
        {formatOwners(row.owners)}
      </td>
      <td className={tdBaseClass} style={tdStyle}>
        {row.type}
      </td>
      <td className={tdBaseClass} style={tdStyle}>
        {isDeleted ? (
          <Badge
            variant="outline"
            className="border-red-200 text-red-600 dark:border-red-900 dark:text-red-400"
          >
            Deleted
          </Badge>
        ) : (
          <span className="text-zinc-500 dark:text-zinc-400">Active</span>
        )}
      </td>
      <td
        className={tdBorderClass}
        style={{
          ...tdStyle,
          textAlign: "right",
          fontFeatureSettings: '"tnum" 1',
        }}
      >
        {row.servicesCount}
      </td>
      <td className={`${tdBorderClass} text-zinc-500 dark:text-zinc-400`} style={tdStyle}>
        {row.createdDisplay}
      </td>
      <td
        className={tdBorderClass}
        style={{ ...tdStyle, width: 48, textAlign: "right" }}
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            style={{
              width: 28,
              height: 28,
              borderRadius: 5,
              border: "1px solid transparent",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="data-[state=open]:border-zinc-200 data-[state=open]:bg-zinc-100 dark:data-[state=open]:border-zinc-700 dark:data-[state=open]:bg-zinc-800"
          >
            <MoreHorizontal
              size={15}
              strokeWidth={1.75}
              className="text-zinc-950 dark:text-zinc-50"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href={`/art-admin/properties/${row.id}`}>View details</Link>
            </DropdownMenuItem>
            {!isDeleted && (
              <DropdownMenuItem asChild>
                <Link href={`/properties/${row.id}`}>Go to property</Link>
              </DropdownMenuItem>
            )}
            {isDeleted && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Restore</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">Delete permanently</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export { PropertyRow };
