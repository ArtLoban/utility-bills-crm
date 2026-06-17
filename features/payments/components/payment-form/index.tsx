"use client";

import { type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormatMoney } from "@/lib/format/use-format-money";
import type { TBalance } from "@/features/ledger/types";
import type { TPaymentFormValues } from "../../types";

type TPropertyItem = { id: string; name: string };
type TServiceItem = { id: string; name: string };

type TProps = {
  form: UseFormReturn<TPaymentFormValues>;
  properties: TPropertyItem[];
  services: TServiceItem[];
  selectedPropertyId: string;
  onPropertyChange: (id: string) => void;
  currentDebt?: TBalance | null;
};

export const PaymentForm = ({
  form,
  properties,
  services,
  selectedPropertyId,
  onPropertyChange,
  currentDebt,
}: TProps) => {
  const formatMoney = useFormatMoney();

  return (
    <Form {...form}>
      <div className="flex flex-col gap-3.5">
        {/* Property is a UI-only filter — selects which services to show; not validated */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="payment-property">Property</Label>
          <Select
            value={selectedPropertyId || undefined}
            onValueChange={(val) => {
              if (val) onPropertyChange(val);
            }}
          >
            <SelectTrigger id="payment-property" className="w-full">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select
                value={field.value || undefined}
                onValueChange={(val) => {
                  if (val) field.onChange(val);
                }}
                disabled={!selectedPropertyId}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={selectedPropertyId ? "Select service" : "Select property first"}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paidAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0.01}
                  step={0.01}
                  placeholder="e.g. 680"
                  value={field.value > 0 ? field.value : ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  className="h-9"
                />
              </FormControl>
              {currentDebt !== null && currentDebt !== undefined && currentDebt.balance > 0 && (
                <p className="text-muted-foreground text-[12.5px]">
                  Current debt: {formatMoney(currentDebt.balance)}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Notes <span className="text-muted-foreground font-normal">(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Any remarks…" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};
