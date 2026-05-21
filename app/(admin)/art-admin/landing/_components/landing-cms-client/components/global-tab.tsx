import { type ReactNode } from "react";

import { Briefcase, Eye, Folder, GitBranch, Link, Play } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import type { TGlobalContent } from "../types";
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
  form: TGlobalContent;
  isDirty: boolean;
  set: <K extends keyof TGlobalContent>(field: K, value: TGlobalContent[K]) => void;
  onSave: () => void;
};

export const GlobalTab = ({ form, isDirty, set, onSave }: TProps) => (
  <div>
    <CmsSection
      icon={<Link className="size-[14px]" />}
      title="External links"
      description="URLs used across the landing — header, footer, project page."
    >
      <div className="flex flex-col gap-[18px]">
        <UrlField
          id="global-linkedin"
          icon={<Briefcase className="size-[13px]" />}
          label="LinkedIn URL"
          hint="Header & about page"
          value={form.linkedinUrl}
          onChange={(v) => set("linkedinUrl", v)}
        />
        <UrlField
          id="global-github"
          icon={<GitBranch className="size-[13px]" />}
          label="GitHub profile URL"
          hint="Header & about page"
          value={form.githubUrl}
          onChange={(v) => set("githubUrl", v)}
        />
        <UrlField
          id="global-repo"
          icon={<Folder className="size-[13px]" />}
          label="Project repository URL"
          hint="Project page"
          value={form.projectRepoUrl}
          onChange={(v) => set("projectRepoUrl", v)}
        />
        <UrlField
          id="global-demo"
          icon={<Play className="size-[13px]" />}
          label="Live demo URL"
          hint="Project page"
          value={form.liveDemoUrl}
          onChange={(v) => set("liveDemoUrl", v)}
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
          visNav={form.aboutNavVisible}
          urlAccess={form.aboutUrlAccessible}
          onVisNav={(v) => set("aboutNavVisible", v)}
          onUrlAccess={(v) => set("aboutUrlAccessible", v)}
        />
        <VisibilityRow
          pageName="Project page"
          pagePath="/project"
          visNav={form.projectNavVisible}
          urlAccess={form.projectUrlAccessible}
          onVisNav={(v) => set("projectNavVisible", v)}
          onUrlAccess={(v) => set("projectUrlAccessible", v)}
        />
      </div>
      <p className="text-muted-foreground mt-3.5 text-xs leading-[1.55]">
        <strong className="text-foreground font-medium">&ldquo;Visible in navigation&rdquo;</strong>{" "}
        shows the page link in the public header.{" "}
        <strong className="text-foreground font-medium">&ldquo;URL accessible&rdquo;</strong>{" "}
        controls whether the page can be opened directly. A page can be reachable by URL while
        hidden from the nav.
      </p>
    </CmsSection>

    <SaveRow isDirty={isDirty} onSave={onSave} />
  </div>
);
