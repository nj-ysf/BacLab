# BacLab — roadmap

Status values: DONE, PARTIAL, BLOCKED, NOT STARTED. DONE is scoped to verified behavior (see PROJECT_STATE).

## P0 — hackathon demonstration

| ID | Task | Status | Notes |
|---|---|---|---|
| P0-1 | App starts without errors | DONE | Backend :8000 serves built frontend; no console errors in headless Chrome |
| P0-2 | Demo mode works reliably | PARTIAL | Verified with backend running; offline (backend stopped) path not re-verified 2026-10-22 |
| P0-3 | Enter or select an exercise | DONE | Examples verified; custom text/photo requires API key |
| P0-4 | Extracted parameters displayed and editable, SI shown | DONE | Translated range errors added |
| P0-5 | Deterministic projectile calculations | DONE | 13 Vitest cases incl. apex time, components, elevated/horizontal/vertical launch, zero-duration |
| P0-6 | Polished projectile 3D simulation | DONE | Platform, launch ring, arrow, trajectory, apex marker, landing marker, range ruler, telemetry t/x/y/vₓ/vᵧ, play/pause/replay/reset, speed/angle/height/animation sliders |
| P0-7 | Graphs and results update with sliders, no AI calls | DONE | Graph curve bug fixed; 0 API calls on slider changes |
| P0-8 | Full flow on phone-sized viewport | PARTIAL | 390×844 emulation verified; real device and RTL not verified |
| P0-9 | Free fall and uniform motion | DONE | Flow, animation, sliders verified at 390 px |
| P0-11 | Dynamic visual redesign (chronophotograph hero, strobe motion figures, 3D vectors, token CSS) | DONE | Verified in headless Chrome at 1280 and 390 px, FR and AR; real phone not tested |
| P0-10 | Live Gemini analysis (`gemini-3.5-flash-lite`, `GEMINI_API_KEY`), OpenRouter fallback, then demo | NOT STARTED | OpenRouter path exists and is configured; see AI_INTEGRATION |

## P1 — after P0

| ID | Task | Status |
|---|---|---|
| P1-1 | Verify Arabic RTL lab layout and offline demo with backend stopped | NOT STARTED |
| P1-2 | Live-provider smoke test with a real photographed exercise | NOT STARTED |
| P1-3 | Validate persisted sessionStorage extraction before use | NOT STARTED |
| P1-4 | Optional time cursor on graph synchronized with animation | NOT STARTED |
