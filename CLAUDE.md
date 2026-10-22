# BacLab — working instructions

## Product

BacLab transforms photographed Moroccan high-school physics exercises into interactive 3D experiments.
MVP scope: uniform linear motion, vertical free fall, projectile motion only.
French is the default UI; explanations may use French, Arabic, Darija or English.
Reject unsupported exercises honestly. Never imply arbitrary physics support.

## Workspace and current state

Start Claude in `C:\Users\dell\Documents\Cluade` (this directory).
Application code is in `baclab/`; this workspace and `baclab/` were **not Git repositories** at handoff.
Do not initialize Git, commit, reset, discard changes or alter user-level Claude settings without a request.
Read [project state](docs/PROJECT_STATE.md) before assuming the app is verified.
The running built demo is not proof that current source has been rebuilt.

## Core architecture

- `baclab/frontend/`: React 19, TypeScript, Vite, Tailwind CSS, React Router, Lucide.
- `baclab/backend/app/main.py`: FastAPI routes, demo dispatch, upload checks, cache, rate limit, optional static hosting.
- `baclab/frontend/src/utils/physics.ts`: authoritative pure SI calculations and validation.
- `baclab/frontend/src/simulations/LaboratoryScene.tsx`: shared React Three Fiber scene; projectile, free-fall and uniform-motion components.
- `baclab/frontend/src/components/Graph.tsx`: Chart.js graphs from engine samples.
- `baclab/backend/app/ai.py`: **OpenRouter only**, OpenAI-compatible SDK, validated JSON plus one repair retry.
- Gemini Developer API is the user's preferred **future** primary; it is NOT implemented. See [AI integration](docs/AI_INTEGRATION.md).
- Demo data: `baclab/backend/app/demo.py` and `baclab/frontend/src/services/api.ts`; no API key required for examples.
- Tests: `baclab/backend/tests/` (29 pytest cases); `baclab/frontend/src/utils/physics.test.ts` (13 Vitest cases).
- Config: `baclab/backend/.env.example`, `baclab/frontend/.env.example`; real `.env` files are private and ignored.

## Non-negotiable rules

- LLMs read, classify, extract and explain; they never supply authoritative calculated physics results.
- Deterministic code calculates every result, trajectory and graph. Slider changes never call an LLM.
- Students confirm/correct extracted parameters and see normalized SI values before simulation.
- Do not silently fabricate missing parameters. Show assumptions, including gravity, for review.
- Never expose keys in frontend code, logs, docs or chat. Never commit `.env` files.
- Read `.env.example`, not real secret files. Check configuration through safe health booleans.
- Preserve demo mode without internet once dependencies and local frontend assets are installed.
- Keep scenes lightweight on ordinary smartphones: basic geometry, bounded DPR, no heavy assets or game physics engines.
- No new science modules, authentication, database or unrelated dashboard during the hackathon baseline work.

## Commands and evidence

Working directories are relative to this root. See [command matrix](docs/TEST_PLAN.md) for limitations.

| Working directory | Command | Evidence |
|---|---|---|
| `baclab/backend` | `python -m pytest -q -p no:cacheprovider` | 29 passed at handoff |
| `baclab/backend` | `python -m uvicorn app.main:app --host 127.0.0.1 --port 8000` | Started and HTTP verified; check port before launching another |
| `baclab/frontend` | `node node_modules/typescript/bin/tsc --noEmit` | Passed at handoff |
| `baclab/frontend` | `npm install` | User previously succeeded; `vitest` pinned to `^3.2.0` to match lock (2026-10-22) |
| `baclab/frontend` | `npm test` | 13 passed (Vitest 3.2.7) on 2026-10-22 |
| `baclab/frontend` | `npm run build` | Passed 2026-10-22; dist matches current source at that time |

Frontend dev script is `npm run dev` in `baclab/frontend`, port 5173; it has NOT been successfully started in this sandbox.
No lint command/config exists. Do not invent `npm run lint` or claim lint passed.
Backend installation procedure is in [README](baclab/README.md); fresh venv installation was NOT verified here.
Do not use Uvicorn `--reload` in this sandbox: named-pipe permissions fail. Ordinary non-reload startup works.
With an existing frontend build, FastAPI serves the app at `http://127.0.0.1:8000`.

## Working process

1. Read [PROJECT_STATE](docs/PROJECT_STATE.md), then [ROADMAP](docs/ROADMAP.md).
2. Inspect `git status` and diff if Git exists; otherwise inventory files and explicitly retain the no-Git limitation.
3. Create/update the native task list for multi-step work; use roadmap IDs so it survives session handoff.
4. Verify relevant current behavior and work on one complete vertical slice at a time.
5. Run focused checks. Separate passing, failing, blocked and unrun checks; do not repeat blocked commands indefinitely.
6. Update project state and roadmap before ending a substantial session. Record a decision only when one changed.
7. Report changed files, verification evidence, remaining risks and the next task. Do not commit unless asked.

Use `/continue-baclab`, `/verify-baclab`, `/handoff-baclab`. In Plan mode, wait for the user's approval before implementation.

## Definition of done

A task is complete only when implementation works, relevant checks pass, no new browser/backend errors appear,
mobile behavior is considered, changed architecture/behavior is documented, and no secrets are committed.
Code presence and HTTP 200 do not establish visual correctness, WebGL animation, responsive behavior or real-provider success.
Use DONE, PARTIAL, BLOCKED, NOT STARTED consistently; scope DONE to the exact verified behavior.

## Detailed references

[Physics](docs/PHYSICS_SPEC.md) · [AI](docs/AI_INTEGRATION.md) · [Decisions](docs/DECISIONS.md) · [Tests](docs/TEST_PLAN.md) ·
Architecture, API and UI notes live in [baclab/README.md](baclab/README.md) (no separate ARCHITECTURE/API/UI spec files exist).
