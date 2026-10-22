---
paths:
  - "baclab/backend/tests/**/*.py"
  - "baclab/frontend/src/**/*.test.ts"
  - "baclab/frontend/src/**/*.test.tsx"
---
# Tests

- Test observable behavior and scientific invariants, not implementation-shaped assertions alone.
- Include boundary, failure, missing-data and unsupported-exercise cases.
- Keep tests deterministic; mock AI transport, isolate configuration and clear process-local caches/rate limits.
- Normal suites must not require real API keys, internet or paid requests.
- Clearly label manual/browser and live-provider checks. A mock response is not proof of a live provider.
