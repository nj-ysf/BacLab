---
paths:
  - "baclab/frontend/src/**/*.ts"
  - "baclab/frontend/src/**/*.tsx"
  - "baclab/frontend/src/**/*.css"
  - "baclab/frontend/vite.config.ts"
---
# Frontend

- Preserve the navy/mint scientific design in `baclab/frontend/src/style.css` and existing components.
- Keep HTTP transport in `services/api.ts`; pages orchestrate, `utils/physics.ts` calculates.
- Preserve loading, empty, validation and failure states. Demo examples must remain usable without AI.
- Verify mobile widths, touch controls and Arabic RTL; CSS media queries alone are not verification.
- Avoid unnecessary React rerenders in frame loops. Use basic geometries, demand rendering and bounded DPR.
- Do not introduce heavy models, textures, post-processing or game physics dependencies.
- Never put secrets in frontend code or Vite variables. Do not trust persisted extraction JSON without validation.
