# BacLab — decisions

## 2026-10-22 — Prediction challenge no longer gates playback
Play/Replay were disabled until the challenge was answered, with no hint; on phones the challenge sits below the fold, so the demo looked broken. Playback is now always available; answering the challenge still awards points (max 100 per module) and replays the animation.

## 2026-10-22 — Graph uses a Chart.js `Line` chart with a linear x axis
The previous scatter chart with `showLine` drew no curve. A line controller with `type: 'linear'` x scale plots the same engine samples reliably.

## 2026-10-22 — drei `Html` labels use a stable portal
Labels are portaled into a fixed overlay div wrapping the Canvas, preventing the first label from blanking when R3F connects events.

## 2026-10-22 — Visual identity: live chronophotography on graph paper
Requested: a dynamic redesign that shows motion. The identity borrows the Bac mechanics chronophotograph (positions M₀…Mₙ at equal τ). The landing hero is a graph-paper sheet (1 square = 1 m) where a ball computed by `solve()` leaves strobe marks with live velocity (amber) and gravity (coral) vectors; tapping relaunches at another angle. Colors encode physics (trajectory cyan #5cd3e6, velocity #f2b544, gravity #ff7a6b) on ink #0d1b2e. One typeface, Bricolage Grotesque (variable, bundled via `@fontsource-variable/bricolage-grotesque` so offline demo keeps working). Non-user motion is limited to the hero loop; it pauses off-screen/hidden tab and is static with `prefers-reduced-motion`. The 3D lab ball carries the same velocity/gravity vectors.
