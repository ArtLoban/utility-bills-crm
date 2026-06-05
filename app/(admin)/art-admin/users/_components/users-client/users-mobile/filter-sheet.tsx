"use client";

import { X } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SYSTEM_ROLES } from "@/lib/auth/constants";

type TFilterSelectProps = {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: { id: string; name: string }[];
  placeholder: string;
};

const FilterSelect = ({ label, value, onChange, options, placeholder }: TFilterSelectProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium">{label}</label>
    <Select value={value || ""} onValueChange={(v) => onChange(v === "__clear__" ? null : v)}>
      <SelectTrigger className="w-full rounded-lg">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__clear__">{placeholder}</SelectItem>
        {options.map(({ id, name }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const FilterSheet = ({ open, onOpenChange }: TProps) => {
  const [query, setQuery] = useQueryStates(
    { systemRole: parseAsString, status: parseAsString },
    { history: "replace", shallow: false },
  );

  const handleClear = () => {
    void setQuery({ systemRole: null, status: null });
    onOpenChange(false);
  };

  const roleOptions = [
    { id: SYSTEM_ROLES.ADMIN, name: "Admin" },
    { id: SYSTEM_ROLES.USER, name: "User" },
  ];

  const statusOptions = [
    { id: "deleted", name: "Deleted" },
    { id: "all", name: "All users" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="gap-0 rounded-t-[14px] p-0">
        <div className="flex justify-center pt-2.5">
          <div className="h-1 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>

        <div className="px-4 pb-6">
          <div className="flex items-center justify-between py-3">
            <SheetTitle>Filters</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close">
                <X size={16} className="text-muted-foreground" />
              </Button>
            </SheetClose>
          </div>

          <div className="flex flex-col gap-3.5">
            <FilterSelect
              label="Role"
              value={query.systemRole}
              onChange={(v) => void setQuery({ systemRole: v })}
              options={roleOptions}
              placeholder="All roles"
            />
            <FilterSelect
              label="Status"
              value={query.status}
              onChange={(v) => void setQuery({ status: v })}
              options={statusOptions}
              placeholder="Active (default)"
            />
          </div>

          <div className="mt-5 flex gap-2.5">
            <Button variant="outline" className="flex-1" onClick={handleClear}>
              Clear filters
            </Button>
            <Button className="flex-[2]" onClick={() => onOpenChange(false)}>
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
