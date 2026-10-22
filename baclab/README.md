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

## Supported scope


Exactly three idealized models: uniform linear motion, vertical motion under constant gravity, and projectile motion without drag. This is **not** a solver for every physics exercise. Electricity, optics, chemistry, variable acceleration and drag are outside the scope. The interface defaults to French, includes English and Arabic navigation/controls, and offers French, English, Arabic and Darija explanations. Some supporting interface copy remains French.

## Requirements

- Node.js 22.12+ (22 LTS or newer supported LTS) and npm
- Python 3.11 or newer
- Internet access for the initial dependency installation
- A WebGL-capable browser for 3D; calculations and charts remain usable without WebGL
- Optional OpenRouter API key for custom text/photo extraction and supplementary AI explanations

## Start on Windows (PowerShell)

Open two terminals. All commands below assume this checkout is in `C:\Users\dell\Documents\Cluade\baclab`.

### Backend

```powershell
cd C:\Users\dell\Documents\Cluade\baclab\backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

No shell activation is necessary. On subsequent starts, only the `cd` and `uvicorn` commands are needed. Do not overwrite an existing configured `.env`.

If Python's `venv`/`ensurepip` is broken, repair the Python installation, or use a Python environment that already contains the requirements and run `python -m uvicorn app.main:app --host 127.0.0.1 --port 8000`.

### Frontend

```powershell
cd C:\Users\dell\Documents\Cluade\baclab\frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Backend health is **http://127.0.0.1:8000/api/health** and interactive API docs are **http://127.0.0.1:8000/docs**. Vite proxies `/api` to the backend. The dev server binds to all interfaces for phone testing; use the computer's LAN address on the phone and permit your OS firewall if needed.

For macOS/Linux, create the environment with `python3 -m venv .venv`, replace `.\.venv\Scripts\python.exe` with `.venv/bin/python`, and copy the environment file with `cp .env.example .env`.

## Environment

Create `backend/.env` from `.env.example` if it does not exist, then enter your OpenRouter key there (never in frontend files or chat). Backend `backend/.env`:

```dotenv
OPENROUTER_API_KEY=
OPENROUTER_MODEL=google/gemini-2.5-flash
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Leave the OpenRouter key empty for demo mode. Keys belong **only** in the backend environment. Restart the backend after changing it. The OpenAI-compatible SDK connects to `https://openrouter.ai/api/v1` with a 35-second request timeout and no SDK retries. An invalid structured response gets one repair attempt. The default is `google/gemini-2.5-flash`; change `OPENROUTER_MODEL` to an OpenRouter model ID that supports **image input and JSON output**. The request uses OpenRouter's OpenAI-compatible chat endpoint and requires provider support for the supplied parameters. See the [OpenRouter quickstart](https://openrouter.ai/docs/quickstart) and [default model page](https://openrouter.ai/google/gemini-2.5-flash). Model access and credits depend on your OpenRouter account; a free model must also support both required capabilities.

Optional frontend `.env`: `VITE_API_URL=http://127.0.0.1:8000`. Leave unset when using the Vite proxy or a production same-origin reverse proxy. Never put a secret in a `VITE_` variable. If using separate origins, add the frontend origin to `FRONTEND_ORIGINS`.

## Demo walkthrough

1. On the home page, choose **Analyser un exercice**, **Essayer un exemple** or one of the three motions.
2. Select a bundled example and click **Analyser l’exercice**.
3. Review every parameter. Change values and units; SI equivalents appear underneath. A missing value, incompatible unit or out-of-range value prevents launch.
4. Open the laboratory and press **Lancer** (the optional prediction challenge also starts a replay and awards points). The projectile scene shows the launch point/platform, direction arrow, trajectory, apex marker (h max and t), landing marker and range ruler; telemetry shows t, x, y, vₓ, vᵧ.
5. Pause, replay, change a slider or rotate/zoom the camera. Slider changes reset the animation and instantly update the trajectory, scientific chart and result cards without any API requests.
6. Review the seven-step worked solution. Supplementary explanation is requested only by clicking its button.

The three examples work with no API key. They also work with the backend stopped because the frontend bundles explicitly labeled example extractions. This is not photo OCR in disguise: arbitrary photos or text require the configured API. After dependencies are installed, both servers and examples work without internet. This is not a PWA; a server must still serve the frontend and its chunks.

Expected canonical results:

| Example | Result |
|---|---|
| Projectile, 20 m/s, 45°, ground launch | Range ≈ 40.77 m; maximum height ≈ 10.19 m; flight ≈ 2.88 s |
| Free fall, 20 m, initial velocity zero | Flight ≈ 2.02 s; vertical impact velocity ≈ −19.81 m/s |
| Uniform, 15 m/s for 10 s | Distance 150 m |

## Architecture

