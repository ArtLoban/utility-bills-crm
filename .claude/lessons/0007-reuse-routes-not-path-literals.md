# 0007 — Reuse `ROUTES`, never hardcode path literals

**What happened:** When updating the landing mockup URLs I wrote path literals
(`/dashboard`, `/properties/1`) inline, even though `lib/routes.ts` already exports
a single source of truth `ROUTES`. The author replaced them with `ROUTES.dashboard`
and `ROUTES.properties`.

**Rule:** Any known in-app route path must come from `ROUTES` (`lib/routes.ts`) —
never a string literal. This holds even for non-navigational/decorative strings
(e.g. a mockup address bar): a path that mirrors a real route still tracks that route.

**How to apply:** Before writing a `/...` app path anywhere, check `lib/routes.ts`
for the matching key and compose from it (`` `${ROUTES.properties}/1` ``). Only the
trailing decorative/illustrative segment (e.g. the `/1` sample id) stays a literal.
