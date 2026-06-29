"use client";

import { type UseFormReturn } from "react-hook-form";

import { Activity, Blocks, Sparkles } from "lucide-react";

import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import type { TProjectPayload } from "@/features/landing-cms";

import { CardSubBlock } from "./card-sub-block";
import { CmsSection } from "./cms-section";
import { FieldHint } from "./field-hint";
import { SaveRow } from "./save-row";

// projectSchema guarantees exactly six architecture cards (z.tuple of 6); literal
// indices keep the `archCards.N.*` field names typed without a cast.
const ARCH_INDICES = [0, 1, 2, 3, 4, 5] as const;

type TProps = {
  form: UseFormReturn<TProjectPayload>;
  onSave: () => void;
};

export const ProjectTab = ({ form, onSave }: TProps) => {
  const { isDirty, isSubmitting } = form.formState;

  const heroTitle = form.watch("heroTitle");
  const heroDesc = form.watch("heroDesc");
  const status = form.watch("status");

  return (
    <Form {...form}>
      <CmsSection
        icon={<Sparkles className="size-[14px]" />}
        title="Hero"
        description="Top of the project page — intro to the deep-dive."
      >
        <FormTextField
          control={form.control}
          name="heroTitle"
          label="Hero title"
          labelAccessory={<FieldHint>{heroTitle.length} chars</FieldHint>}
          className="mb-4"
        />
        <FormTextareaField
          control={form.control}
          name="heroDesc"
          label="Hero description"
          labelAccessory={<FieldHint>{heroDesc.length} chars</FieldHint>}
          description="Supports **bold** and `code` markers."
          rows={4}
        />
      </CmsSection>

      <CmsSection
        icon={<Blocks className="size-[14px]" />}
        title="Architecture highlights"
        description="Six cards explaining the key technical decisions."
      >
        <div className="grid grid-cols-1 gap-3.5">
          {ARCH_INDICES.map((i) => (
            <CardSubBlock
              key={i}
              index={i + 1}
              control={form.control}
              titleName={`archCards.${i}.title`}
              bodyName={`archCards.${i}.body`}
            />
          ))}
        </div>
      </CmsSection>

      <CmsSection
        icon={<Activity className="size-[14px]" />}
        title="Current status"
        description="Where the project stands right now."
      >
        <FormTextareaField
          control={form.control}
          name="status"
          label="Status"
          labelAccessory={<FieldHint>{status.length} chars</FieldHint>}
          description="Separate paragraphs with a blank line. Supports **bold** and `code` markers."
          rows={5}
        />
      </CmsSection>

      <SaveRow isDirty={isDirty} isSaving={isSubmitting} onSave={onSave} />
    </Form>
  );
};