```text
frontend/src/
  main.tsx                     Router, language/context, header
  pages/Landing.tsx            Landing page and strobe motion figures
  components/Chronophoto.tsx   Live chronophotograph hero (engine-driven SVG)
  pages/Exercise.tsx           Image/text input and editable SI confirmation
  pages/Laboratory.tsx         Lab state, local calculations, challenge, solution
  simulations/LaboratoryScene.tsx
                               Shared scene and all three basic-geometry simulations
  components/Graph.tsx         Chart.js scientific graphs
  components/SimulationControls.tsx
  services/api.ts              API client, image resizing, offline examples
  types/index.ts              Shared frontend contracts
  utils/physics.ts            Pure deterministic SI engine and validation
  utils/physics.test.ts       Meaningful mechanics and unit-conversion tests
  utils/i18n.ts               French, English and Arabic core interface labels
  style.css                  Design tokens, responsive layout and Tailwind entry
backend/app/
  main.py                    API, image validation, bounded cache, rate limiter
  models.py                  Strict Pydantic extraction/explanation validation
  ai.py                      OpenRouter structured output and one repair retry
  demo.py                    Predefined labeled example extractions
backend/tests/               Endpoint, security-boundary and AI repair tests
```

All numerical answers, plotted samples and animated positions come from the **same TypeScript engine**. Upward vertical velocity is positive; downward impact velocity is negative. Uniform motion supports negative velocity and distinguishes distance from signed position. Projectile flight uses the positive quadratic root, including elevated launches. Angles are normalized to degrees, with radians accepted at confirmation. The UI uses Unicode mathematical notation rather than an external formula renderer.

The optional explanation endpoint receives already calculated results, returns those exact results unchanged, and restricts AI commentary to qualitative prose without digits. Generated commentary is never used in calculation. This endpoint does not certify arbitrary client-provided results; the app supplies values from its engine.

## API

- `GET /api/health` → `{ "status": "ok", "ai_configured": false }`
- `POST /api/analyze`: JSON `{ "text": "..." }` or `{ "demo_id": "projectile_motion" }`; alternatively multipart fields `image` and optional `text`.
- `POST /api/explain`: `{ "exercise_type": "uniform_motion", "parameters": { "initial_position": 0, "speed": 15, "duration": 10 }, "results": { "distance": 150 }, "language": "fr" }`.

Analysis errors use controlled HTTP responses for missing input, invalid images, oversize uploads, unavailable AI, timeout and invalid AI JSON. An unsupported exercise produces a validated `supported: false` object and the specified unsupported message. Missing parameters appear in the confirmation screen and must be filled before launch.

## Security and performance

- Accepted images: JPEG, PNG and WebP, maximum 8 MiB. The browser resizes to 1600 px; the backend validates MIME and decoded image content, rejects excessive pixel counts and re-encodes without original metadata.
- Images are held in memory, never written to disk. Analysis cache stores at most 64 extraction results, keyed by a content hash. Restarting the process clears the cache.
- Local in-memory limit: 20 POST requests per client IP per minute. This is not a distributed or production abuse-control system.
- No AI calls on slider changes or animation frames. Explicit supplementary explanations may incur API usage.
- Basic geometries, no textures/models/post-processing/shadows; one ambient light and one directional light. DPR is capped at 1.5 and light mode uses DPR 1.
- The laboratory route is lazy-loaded. Demand rendering stops after the animation; hidden tabs stop canvas rendering. Orbit interaction renders on demand.
- Frontend session storage preserves the active exercise. Local storage preserves points; each module awards at most 100 points. No authentication or database.

For public deployment, add authentication if appropriate, a reverse proxy with body limits, shared rate limiting, TLS, and suitable retention policies. The current implementation is a local hackathon MVP.

## Tests and build

```powershell
cd C:\Users\dell\Documents\Cluade\baclab\backend
.\.venv\Scripts\python.exe -m pytest -q -p no:cacheprovider

cd C:\Users\dell\Documents\Cluade\baclab\frontend
npm test
npm run build
```

`npm run build` checks TypeScript and writes the frontend to `dist/`. FastAPI can serve this built version directly at **http://127.0.0.1:8000**, including SPA routes, so a separate frontend server is optional for a built demo. Alternatively, serve `dist/` with an SPA history fallback and proxy `/api` to FastAPI. Vite's development proxy is not included in the production build. The Three.js engine remains a sizable lazy-loaded chunk; charts are separated for caching.

## Verification and limitations

Live OpenRouter calls require a real API key and are not covered by the mocked integration tests. Student photos can be ambiguous; extracted values always need review. Darija is a supplementary explanation option, not a fully translated interface. The 3D scene automatically fits its scale to the trajectory; numerical labels are in SI. On the home page, one graph-paper square is one meter.
