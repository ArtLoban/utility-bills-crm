# 0001 — Existing code is not a convention

**What happened:** While planning the Bills form migration, I justified using native
`<input type="date">`/`type="month"` by calling it "the project's convention," because the
existing date inputs use it. The author pushed back hard: that code is legacy/tech debt,
not a convention — native month inputs are poor UX (Firefox/Safari fall back to text, no
picker, unstylable), so they fail the quality bar.

**Rule:** Existing code is never an argument for a decision. "The project already does X"
is forbidden as justification (CLAUDE.md §1.8). The repo holds a lot of bad code slated
for refactor; what exists is _what was done_, never _what should be done_.

**How to apply:** Decide every choice on its own merits — UX, accessibility, type-safety,
maintainability, and the rules in `.claude/rules/`. When existing code is relevant, frame
it as "current code does X, which is tech debt because…", not "the convention is X." Take
the best approach even if it diverges from what's there (propose new dependencies per
§1.7) and flag the legacy as tech debt.
