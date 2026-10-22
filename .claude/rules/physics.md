---
paths:
  - "baclab/frontend/src/utils/physics.ts"
  - "baclab/frontend/src/utils/physics.test.ts"
---
# Physics

- Treat `docs/PHYSICS_SPEC.md` and scientific correctness as the contract.
- Use SI units internally; convert before calling the engine. Keep calculations deterministic and pure.
- Never call an LLM or consume its proposed calculated answers.
- Keep full precision internally; round only display output.
- Document assumptions and positive-upward sign convention.
- Test canonical results and boundaries: elevated/horizontal launches, signed velocity, zero-duration flight, invalid/nonfinite inputs and incompatible units.
- Derive animation/graph data from the same solution functions. Distinguish distance, displacement and final position.
