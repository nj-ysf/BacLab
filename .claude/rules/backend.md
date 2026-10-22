---
paths:
  - "baclab/backend/**/*.py"
---
# Backend

- Validate external input and provider output with Pydantic; preserve finite-value checks and controlled HTTP errors.
- Provider behavior belongs behind `app/ai.py`'s service boundary, not scattered through routes.
- Keep actual byte, MIME and decoded image validation. Do not permanently store student images.
- Apply timeouts/output caps; preserve the single JSON repair attempt and no SDK retries.
- Never log keys, full upstream errors or private exercise contents. Read examples rather than real secret files.
- Keep demo mode independent of credentials and external calls. Do not disguise demo data as photo analysis.
- Gemini migration/fallback is planned in `docs/AI_INTEGRATION.md`; do not assume it exists.
