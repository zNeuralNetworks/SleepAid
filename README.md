# Sleep Aid

Sleep Aid is an offline, mobile-first React app for sleep hygiene, relaxation, sleep stories, NSDR/PMR guidance, and browser-generated soundscapes. The app is built as static Vite output and served from an nginx container on Cloud Run.

Production target:

- GitHub repo: `https://github.com/zNeuralNetworks/SleepAid`
- GCP build system: Cloud Build
- Runtime: Cloud Run
- Container registry: Artifact Registry

## App Stack

| Layer | Technology |
| --- | --- |
| UI | React 19 |
| Build | Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Motion | Framer Motion |
| Icons | lucide-react |
| Runtime server | nginx on port `8080` |

The app currently has no backend, no database, no auth, and no runtime secrets. All current content and logic are client-side/static.

## Repository Layout

| Path | Purpose |
| --- | --- |
| `App.tsx` | App shell, lazy-loaded view routing, navigation integration |
| `components/` | Dashboard, relaxation tools, story mode, roadmap, and navigation components |
| `types.ts` | Shared TypeScript types and app view enum |
| `index.tsx` | React entry point |
| `index.html` | Vite HTML entry |
| `index.css` | Tailwind import, theme globals, custom animations, and utility compatibility classes |
| `vite.config.ts` | Vite config, React plugin, Tailwind plugin, alias setup, dev server port |
| `package.json` | npm scripts and dependency contract |
| `package-lock.json` | Locked dependency graph used by `npm ci` in Cloud Build |
| `Dockerfile` | Multi-stage production image build |
| `nginx.conf` | Static SPA serving and cache behavior |
| `cloudbuild.yaml` | Cloud Build pipeline: ensure Artifact Registry, build, push, deploy Cloud Run |
| `.dockerignore` | Keeps Cloud Build Docker context small and excludes local/generated files |
| `.gitignore` | Keeps generated, local, secret, and tool-state files out of git |
| `AGENTS.md` | Codex/project guidance, including code-review-graph workflow |
| `docs/ARCHITECTURE.md` | System architecture, module topology, deployment flow, and evolution guardrails |
| `docs/PRODUCT_DESIGN.md` | Product goals, users, journeys, UX requirements, roadmap, and product risks |
| `docs/TECHNICAL_DESIGN.md` | Architecture, build/deploy design, module boundaries, security, and technical risks |

## Design Documents

- [Architecture](docs/ARCHITECTURE.md)
- [Product Design Document](docs/PRODUCT_DESIGN.md)
- [Technical Design Document](docs/TECHNICAL_DESIGN.md)

## Local Development

Prerequisite: Node.js 20+

```bash
npm install
npm run dev
```

Default dev URL:

```text
http://localhost:3000
```

If port `3000` is busy, Vite automatically selects the next available port.

## Local Verification

Run the full project check before pushing:

```bash
npm run check
```

This runs:

```bash
npm run typecheck
npm run build
```

Expected result: TypeScript completes with no errors and Vite writes static assets to `dist/`.

## Local Container Test

Use this when changing `Dockerfile`, `nginx.conf`, `cloudbuild.yaml`, or build dependencies:

```bash
docker build -t sleep-aid:local .
docker run --rm -p 8080:8080 sleep-aid:local
```

Open:

```text
http://localhost:8080
```

Expected behavior:

- App loads at `/`.
- SPA fallback works for browser refreshes.
- Static assets under `/assets/` are served with long-lived immutable caching.
- `index.html` is served with `no-cache`.

## Production Build Path

Cloud Build executes the same production path as the local container build.

1. `cloudbuild.yaml` starts.
2. `ensure-artifact-registry` creates the Artifact Registry Docker repo if missing.
3. `build-image` runs `docker build`.
4. `Dockerfile` runs `npm ci`.
5. `Dockerfile` runs `npm run check`, which type-checks and builds Vite output.
6. `Dockerfile` copies `dist/` into an nginx runtime image.
7. `push-image` pushes both `$COMMIT_SHA` and `latest` tags.
8. `deploy-cloud-run` deploys the `$COMMIT_SHA` image to Cloud Run on port `8080`.

## Cloud Build Configuration

Default substitutions in `cloudbuild.yaml`:

| Substitution | Default | Meaning |
| --- | --- | --- |
| `_REGION` | `us-central1` | Artifact Registry and Cloud Run region |
| `_SERVICE` | `sleep-aid` | Cloud Run service name and image name |
| `_AR_REPO` | `sleep-aid` | Artifact Registry Docker repository name |

Image path format:

```text
${_REGION}-docker.pkg.dev/$PROJECT_ID/${_AR_REPO}/${_SERVICE}:$COMMIT_SHA
${_REGION}-docker.pkg.dev/$PROJECT_ID/${_AR_REPO}/${_SERVICE}:latest
```

Cloud Run deploy settings:

| Setting | Value |
| --- | --- |
| Platform | managed |
| Auth | `--allow-unauthenticated` |
| Port | `8080` |
| Image tag | commit SHA |

