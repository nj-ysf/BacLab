# BacLab — AI integration

## Current implementation
- `baclab/backend/app/ai.py`: **OpenRouter only**, OpenAI-compatible SDK, base URL `https://openrouter.ai/api/v1`, 35 s timeout, no SDK retries, `response_format: json_object`, Pydantic validation (`Extraction`, `Explanation`) and one repair retry.
- Env: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` (default `google/gemini-2.5-flash`). See `baclab/backend/.env.example`.
- Health: `GET /api/health` exposes only booleans/provider/model names, never keys.
- The LLM only classifies, extracts and writes qualitative commentary (digits rejected). It never supplies calculated results.

## Planned (NOT implemented) — roadmap P0-10
Provider order requested by the user:
1. Gemini Developer API, model `gemini-3.5-flash-lite`, env `GEMINI_API_KEY` (preferred when configured)
2. OpenRouter (existing implementation), env `OPENROUTER_API_KEY`
3. Demo mode (bundled examples, labeled "Mode démonstration")

Implementation notes for the next session: keep the provider switch inside `app/ai.py` behind `structured()`; reuse the same Pydantic schemas, repair retry and controlled HTTP errors; extend `/api/health` with the active provider; add mocked tests; never log keys or upstream bodies.
