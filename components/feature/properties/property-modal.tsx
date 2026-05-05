"use client";

import { useEffect, useState } from "react";
import { Building2, Home, Loader2, MapPin, Trees, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ACCENT, DESTRUCTIVE } from "@/lib/constants/ui-tokens";
import { propertySchema } from "@/lib/validation/property";
import { createProperty, updateProperty } from "@/lib/actions/properties";

type TPropertyType = "apartment" | "house" | "cottage" | "other";

type TPropertyForEdit = {
  id: string;
  name: string;
  type: TPropertyType;
  address: string | null;
  notes: string | null;
};

type TProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: TPropertyForEdit;
  onCreated?: (id: string) => void;
};

type TFormState = {
  name: string;
  type: TPropertyType | "";
  address: string;
  notes: string;
};

const TYPE_OPTIONS = [
  { value: "apartment" as TPropertyType, Icon: Building2 },
  { value: "house" as TPropertyType, Icon: Home },
  { value: "cottage" as TPropertyType, Icon: Trees },
  { value: "other" as TPropertyType, Icon: MapPin },
] as const;

const makeInitialState = (property?: TPropertyForEdit): TFormState => ({
  name: property?.name ?? "",
  type: property?.type ?? "",
  address: property?.address ?? "",
  notes: property?.notes ?? "",
});

const PropertyModal = ({ open, onOpenChange, property, onCreated }: TProps) => {
  const t = useTranslations("properties");
  const [form, setForm] = useState<TFormState>(() => makeInitialState(property));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setForm(makeInitialState(property));
        setErrors({});
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open, property]);

  const set = (key: keyof TFormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const isEditMode = property !== undefined;
  const canSave = form.name.trim() !== "" && form.type !== "";

  const handleSave = async () => {
    const result = propertySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      const response = isEditMode
        ? await updateProperty(property.id, result.data)
        : await createProperty(result.data);

      if (!response.ok) {
        toast.error(response.error);
        return;
      }

      toast.success(t(isEditMode ? "toast.updated" : "toast.added"));
      onOpenChange(false);
      if (!isEditMode) onCreated?.(response.data.id);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[480px] gap-0 rounded-[10px] p-0 shadow-[0_20px_60px_rgba(9,9,11,0.18),0_4px_16px_rgba(9,9,11,0.10)] sm:max-w-[480px]"
      >
        {/* Header */}
        <div
          className="border-b border-zinc-200 dark:border-zinc-800"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
          }}
        >
          <DialogTitle style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, margin: 0 }}>
            {t(isEditMode ? "modal.edit.title" : "modal.add.title")}
          </DialogTitle>
          <DialogClose
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <X size={16} className="text-zinc-500 dark:text-zinc-400" />
          </DialogClose>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name */}
          <div>
            <label
              style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}
              className="text-zinc-950 dark:text-zinc-50"
            >
              {t("fields.name.label")}
            </label>
            <Input
              autoFocus
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder={t("fields.name.placeholder")}
              maxLength={100}
              style={
                form.name !== ""
                  ? {
                      borderColor: "var(--field-tint-border)",
                      background: "var(--field-tint-bg)",
                      fontWeight: 500,
                    }
                  : undefined
              }
              className="h-9"
            />
            {errors.name && (
              <p style={{ color: DESTRUCTIVE, fontSize: 12, marginTop: 4 }}>{t(errors.name)}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label
              style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 8 }}
              className="text-zinc-950 dark:text-zinc-50"
            >
              {t("fields.type.label")}
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TYPE_OPTIONS.map(({ value, Icon }) => {
                const isSelected = form.type === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set("type")(value)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      padding: "10px 8px",
                      borderRadius: 8,
                      border: `1px solid ${isSelected ? "var(--field-tint-border)" : "var(--type-card-border)"}`,
                      background: isSelected ? "var(--field-tint-bg)" : "var(--type-card-bg)",
                      cursor: "pointer",
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    <Icon
                      size={20}
                      style={{
                        color: isSelected ? "var(--field-tint-fg)" : "var(--muted-foreground)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: isSelected ? 500 : 400,
                        color: isSelected ? "var(--field-tint-fg)" : "var(--muted-foreground)",
                      }}
                    >
                      {t(`type.${value}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}
              className="text-zinc-950 dark:text-zinc-50"
            >
              {t("fields.address.label")}{" "}
              <span className="text-zinc-500 dark:text-zinc-400" style={{ fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <Input
              value={form.address}
              onChange={(e) => set("address")(e.target.value)}
              placeholder={t("fields.address.placeholder")}
              maxLength={200}
              style={
                form.address !== ""
                  ? {
                      borderColor: "var(--field-tint-border)",
                      background: "var(--field-tint-bg)",
                      fontWeight: 500,
                    }
                  : undefined
              }
              className="h-9"
            />
            {errors.address && (
              <p style={{ color: DESTRUCTIVE, fontSize: 12, marginTop: 4 }}>{t(errors.address)}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label
              style={{ fontSize: 13.5, fontWeight: 500, display: "block", marginBottom: 6 }}
              className="text-zinc-950 dark:text-zinc-50"
            >
              {t("fields.notes.label")}{" "}
              <span className="text-zinc-500 dark:text-zinc-400" style={{ fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              placeholder={t("fields.notes.placeholder")}
              maxLength={1000}
              rows={3}
            />
            {errors.notes && (
              <p style={{ color: DESTRUCTIVE, fontSize: 12, marginTop: 4 }}>{t(errors.notes)}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 24px",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <DialogClose
            className="border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            style={{
              height: 34,
              padding: "0 16px",
              fontSize: 14,
              fontFamily: "inherit",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {t("modal.cancel")}
          </DialogClose>
          <button
            onClick={handleSave}
            disabled={isSaving || !canSave}
            className={
              isSaving || !canSave
                ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                : ""
            }
            style={{
              height: 34,
              padding: "0 18px",
              fontSize: 14,
              fontFamily: "inherit",
              border: "none",
              borderRadius: 6,
              cursor: isSaving || !canSave ? "default" : "pointer",
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              ...(!isSaving && canSave ? { background: ACCENT, color: "#fff" } : {}),
            }}
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : (
              t(isEditMode ? "modal.edit.submit" : "modal.add.submit")
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { PropertyModal };
export type { TPropertyForEdit };
