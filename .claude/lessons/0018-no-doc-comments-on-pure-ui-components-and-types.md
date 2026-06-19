# 0018 — No descriptive comments on pure frontend components and their prop types

**What happened:** Creating the `SectionCard` / `SectionCardEmpty` primitives I added
doc-block comments describing what the component renders and per-field comments on the
`TProps` type. The author removed them: "НЕ нужно добавлять комментарии к чисто фронтэнд
компонентам и типам. Слишком много шума."

**Rule:** Do not add descriptive/doc comments to pure presentational components or their
prop types — the JSX and the prop names already say what it renders. This refines
[[feedback_comments]] (comments are for genuine value — non-obvious framework behavior, a
"why", a caveat): a restatement of what a self-evident UI component does is noise, not value.

**How to apply:** For a pure UI component (`components/ui/`-style shells, cards, rows, field
wrappers) and its `TProps`, write zero explanatory comments by default. Reserve comments for
non-obvious behavior (RSC/`use client` boundaries, caching, a deliberate workaround) — and
keep those terse. The bar: would a senior reader learn something they couldn't get from the
code? If no, omit it.