## GCP Prerequisites

Set project context:

```bash
export PROJECT_ID="YOUR_GCP_PROJECT_ID"
gcloud config set project "$PROJECT_ID"
```

Enable required APIs:

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com
```

Confirm project number:

```bash
export PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
```

Cloud Build may use either the legacy Cloud Build service account or a user-specified trigger service account. Confirm the service account configured on the Cloud Build trigger and grant it the required permissions.

Common legacy service account:

```bash
export CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
```

Minimum practical roles for this pipeline:

```bash
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/logging.logWriter"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/iam.serviceAccountUser"
```

Notes:

- `roles/artifactregistry.admin` is used because `cloudbuild.yaml` creates the Artifact Registry repository if it does not exist. If the repository is pre-created, this can usually be reduced to Artifact Registry writer permissions.
- `roles/run.admin` is required for `gcloud run deploy`.
- `roles/iam.serviceAccountUser` is required when deploying Cloud Run services that run as a service account.

## GitHub to Cloud Build Trigger

Recommended trigger:

| Field | Value |
| --- | --- |
| Source | GitHub |
| Repository | `zNeuralNetworks/SleepAid` |
| Event | Push to branch |
| Branch | `^main$` |
| Config type | Cloud Build configuration file |
| Config path | `cloudbuild.yaml` |
| Substitutions | Optional overrides for `_REGION`, `_SERVICE`, `_AR_REPO` |

High-level setup:

1. In GCP Console, open Cloud Build.
2. Connect the GitHub repository using the Cloud Build GitHub app.
3. Create a trigger for pushes to `main`.
4. Use `cloudbuild.yaml` from the repository root.
5. Select or confirm the trigger service account.
6. Confirm the service account has the roles listed above.
7. Push to `main` or manually run the trigger.

Manual build from a local checkout:

```bash
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions _REGION=us-central1,_SERVICE=sleep-aid,_AR_REPO=sleep-aid
```

## Files That Must Stay Aligned for Cloud Build

| File | Cloud Build dependency |
| --- | --- |
| `cloudbuild.yaml` | Defines region, service, Artifact Registry repo, image tags, and deploy command |
| `Dockerfile` | Must build the app and produce a runtime image listening on port `8080` |
| `nginx.conf` | Must listen on `8080` and serve `dist/` as an SPA |
| `package.json` | Must include `check`, `typecheck`, and `build` scripts used by the Docker build |
| `package-lock.json` | Must match `package.json`; `npm ci` fails if they drift |
| `vite.config.ts` | Must include React and Tailwind plugins for production CSS output |
| `index.css` | Must import Tailwind; removing it breaks styling in production |
| `.dockerignore` | Must not exclude source files, package files, Vite config, `index.css`, or `nginx.conf` |
| `.gitignore` | Should keep `dist/`, `node_modules/`, secrets, and local graph/tool state out of git |

## Cloud Build Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `npm ci` fails | `package.json` and `package-lock.json` are out of sync | Run `npm install`, commit the updated lockfile |
| TypeScript errors during Docker build | `npm run check` fails inside `Dockerfile` | Run `npm run check` locally and fix the error |
| Tailwind classes missing in production | Tailwind plugin/import removed or `index.css` not imported | Verify `vite.config.ts` includes `@tailwindcss/vite` and `index.tsx` imports `./index.css` |
| Cloud Build cannot push image | Missing Artifact Registry permissions or repo issue | Grant Artifact Registry permissions or pre-create the repo |
| Cloud Build cannot deploy Cloud Run | Missing Run/IAM permissions | Grant `roles/run.admin` and `roles/iam.serviceAccountUser` to the trigger service account |
| Cloud Run deploy succeeds but app does not load | Container not listening on expected port | Confirm `nginx.conf` listens on `8080` and Cloud Run deploy uses `--port=8080` |
| Browser refresh returns 404 | nginx SPA fallback missing | Confirm `location / { try_files $uri $uri/ /index.html; }` exists |

## Deployment Checklist

Before pushing to `main`:

```bash
npm run check
```

For deploy-related changes:

```bash
docker build -t sleep-aid:local .
docker run --rm -p 8080:8080 sleep-aid:local
```

Before enabling the GitHub trigger:

- GitHub repo exists at `zNeuralNetworks/SleepAid`.
- `main` branch contains `cloudbuild.yaml`, `Dockerfile`, `nginx.conf`, `package.json`, and `package-lock.json`.
- GCP APIs are enabled.
- Cloud Build trigger is connected to GitHub.
- Trigger service account has Artifact Registry, Cloud Run, IAM service account user, and logging permissions.
- Artifact Registry and Cloud Run region match `_REGION`.

## Code Review Graph

This repo is configured for local code-review-graph usage. The generated graph database is ignored by git.

Rebuild after meaningful source changes:

```bash
uvx code-review-graph build --repo .
```

Check status:

```bash
uvx code-review-graph status --repo .
```
