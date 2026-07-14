# 0025 — Write short: a long commit message or doc entry is not read

**What happened:** The author rejected my prose for length twice in one session — Decision Log
entries that retold the implementation ("огромные куски текста, которые будут врать"), then a
multi-paragraph commit body ("такие длинные никто не будет читать").

**Rule:** Commit bodies, Decision Log entries and doc sections say only what the code cannot: the
decision, the rejected alternative, the why. Never narrate the diff. Length is not thoroughness —
an unread artifact conveys nothing, and detail copied out of code rots into a lie.

**How to apply:** Commit body ~4 lines; the subject says what, the body says why only if it isn't
obvious. Decision entry: decision + alternative + why — keep traps invisible from the code, drop
paths, symbol names, migration numbers. Before each sentence ask whether the reader could get it
from the code in five seconds; if yes, cut it.

Related: [[0018-no-doc-comments-on-pure-ui-components-and-types]].
