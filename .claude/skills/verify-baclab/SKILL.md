---
name: verify-baclab
description: Verify BacLab's existing quality gates and presentation path, reporting environment blockers separately from product failures.
disable-model-invocation: true
---

Read `CLAUDE.md`, `docs/PROJECT_STATE.md` and `docs/TEST_PLAN.md`. Inspect current scripts before running them.

- In `baclab/backend`: run `python -m pytest -q -p no:cacheprovider`.
- In `baclab/frontend`: run `node node_modules/typescript/bin/tsc --noEmit`, `npm test`, `npm run build` and `npm ls --depth=0`. Obtain ordinary permissions where needed.
- There is no lint command. Report NOT STARTED; do not invent or install a linter for verification.
- Check an existing backend with GET `/api/health`. If needed and the port is free, start `python -m uvicorn app.main:app --host 127.0.0.1 --port 8000` from `baclab/backend`; avoid sandbox `--reload` failures.
- Check frontend via current production build or `npm run dev` from `baclab/frontend`. Distinguish an old build from current source.
- Run the AI-disabled demo tests and manual presentation checklist; no paid requests in normal verification.
- If Git exists, inspect tracked filenames for real `.env` files and scan only tracked non-secret source for credentials. Without Git, report the limitation and use the safe source checks described in the test plan. Never print secrets.
- Summarize each result with command, cwd and evidence. Record blocked/unrun checks honestly. Stop only processes you started for this check; preserve pre-existing servers.

Do not modify product behavior unless explicitly asked. Hand off fixes through the roadmap.
