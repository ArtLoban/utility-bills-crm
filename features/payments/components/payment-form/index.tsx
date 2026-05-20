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
import type { TPaymentFormValues, TPropertyOption, TServiceOption } from "../../types";

const FILLED_STYLE: React.CSSProperties = {
  borderColor: "var(--field-tint-border)",
  background: "var(--field-tint-bg)",
  fontWeight: 500,
};

type TProps = {
  form: UseFormReturn<TPaymentFormValues>;
  properties: TPropertyOption[];
  services: TServiceOption[];
  selectedPropertyId: string;
  onPropertyChange: (id: string) => void;
};

export const PaymentForm = ({
  form,
  properties,
  services,
  selectedPropertyId,
  onPropertyChange,
}: TProps) => (
  <Form {...form}>
    <div className="flex flex-col gap-4">
      {/* Property is a UI-only filter — not saved, not validated */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="payment-property">Property</Label>
        <Select
          value={selectedPropertyId || null}
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
              value={field.value || null}
              onValueChange={(val) => {
                if (val) field.onChange(val);
              }}
              disabled={!selectedPropertyId}
            >
              <FormControl>
                <SelectTrigger className="w-full" style={field.value ? FILLED_STYLE : undefined}>
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
              <Input
                type="date"
                {...field}
                style={field.value ? FILLED_STYLE : undefined}
                className="h-9"
              />
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
                style={field.value > 0 ? FILLED_STYLE : undefined}
                className="h-9"
              />
            </FormControl>
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
              Notes <span className="font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
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
