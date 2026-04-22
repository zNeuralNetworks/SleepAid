# Sleep Aid

Sleep Aid is an offline, mobile-first React app for sleep hygiene, relaxation, sleep stories, NSDR/PMR guidance, and browser-generated soundscapes.

## Stack

- React 19
- Vite 6
- TypeScript
- Tailwind CSS 4
- Framer Motion
- lucide-react

## Local Development

Prerequisite: Node.js 20+

```bash
npm install
npm run dev
```

Default dev URL: `http://localhost:3000`

## Verification

```bash
npm run check
```

This runs TypeScript checking and a production Vite build.

## Production Container

```bash
docker build -t sleep-aid:local .
docker run --rm -p 8080:8080 sleep-aid:local
```

Open `http://localhost:8080`.

## GCP Deployment

`cloudbuild.yaml` builds the Docker image, pushes it to Artifact Registry, and deploys it to Cloud Run.

Default substitutions:

| Substitution | Value |
| --- | --- |
| `_REGION` | `us-central1` |
| `_SERVICE` | `sleep-aid` |
| `_AR_REPO` | `sleep-aid` |

Expected GitHub target: `https://github.com/zNeuralNetworks/SleepAid`

Before enabling the Cloud Build trigger, confirm the GCP project has Cloud Build, Artifact Registry, and Cloud Run APIs enabled and that the Cloud Build service account has permission to create Artifact Registry repositories and deploy Cloud Run services.
