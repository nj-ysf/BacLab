---
name: handoff-baclab
description: Record an accurate BacLab session handoff with verified progress, unfinished roadmap tasks and a clear next action.
disable-model-invocation: true
---

1. Inspect git status and diff, or a file inventory when Git is absent. Preserve all unrelated work; do not commit.
2. Summarize implemented behavior from the actual source and the checks performed during this session.
3. Update `docs/PROJECT_STATE.md`: date, versions, commands/cwds/results, running servers, blockers and best next task.
4. Update `docs/ROADMAP.md` using DONE, PARTIAL, BLOCKED or NOT STARTED. Never mark unverified work DONE.
5. Add to `docs/DECISIONS.md` only if a real architecture/product decision changed. Separate requested future direction from current implementation.
6. Keep the current provider, environment examples and setup instructions consistent. Never read/copy real secrets into docs.
7. Check affected links/config JSON/frontmatter, then report changes, evidence, remaining risks and the next task ID.
