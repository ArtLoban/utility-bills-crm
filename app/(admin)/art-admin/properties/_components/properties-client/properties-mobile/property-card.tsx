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
import { TProperty } from "@/app/(admin)/art-admin/properties/_data/mock";

type TProps = { row: TProperty };

const formatOwners = (owners: TProperty["owners"]): string => {
  const primary = owners[0];
  if (!primary) return "";
  if (owners.length === 1) return primary.name;
  return `${primary.name} (+${owners.length - 1})`;
};

const PropertyCard = ({ row }: TProps) => {
  const isDeleted = row.status === "deleted";

  return (
    <div
      className={`border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none ${isDeleted ? "opacity-60" : ""}`}
      style={{ borderRadius: 8, padding: 14 }}
    >
      {/* Top row: name + kebab */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: -0.1,
            textDecoration: isDeleted ? "line-through" : "none",
          }}
        >
          {row.name}
        </span>
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
              flexShrink: 0,
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
      </div>

      {/* Owner */}
      <p className="text-zinc-500 dark:text-zinc-400" style={{ fontSize: 12.5, marginTop: 3 }}>
        {formatOwners(row.owners)}
      </p>

      {/* Meta row: type · services · created */}
      <p className="text-zinc-400 dark:text-zinc-600" style={{ fontSize: 12, marginTop: 2 }}>
        {row.type} · {row.servicesCount} services · {row.createdDisplay}
      </p>

      {/* Deleted badge */}
      {isDeleted && (
        <div style={{ marginTop: 8 }}>
          <Badge
            variant="outline"
            className="border-red-200 text-red-600 dark:border-red-900 dark:text-red-400"
          >
            Deleted
          </Badge>
        </div>
      )}
    </div>
  );
};

export { PropertyCard };
