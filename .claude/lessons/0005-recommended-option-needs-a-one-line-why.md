# 0005 — A recommended option must come with a one-line "why"

**What happened:** In an AskUserQuestion I marked one option "(рекомендую)" but gave no
reason, and framed a trade-off as the author's to settle when the project rules already
dictate the best-practice answer.

**Rule:** When you mark an option as recommended, attach a short justification tied to a
concrete best practice or rule (DRY, single source of truth, `ui-patterns.md §5`, a11y,
type-safety). Choose the recommendation on merits — never to offload a call the rules already
settle, and never present a rule-violating option as an equal alternative.

**How to apply:** Give every recommended option a one-clause «почему» in its description. If
the rules mandate the answer, you may still surface the choice, but make the recommendation
and its rationale unambiguous. Never leave code you know is below the bar (CLAUDE.md §0).
