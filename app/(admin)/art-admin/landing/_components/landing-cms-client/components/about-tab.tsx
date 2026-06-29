"use client";

import { type UseFormReturn } from "react-hook-form";

import { Briefcase, User } from "lucide-react";

import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import type { TAboutPayload } from "@/features/landing-cms";

import { CmsSection } from "./cms-section";
import { FieldHint } from "./field-hint";
import { SaveRow } from "./save-row";

type TProps = {
  form: UseFormReturn<TAboutPayload>;
  onSave: () => void;
};

export const AboutTab = ({ form, onSave }: TProps) => {
  const { isDirty, isSubmitting } = form.formState;

  const heroGreeting = form.watch("heroGreeting");
  const heroDesc = form.watch("heroDesc");
  const heroText = form.watch("heroText");
  const worksWithTitle = form.watch("worksWithTitle");
  const worksWith = form.watch("worksWith");
  const paragraphCount = worksWith.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  return (
    <Form {...form}>
      <CmsSection
        icon={<User className="size-[14px]" />}
        title="Hero"
        description="Top of the about page — three lines of personal intro."
      >
        <FormTextField
          control={form.control}
          name="heroGreeting"
          label="Hero greeting"
          labelAccessory={<FieldHint>{heroGreeting.length} chars</FieldHint>}
          className="mb-4"
        />
        <FormTextareaField
          control={form.control}
          name="heroDesc"
          label="Hero description"
          labelAccessory={<FieldHint>{heroDesc.length} chars</FieldHint>}
          description="Supports **bold** and `code` markers."
          rows={2}
          className="mb-4"
        />
        <FormTextField
          control={form.control}
          name="heroText"
          label="Hero text"
          labelAccessory={<FieldHint>{heroText.length} chars</FieldHint>}
        />
      </CmsSection>

      <CmsSection
        icon={<Briefcase className="size-[14px]" />}
        title="What I work with"
        description="Title line followed by body paragraphs separated by blank lines."
      >
        <FormTextareaField
          control={form.control}
          name="worksWithTitle"
          label="Title"
          labelAccessory={<FieldHint>{worksWithTitle.length} chars</FieldHint>}
          description="Supports **bold** and `code` markers."
          rows={2}
          className="mb-4"
        />
        <FormTextareaField
          control={form.control}
          name="worksWith"
          label="Content"
          labelAccessory={
            <FieldHint>
              {worksWith.length} chars · {paragraphCount} paragraphs
            </FieldHint>
          }
          description="Separate paragraphs with a blank line. Supports **bold** and `code` markers."
          rows={8}
        />
      </CmsSection>

      <SaveRow isDirty={isDirty} isSaving={isSubmitting} onSave={onSave} />
    </Form>
  );
};
