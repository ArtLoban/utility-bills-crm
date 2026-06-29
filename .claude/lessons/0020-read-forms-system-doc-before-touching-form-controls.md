# 0020 — Know the form system before touching any form / input / select / textarea

**What happened:** Aligning the Add-reminder modal to the design, I hand-rolled the reminder-text
field with raw `FormField` + `Textarea` + a manual char counter — bypassing the
`components/form/*` family — without first understanding the project's form system. The author
flagged it via devnote. (The system used to be documented in `forms-system.md`; that doc was a
migration tracker and was deleted once the migration completed on 2026-06-29 — the system now lives
in code + CLAUDE.md §5 «Forms».)

**Rule:** Before editing or building any form/field/input/select/textarea/date control, know the two
form contexts (binding alongside `ui-patterns.md`):

- **Data-entry** (persist on submit) → `lib/forms/use-zod-form.ts` (`useZodForm`) + the
  `components/form/*` field family (`FormTextField`, `FormTextareaField`, `FormSelectField`,
  `FormSwitchField`, `FormDateField`, …), all built on `FormFieldShell`.
- **Filter** (URL state) → `lib/hooks/use-query-filters.tsx` (`useQueryFilters`) + the
  `DateRangeFilter` / `SelectInput` widgets.

Never hand-roll `FormField`/`FormControl`/raw inputs. If a field needs something the shell lacks (a
label-row counter via `labelAccessory`, a rich `description`, a ReactNode label), **extend the shared
shell/field with a backward-compatible optional prop** (lesson
[[0002-study-the-reference-reuse-the-shared-shell]]), don't fork it inline.

**How to apply:** When a task mentions a form/modal/field, pick the right context first, then reuse
the `components/form/*` inventory; extend the shell when there's a gap. Note: `components/form/*`
fields need a `FormProvider` (`<Form {...form}>`) and translate Zod messages via `useZodForm`'s
optional `namespace` — instant-apply/non-form selects use the bare `components/ui/select` primitive
instead, never a fake RHF form.
