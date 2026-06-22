# 0021 — Universal i18n strings → shared namespace inside the component, not props

**What happened:** Promoting `NotesCard` to shared `components/`, I lifted its i18n to props
(`title`, `emptyLabel`) so each consumer (service, meter) passes its own translations — applying
[[0002-study-the-reference-reuse-the-shared-shell]] literally. The author pushed back: the strings
("Notes" / "No notes added yet.") are identical for every consumer, so they should live in one
`common.*` namespace read **inside** the component, not be plumbed through props (which also forced
duplicating the same strings into two domain namespaces).

**Rule:** When a shared component's labels are **genuinely universal** (the same wording for every
consumer, no domain specificity), put them in a shared namespace (`common.*`) and read them inside
the component (`getTranslations`/`useTranslations`). Reserve i18n-via-props (0002) for when callers
legitimately need **different** wording. Universal strings duplicated across domain namespaces are a
DRY violation ([[0014-hoist-shared-constants-no-cross-file-duplication]] applied to i18n).

**How to apply:** Before adding `title`/`label` props to a shared component, ask "would any consumer
ever pass a _different_ string?" If no — add the keys to `common.*` once and consume them internally;
delete the now-orphaned per-domain keys (and any dead siblings like an unused `edit` key). If yes —
props are correct.
