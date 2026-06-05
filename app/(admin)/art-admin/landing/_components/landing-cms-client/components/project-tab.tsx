import { Controller, type Path, type UseFormReturn } from "react-hook-form";

import { Activity, Blocks, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TProjectPayload } from "@/features/landing-cms";

import { CardSubBlock } from "./card-sub-block";
import { CmsSection } from "./cms-section";
import { FieldLabel } from "./field-label";
import { SaveRow } from "./save-row";

type TProps = {
  form: UseFormReturn<TProjectPayload>;
  onSave: () => void;
};

export const ProjectTab = ({ form, onSave }: TProps) => {
  const { isDirty, isSubmitting } = form.formState;

  const heroTitle = form.watch("heroTitle");
  const heroDesc = form.watch("heroDesc");
  const status = form.watch("status");
  const archCards = form.watch("archCards");
  const archCardErrors = form.formState.errors.archCards;

  return (
    <div>
      <CmsSection
        icon={<Sparkles className="size-[14px]" />}
        title="Hero"
        description="Top of the project page — intro to the deep-dive."
      >
        <div className="mb-4">
          <Controller
            control={form.control}
            name="heroTitle"
            render={({ field, fieldState }) => (
              <div>
                <FieldLabel hint={`${heroTitle.length} chars`} htmlFor="project-hero-title">
                  Hero title
                </FieldLabel>
                <Input
                  id="project-hero-title"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-9 text-[13.5px]"
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name="heroDesc"
            render={({ field, fieldState }) => (
              <div>
                <FieldLabel hint={`${heroDesc.length} chars`} htmlFor="project-hero-desc">
                  Hero description
                </FieldLabel>
                <Textarea
                  id="project-hero-desc"
                  value={field.value}
                  onChange={field.onChange}
                  rows={4}
                  className="text-[13.5px] leading-[1.55]"
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">{fieldState.error.message}</p>
                )}
                <p className="text-muted-foreground mt-2.5 text-xs leading-[1.55]">
                  Supports **bold** and `code` markers.
                </p>
              </div>
            )}
          />
        </div>
      </CmsSection>

      <CmsSection
        icon={<Blocks className="size-[14px]" />}
        title="Architecture highlights"
        description="Six cards explaining the key technical decisions."
      >
        <div className="grid grid-cols-1 gap-3.5">
          {archCards.map((card, i) => (
            <CardSubBlock
              key={i}
              index={i + 1}
              title={card.title}
              body={card.body}
              onTitle={(v) =>
                form.setValue(`archCards.${i}.title` as Path<TProjectPayload>, v, {
                  shouldDirty: true,
                })
              }
              onBody={(v) =>
                form.setValue(`archCards.${i}.body` as Path<TProjectPayload>, v, {
                  shouldDirty: true,
                })
              }
              titleError={archCardErrors?.[i]?.title?.message}
              bodyError={archCardErrors?.[i]?.body?.message}
            />
          ))}
        </div>
      </CmsSection>

      <CmsSection
        icon={<Activity className="size-[14px]" />}
        title="Current status"
        description="Where the project stands right now."
      >
        <Controller
          control={form.control}
          name="status"
          render={({ field, fieldState }) => (
            <div>
              <FieldLabel hint={`${status.length} chars`} htmlFor="project-status">
                Status
              </FieldLabel>
              <Textarea
                id="project-status"
                value={field.value}
                onChange={field.onChange}
                rows={5}
                className="text-[13.5px] leading-[1.55]"
              />
              {fieldState.error && (
                <p className="text-destructive mt-1 text-xs">{fieldState.error.message}</p>
              )}
              <p className="text-muted-foreground mt-2.5 text-xs leading-[1.55]">
                Separate paragraphs with a blank line. Supports **bold** and `code` markers.
              </p>
            </div>
          )}
        />
      </CmsSection>

      <SaveRow isDirty={isDirty} isSaving={isSubmitting} onSave={onSave} />
    </div>
  );
};
