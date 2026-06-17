# 0014 — Hoist a shared constant on first authoring; never duplicate it across files

**What happened:** Creating the Terms and Privacy pages in one task, I declared
`const CONTACT_EMAIL = "utilitybills.crm@gmail.com"` **separately in both files**. The author
pushed back hard ("дублируется в двух местах… ты работаешь как джуниор?"). The value had to be a
single source of truth (`lib/constants/contact.ts`), imported by both.

**Rule:** A literal/constant used in more than one file is defined **once** and imported — never
copy-pasted per file (DRY, `ui-patterns.md §5` "define it once and import it everywhere"). This is
not just for numbers: emails, URLs, labels, any shared value. When a single task authors several
files that share a value, hoist it the moment the second use appears, not "later."

**How to apply:**

- When writing a value, ask "will a sibling file need this too?" If yes, put it in a shared module
  first (nearest level covering the consumers; an app-wide service value → `lib/constants/`).
- Before declaring a multi-file task done, self-review the new/edited files for the same literal
  appearing twice — a duplicated string is a defect, fix it before delivery (CLAUDE.md §0).
- A grep for the new literal across the repo is a cheap final check.
