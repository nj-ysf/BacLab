# BacLab — project state

Last updated: 2026-10-22 (sessions: P0-6 projectile lab polish; P0-11 dynamic redesign).

## Repository

- No Git repository exists (workspace or `baclab/`). Do not initialize without a request. Changes are tracked only through this file and the roadmap.
- Toolchain observed: Node 22.17.0, Vite 6.4.5, Vitest 3.2.7, Python 3.13, drei 10.7.9, fiber 9.8.2, React 19.3.1.
- A backend was already running on `127.0.0.1:8000` at session start (not started by this session). `/api/health` → `ai_configured: true`, provider `openrouter`, model `google/gemini-2.5-flash`.

## Verified this session

| Check | Working dir | Result |
|---|---|---|
| `python -m pytest -q -p no:cacheprovider` | `baclab/backend` | 29 passed |
| `node node_modules/typescript/bin/tsc --noEmit` | `baclab/frontend` | pass |
| `npm test` | `baclab/frontend` | 13 passed |
| `npm run build` | `baclab/frontend` | pass (three-engine chunk 704 kB warning, pre-existing) |
| Lint | — | NOT CONFIGURED |
| Headless Chrome via CDP (SwiftShader WebGL), built app served by FastAPI :8000 | temp script outside repo | see below |

Browser evidence (390×844 mobile and 1280×800):
- All three demo examples: input → Analyser → confirm → Lancer → `/lab`; canvas renders, no WebGL fallback, no horizontal overflow on 390 px.
- Projectile: labels `h max 10,19 m, t = 1,44 s`, `Impact à t = 2,88 s`, `R = 40,77 m`, `DÉPART` visible; Play works without answering the challenge; telemetry reaches `t 2,88 s, x 40,77 m, y 0, vₓ 14,14, vᵧ −14,14`.
- Slider changes update cards and graph (45°→30°: R 35,31 m; 70°: R 26,21 m, curve redrawn) with **0 `/api` requests**.
- Elevated launch (h0 = 15 m) shows a platform; R 52,44 m, h max 25,19 m, t 3,71 s.
- Confirm page shows translated range errors (`Gravité : 0.1 ≤ valeur ≤ 30 m/s²`).
- Console: no errors after adding the inline favicon (only a favicon 404 before).
- Secret pattern scan of source, docs, examples and `dist/`: no key patterns. Real `.env` files were not read.

## Redesign (P0-11) evidence

- New: `src/components/Chronophoto.tsx` (hero driven by `solve()`), `src/pages/Landing.tsx` (moved out of `main.tsx`), token-based `src/style.css` rewrite, font dependency `@fontsource-variable/bricolage-grotesque` (installed with `npm install`, lockfile updated).
- Project skill installed from Anthropic's `anthropics/skills` repo: `.claude/skills/frontend-design/` (SKILL.md + Apache-2.0 LICENSE).
- Checks after redesign: Vitest 13 passed, pytest 29 passed, tsc pass, build pass.
- Headless Chrome: landing at 1280/390 px FR and 390 px AR, no console errors, no horizontal overflow; tap on the sheet relaunches (45° → 68°); `prefers-reduced-motion` gives a static chronophotograph (15 marks, readout frozen); full example flow for all three motions still passes with 0 API calls from sliders.

## Not verified this session

- Offline demo with backend stopped (backend was pre-existing; not stopped).
- Arabic RTL layout of the updated lab page; real phone hardware; touch orbit gestures.
- Live AI analysis with a real photo (no paid requests made).
- `npm run dev` (Vite dev server) and fresh `npm install`.

## Fixed bugs found during verification

- First drei `<Html>` label in each scene rendered empty (apex label; `DÉPART` in free fall/uniform). Cause: Html's default target switches when R3F events connect, re-creating its React root on the same element. Fix: stable `portal` div around the Canvas.
- Graph curve never drew (Chart.js scatter + `showLine`). Switched to a `Line` chart with a linear x axis.

## Blockers

None for the demo. Gemini provider not implemented (see roadmap P0-10).

## Best next task

P0-10 Gemini provider (`gemini-3.5-flash-lite`, `GEMINI_API_KEY`) behind `app/ai.py` with OpenRouter fallback, or P1-1 Arabic RTL/offline verification if live AI is not needed for the demo.
