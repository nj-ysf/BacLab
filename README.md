# BacLab

**Photographie ton exercice. Regarde-le bouger.**

BacLab turns a photographed Moroccan high-school (Bac) physics exercise into an interactive experiment. The student photographs or types the problem, checks the values BacLab read, and then watches the motion happen in 3D: the trajectory, velocity vectors, graphs and a worked solution, all recalculated live as they move the sliders.

## The idea

Mechanics exercises are static: a paragraph, a few numbers, a diagram on paper. Students are asked to imagine a ball flying, a car moving or an object falling, then reason about equations they have never seen move. BacLab closes that gap.

```text
Photo or text of the exercise
  → AI reads, classifies and extracts the values
  → the student confirms or corrects them (shown in SI units)
  → a deterministic physics engine calculates everything
  → interactive 3D experiment, graphs and step-by-step solution
```

Three principles shape the product:

- **The AI reads, the engine calculates.** A language model only identifies the exercise type and extracts values with their units. It never supplies a numerical answer. Every result, trajectory point and graph comes from one tested TypeScript engine, so what the student sees is exact and reproducible.
- **The student stays in control.** Extracted values are always shown for review before the simulation starts. Missing data is never invented; assumptions such as g = 9.81 m/s² are displayed.
- **Honest scope.** BacLab supports exactly three motions from the Bac mechanics syllabus: uniform linear motion, vertical free fall and projectile motion. Anything else is rejected clearly instead of being guessed.

### Visual identity: the chronophotograph

Bac mechanics exercises often show a *chronophotographie*: a moving body photographed at equal time intervals τ, its positions labeled M₀, M₁, M₂… The spacing of those points tells the physics: equal gaps mean constant speed, growing gaps mean acceleration, a parabola means projectile motion.

BacLab is built around that image. The home page is a live sheet of graph paper (one square = one meter) where a ball, computed by the same engine as the lab, leaves strobe marks every 0.15 s while its velocity vector (amber) and gravity vector (coral) ride along. Tapping the paper relaunches it at another angle. Colors carry physical meaning throughout the app: cyan for trajectory, amber for velocity, coral for gravity. The 3D laboratory uses the same vectors on the moving ball.

The interface is in French by default, with English and Arabic (right-to-left) navigation, and explanations in French, English, Arabic or Darija.

## Built with Claude Opus 5.5

BacLab was developed with **Claude Opus 5.5** working as the lead engineer in **Claude Code**, while the team defined the product, the scope, the priorities and reviewed every result. Opus 5.5 worked directly in the repository: reading the code, running the test suites and the app, and checking its own work in a real browser before reporting.

What Opus 5.5 did:

- **Audited the project and set up the working structure.** Established a verified baseline (backend tests, type checks, physics tests), found documentation that did not match the code, and wrote the project state, roadmap, physics specification, test plan and decision log so each session could continue where the last one ended.
- **Strengthened the physics engine.** Added deterministic tests for the cases that usually break: time to maximum height, velocity components, launches from a height, horizontal and vertical launches, zero-duration flights, upward free fall and out-of-range inputs.
- **Completed the projectile laboratory.** Launch platform for elevated launches, direction arrow, maximum-height and landing markers, a range ruler, live telemetry (t, x, y, vₓ, vᵧ) and live velocity and gravity vectors on the ball.
- **Found and fixed real bugs by testing in a browser**, not just by reading code: the first 3D label in every scene rendered empty (traced to the label library re-creating its root when the 3D events connected), the graph curve was never drawn, and the play button was silently locked until a quiz question was answered.
- **Kept the app fast on ordinary phones.** Stopped the 3D scene and the chart from re-rendering on every animation tick, kept basic geometry, capped pixel ratio and paused rendering when it is not visible.
- **Redesigned the interface.** Proposed and built the chronophotograph identity, the physics-driven home page, the strobe signatures for each motion, a token-based stylesheet with readable text sizes, and translations in French, English and Arabic, including a right-to-left fix for the graph.
- **Verified every change.** Ran the backend and frontend test suites and the production build, then drove headless Chrome through the whole flow at phone and desktop sizes: no console errors, no horizontal scrolling, and zero AI requests when sliders move.
- **Protected the guardrails.** Kept the language model out of all calculations, kept API keys on the server only, never read private `.env` files, and preserved an offline demo mode.

## Run it

The app lives in [`baclab/`](baclab/). Setup, environment variables, architecture, API and tests are documented in [baclab/README.md](baclab/README.md).

```powershell
# Backend (terminal 1)
cd baclab/backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# Frontend (terminal 2)
cd baclab/frontend
npm install
npm run build   # FastAPI then serves the app at http://127.0.0.1:8000
```

The three bundled examples work without an API key or internet. Custom photos and text need an OpenRouter key in `baclab/backend/.env` (copy `.env.example`; never commit the real file).

## Repository layout

```text
baclab/           The application (React + Three.js frontend, FastAPI backend)
docs/             Project state, roadmap, physics spec, test plan, AI integration, decisions
CLAUDE.md         Working instructions for Claude Code
.claude/          Claude Code rules and skills used during development
```
