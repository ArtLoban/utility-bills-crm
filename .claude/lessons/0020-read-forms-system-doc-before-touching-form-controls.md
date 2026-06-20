# 0020 — Read `forms-system.md` before touching any form / input / select / textarea

**What happened:** Aligning the Add-reminder modal to the design, I hand-rolled the reminder-text
field with raw `FormField` + `Textarea` + a manual char counter — bypassing the
`components/form/*` family — and I had not read `.claude/instructions/forms-system.md` first. The
author flagged it via devnote: "ты читал forms-system.md перед выполнением задачи?!". CLAUDE.md §5
makes that doc **required reading before touching any form, input, select, or date control**.

**Rule:** Before editing or building any form/field/input/select/textarea/date control, **open and
read `.claude/instructions/forms-system.md`** (and it is binding alongside `ui-patterns.md`). Use the
existing `components/form/*` field family (built on `FormFieldShell`) for data-entry forms — never
hand-roll `FormField`/`FormControl`/raw inputs. If a field needs something the shell lacks (a label-row
counter, a rich description), **extend the shared shell/field with a backward-compatible optional prop**
(lesson [[0002-study-the-reference-reuse-the-shared-shell]]), don't fork it inline.

**How to apply:** When a task mentions a form/modal/field, read the forms doc as part of the same
"read the rules" step as the `.claude/rules/` and `.claude/lessons/` files — not after writing code.
Pick the right context (data-entry `useZodForm` + `components/form/*` vs filter `useQueryFilters` +
widgets). Reuse the inventory; extend the shell when there's a gap.
