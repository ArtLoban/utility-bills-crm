"use client";

import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";

import { ChevronDown, Code2, Image as ImageIcon, Layers, Sparkles } from "lucide-react";

import { Form } from "@/components/ui/form";
import { FormTextField } from "@/components/form/form-text-field";
import { FormTextareaField } from "@/components/form/form-textarea-field";
import type { THomePayload } from "@/features/landing-cms";

import { CardSubBlock } from "./card-sub-block";
import { CmsSection } from "./cms-section";
import { FieldHint } from "./field-hint";
import { SaveRow } from "./save-row";

// homeSchema guarantees exactly four feature cards (z.tuple of 4); literal indices
// keep the `featureCards.N.*` field names typed without a cast.
const CARD_INDICES = [0, 1, 2, 3] as const;

type TProps = {
  form: UseFormReturn<THomePayload>;
  onSave: () => void;
};

export const HomeTab = ({ form, onSave }: TProps) => {
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const [techExpanded, setTechExpanded] = useState(false);

  const { isDirty, isSubmitting } = form.formState;

  const heroTitle = form.watch("heroTitle");
  const heroDesc = form.watch("heroDesc");
  const techHighlights = form.watch("techHighlights");

  return (
    <Form {...form}>
      <CmsSection
        icon={<Sparkles className="size-[14px]" />}
        title="Hero"
        description="Top of the home page — first thing visitors read."
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
          rows={4}
        />
      </CmsSection>

      <CmsSection
        icon={<ImageIcon className="size-[14px]" />}
        title="Screenshot captions"
        description="Text underneath each product screenshot."
      >
        <FormTextareaField
          control={form.control}
          name="dashboardCaption"
          label="Dashboard caption"
          labelAccessory={<FieldHint>Under the dashboard mockup</FieldHint>}
          description="Supports **bold** and `code` markers."
          rows={2}
          className="mb-4"
        />
        <FormTextareaField
          control={form.control}
          name="propertyCaption"
          label="Property detail caption"
          labelAccessory={<FieldHint>Under the property detail mockup</FieldHint>}
          description="Supports **bold** and `code` markers."
          rows={2}
        />
      </CmsSection>

      {/* Feature cards — collapsible on mobile */}
      <div className="border-border bg-card mb-5 overflow-hidden rounded-[10px] border">
        <button
          type="button"
          onClick={() => setCardsExpanded((v) => !v)}
          className="border-border flex w-full items-start gap-3 border-b px-6 pt-[18px] pb-4 md:cursor-default"
        >
          <div className="bg-muted text-muted-foreground mt-px flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg">
            <Layers className="size-[14px]" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-foreground font-semibold tracking-tight text-[var(--font-size-md)]">
              Feature cards
            </div>
            <div className="text-muted-foreground mt-0.5 text-[12.5px]">
              Four cards highlighting what the product does.
            </div>
          </div>
          <ChevronDown
            className={`text-muted-foreground mt-px size-4 shrink-0 transition-transform md:hidden ${cardsExpanded ? "rotate-180" : ""}`}
          />
        </button>
        <div className={`p-[22px_24px] md:block ${cardsExpanded ? "block" : "hidden"}`}>
          <div className="grid grid-cols-1 gap-3.5">
            {CARD_INDICES.map((i) => (
              <CardSubBlock
                key={i}
                index={i + 1}
                control={form.control}
                titleName={`featureCards.${i}.title`}
                bodyName={`featureCards.${i}.body`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tech highlights — collapsible on mobile */}
      <div className="border-border bg-card mb-5 overflow-hidden rounded-[10px] border">
        <button
          type="button"
          onClick={() => setTechExpanded((v) => !v)}
          className="border-border flex w-full items-start gap-3 border-b px-6 pt-[18px] pb-4 md:cursor-default"
        >
          <div className="bg-muted text-muted-foreground mt-px flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg">
            <Code2 className="size-[14px]" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-foreground font-semibold tracking-tight text-[var(--font-size-md)]">
              Tech highlights
            </div>
            <div className="text-muted-foreground mt-0.5 text-[12.5px]">
              Single line under the feature cards. Supports **bold** and `code` markers.
            </div>
          </div>
          <ChevronDown
            className={`text-muted-foreground mt-px size-4 shrink-0 transition-transform md:hidden ${techExpanded ? "rotate-180" : ""}`}
          />
        </button>
        <div className={`p-[22px_24px] md:block ${techExpanded ? "block" : "hidden"}`}>
          <FormTextField
            control={form.control}
            name="techHighlights"
            label="Tech highlights line"
            labelAccessory={<FieldHint>{techHighlights.length} chars · single line</FieldHint>}
          />
        </div>
      </div>

      <SaveRow isDirty={isDirty} isSaving={isSubmitting} onSave={onSave} />
    </Form>
  );
};
