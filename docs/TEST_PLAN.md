# BacLab — test plan

## Automated

| Working dir | Command | Covers |
|---|---|---|
| `baclab/backend` | `python -m pytest -q -p no:cacheprovider` | API routes, upload validation, demo dispatch, unsupported handling, mocked OpenRouter repair/error mapping (29 cases) |
| `baclab/frontend` | `npm test` | Physics engine: canonical projectile, elevated/horizontal/vertical launches, apex time, velocity components, zero-duration flight, free fall incl. upward start, uniform distance vs displacement, unit conversion, invalid inputs (13 cases) |
| `baclab/frontend` | `node node_modules/typescript/bin/tsc --noEmit` | Types |
| `baclab/frontend` | `npm run build` | Type check + production bundle |

No lint is configured. Normal suites need no API key or internet.

## Manual / browser (label results as manual)

1. Backend on :8000 with a current `dist/` → open `http://127.0.0.1:8000`.
2. For each example: Analyser → confirm values (SI shown) → Lancer le laboratoire.
3. Projectile: apex/landing/range labels visible, Play animates, telemetry ends at y = 0, sliders update cards and graph, Network tab shows no `/api` calls on slider moves.
4. Phone viewport 390×844: no horizontal scroll, controls ≥ 44 px, scene readable.
5. Stop backend, reload, run an example (bundled offline demo, clearly labeled).
6. Switch to العربية and check RTL.

Headless option used on 2026-10-22: Chrome `--headless=new --use-angle=swiftshader` driven over CDP by a temporary Node script kept outside the repo. A mock response is not proof of a live provider.
