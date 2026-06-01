import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Briefcase, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TAboutPayload } from "@/features/landing-cms";

import { CmsSection } from "./cms-section";
import { FieldLabel } from "./field-label";
import { SaveRow } from "./save-row";

type TProps = {
  form: UseFormReturn<TAboutPayload>;
  onSave: () => void;
};

export const AboutTab = ({ form, onSave }: TProps) => {
  const t = useTranslations();
  const { isDirty, isSubmitting } = form.formState;

  const heroGreeting = form.watch("heroGreeting");
  const heroDesc = form.watch("heroDesc");
  const worksWith = form.watch("worksWith");
  const paragraphCount = worksWith.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  return (
    <div>
      <CmsSection
        icon={<User className="size-[14px]" />}
        title="Hero"
        description="Top of the about page — personal intro."
      >
        <div className="mb-4">
          <Controller
            control={form.control}
            name="heroGreeting"
            render={({ field, fieldState }) => (
              <div>
                <FieldLabel hint={`${heroGreeting.length} chars`} htmlFor="about-greeting">
                  Hero greeting
                </FieldLabel>
                <Input
                  id="about-greeting"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-9 text-[13.5px]"
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">
                    {t(fieldState.error.message as Parameters<typeof t>[0])}
                  </p>
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
                <FieldLabel hint={`${heroDesc.length} chars`} htmlFor="about-hero-desc">
                  Hero description
                </FieldLabel>
                <Textarea
                  id="about-hero-desc"
                  value={field.value}
                  onChange={field.onChange}
                  rows={2}
                  className="text-[13.5px] leading-[1.55]"
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">
                    {t(fieldState.error.message as Parameters<typeof t>[0])}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </CmsSection>

      <CmsSection
        icon={<Briefcase className="size-[14px]" />}
        title="What I work with"
        description="Three paragraphs separated by blank lines. Plain text only."
      >
        <Controller
          control={form.control}
          name="worksWith"
          render={({ field, fieldState }) => (
            <div>
              <FieldLabel
                hint={`${worksWith.length} chars · ${paragraphCount} paragraphs`}
                htmlFor="about-works-with"
              >
                Content
              </FieldLabel>
              <Textarea
                id="about-works-with"
                value={field.value}
                onChange={field.onChange}
                rows={11}
                className="min-h-[264px] text-[13.5px] leading-[1.55]"
              />
              {fieldState.error && (
                <p className="text-destructive mt-1 text-xs">
                  {t(fieldState.error.message as Parameters<typeof t>[0])}
                </p>
              )}
              <p className="text-muted-foreground mt-2.5 text-xs leading-[1.55]">
                Separate paragraphs with a blank line. No rich-text formatting — line breaks render
                as written.
              </p>
            </div>
          )}
        />
      </CmsSection>

      <SaveRow isDirty={isDirty} isSaving={isSubmitting} onSave={onSave} />
    </div>
  );
};
