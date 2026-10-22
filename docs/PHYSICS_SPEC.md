# BacLab — physics specification

Engine: `baclab/frontend/src/utils/physics.ts` (pure, deterministic, SI). Results, graph samples and animation positions all come from `solve()`. Full precision internally; rounding only in display (`toLocaleString('fr-FR', {maximumFractionDigits: 2})`).

Assumptions: no air resistance, constant gravity, origin at the launch point on the ground, **positive upward**. Gravity (default 9.81 m/s²) is shown to the student for review.

## Projectile motion
- vₓ = v₀ cos θ, vᵧ₀ = v₀ sin θ (θ in degrees, 0–90)
- x(t) = vₓ t, y(t) = h₀ + vᵧ₀ t − ½ g t²
- Time of flight: t = (vᵧ₀ + √(vᵧ₀² + 2 g h₀)) / g (positive root)
- Time to max height: t_max = max(vᵧ₀, 0) / g; max height h₀ + vᵧ₀² / 2g
- Range R = vₓ t; position/velocity at t via `at(t)` (clamped to [0, t_flight])

## Vertical free fall
- y(t) = h₀ + v₀ t − ½ g t², vᵧ(t) = v₀ − g t; time to ground same root; impact velocity signed (negative = downward)

## Uniform linear motion
- x(t) = x₀ + v t; final position x₀ + v·T; distance |v|·T (distinct from displacement)

## Validation bounds
See `bounds` in the engine (e.g. speed 0–200 m/s, angle 0–90°, height 0–1000 m, g 0.1–30 m/s²). Non-finite or out-of-range values block simulation.
