---
name: continue-baclab
description: Continue the highest-priority actionable BacLab task, or the task named by the user, with verification and a persistent handoff.
argument-hint: "[roadmap task ID or task name]"
disable-model-invocation: true
---

Requested task: $ARGUMENTS. If empty, select the highest-priority actionable unfinished roadmap item.

1. Read root `CLAUDE.md`, `docs/PROJECT_STATE.md` and `docs/ROADMAP.md`.
2. Inspect git status and diff. If no Git repository exists, state that and inventory existing files; do not initialize or discard anything.
3. Verify the relevant baseline and identify dependencies. Do not repeat a known blocked command without a changed condition.
4. Select one task (prefer P0); create/update the native task list using its roadmap ID.
5. If in Plan mode, propose the slice and await approval. Otherwise implement one complete authorized vertical slice.
6. Run focused tests/checks and the relevant manual checklist. Keep secrets private, demo mode working and physics deterministic.
7. Update project state and roadmap with actual evidence, remaining blockers and the next task.
8. Report changed behavior/files, checks, risks and continuation point. Do not commit or deploy unless requested.

This skill grants no shell permissions beyond the project's ordinary permission rules.
