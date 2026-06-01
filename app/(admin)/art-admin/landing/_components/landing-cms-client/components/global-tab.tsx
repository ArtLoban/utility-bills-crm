import { type ReactNode } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Briefcase, Eye, Folder, GitBranch, Link, Play } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { TGlobalPayload } from "@/features/landing-cms";

import { CmsSection } from "./cms-section";
import { FieldLabel } from "./field-label";
import { SaveRow } from "./save-row";

type TUrlFieldProps = {
  id: string;
  icon: ReactNode;
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
};

const UrlField = ({ id, icon, label, hint, value, onChange }: TUrlFieldProps) => (
  <div>
    <FieldLabel hint={hint} htmlFor={id}>
      <span className="inline-flex items-center gap-2">
        <span className="text-muted-foreground inline-flex size-4 items-center justify-center">
          {icon}
        </span>
        {label}
      </span>
    </FieldLabel>
    <Input
      id={id}
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 font-mono text-[13px]"
    />
  </div>
);

type TVisibilityRowProps = {
  pageName: string;
  pagePath: string;
  visNav: boolean;
  urlAccess: boolean;
  onVisNav: (v: boolean) => void;
  onUrlAccess: (v: boolean) => void;
};

const VisibilityRow = ({
  pageName,
  pagePath,
  visNav,
  urlAccess,
  onVisNav,
  onUrlAccess,
}: TVisibilityRowProps) => (
  <div className="border-border rounded-lg border bg-zinc-50 p-[14px_16px] dark:bg-zinc-900">
    <div className="mb-3.5 flex items-center justify-between">
      <div>
        <div className="text-foreground text-[13.5px] font-semibold">{pageName}</div>
        <div className="text-muted-foreground mt-0.5 font-mono text-[11.5px]">{pagePath}</div>
      </div>
    </div>
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-foreground text-[13px]">Visible in navigation</div>
          <div className="text-muted-foreground mt-px text-[11.5px]">
            Shows the page link in the public header.
          </div>
        </div>
        <Switch checked={visNav} onCheckedChange={onVisNav} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-foreground text-[13px]">URL accessible</div>
          <div className="text-muted-foreground mt-px text-[11.5px]">
            The page can be opened directly by URL.
          </div>
        </div>
        <Switch checked={urlAccess} onCheckedChange={onUrlAccess} />
      </div>
    </div>
  </div>
);

type TProps = {
  form: UseFormReturn<TGlobalPayload>;
  onSave: () => void;
};

export const GlobalTab = ({ form, onSave }: TProps) => {
  const t = useTranslations();
  const { isDirty, isSubmitting } = form.formState;

  // Watch boolean fields to drive VisibilityRow switches
  const aboutNavVisible = form.watch("aboutNavVisible");
  const aboutUrlAccessible = form.watch("aboutUrlAccessible");
  const projectNavVisible = form.watch("projectNavVisible");
  const projectUrlAccessible = form.watch("projectUrlAccessible");

  return (
    <div>
      <CmsSection
        icon={<Link className="size-[14px]" />}
        title="External links"
        description="URLs used across the landing — header, footer, project page."
      >
        <div className="flex flex-col gap-[18px]">
          <Controller
            control={form.control}
            name="linkedinUrl"
            render={({ field, fieldState }) => (
              <div>
                <UrlField
                  id="global-linkedin"
                  icon={<Briefcase className="size-[13px]" />}
                  label="LinkedIn URL"
                  hint="Header & about page"
                  value={field.value}
                  onChange={field.onChange}
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">
                    {t(fieldState.error.message as Parameters<typeof t>[0])}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            control={form.control}
            name="githubUrl"
            render={({ field, fieldState }) => (
              <div>
                <UrlField
                  id="global-github"
                  icon={<GitBranch className="size-[13px]" />}
                  label="GitHub profile URL"
                  hint="Header & about page"
                  value={field.value}
                  onChange={field.onChange}
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">
                    {t(fieldState.error.message as Parameters<typeof t>[0])}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            control={form.control}
            name="projectRepoUrl"
            render={({ field, fieldState }) => (
              <div>
                <UrlField
                  id="global-repo"
                  icon={<Folder className="size-[13px]" />}
                  label="Project repository URL"
                  hint="Project page"
                  value={field.value}
                  onChange={field.onChange}
                />
                {fieldState.error && (
                  <p className="text-destructive mt-1 text-xs">
                    {t(fieldState.error.message as Parameters<typeof t>[0])}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            control={form.control}
            name="liveDemoUrl"
            render={({ field, fieldState }) => (
              <div>
                <UrlField
                  id="global-demo"
                  icon={<Play className="size-[13px]" />}
                  label="Live demo URL"
                  hint="Project page"
                  value={field.value}
                  onChange={field.onChange}
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
        icon={<Eye className="size-[14px]" />}
        title="Page visibility"
        description="Each page has two independent switches — nav visibility and URL access."
      >
        <div className="flex flex-col gap-3">
          <VisibilityRow
            pageName="About page"
            pagePath="/about"
            visNav={aboutNavVisible}
            urlAccess={aboutUrlAccessible}
            onVisNav={(v) => form.setValue("aboutNavVisible", v, { shouldDirty: true })}
            onUrlAccess={(v) => form.setValue("aboutUrlAccessible", v, { shouldDirty: true })}
          />
          <VisibilityRow
            pageName="Project page"
            pagePath="/project"
            visNav={projectNavVisible}
            urlAccess={projectUrlAccessible}
            onVisNav={(v) => form.setValue("projectNavVisible", v, { shouldDirty: true })}
            onUrlAccess={(v) => form.setValue("projectUrlAccessible", v, { shouldDirty: true })}
          />
        </div>
        <p className="text-muted-foreground mt-3.5 text-xs leading-[1.55]">
          <strong className="text-foreground font-medium">
            &ldquo;Visible in navigation&rdquo;
          </strong>{" "}
          shows the page link in the public header.{" "}
          <strong className="text-foreground font-medium">&ldquo;URL accessible&rdquo;</strong>{" "}
          controls whether the page can be opened directly. A page can be reachable by URL while
          hidden from the nav.
        </p>
      </CmsSection>

      <SaveRow isDirty={isDirty} isSaving={isSubmitting} onSave={onSave} />
    </div>
  );
};
