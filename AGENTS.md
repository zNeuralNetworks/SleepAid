# Sleep Aid Agent Notes

## Project Shape

- Vite + React + TypeScript single-page app.
- Styling is Tailwind CSS v4 through `@tailwindcss/vite`; do not reintroduce the browser CDN.
- App is offline/static today. There is no backend, auth, database, Gemini call path, or runtime secret requirement.
- Target deployment path is GitHub `zNeuralNetworks/SleepAid` to GCP Cloud Build, building a container and deploying to Cloud Run.

## Key Files

- `App.tsx`: app shell, lazy-loaded view routing, bottom navigation integration.
- `components/Dashboard.tsx`: circadian/sleep-pressure dashboard and sleep timing suggestions.
- `components/BreathingExercise.tsx`: relaxation modes, haptics, PMR flow, NSDR scripts, Web Audio soundscapes.
- `components/StoryMode.tsx`: static sleep story library and reader.
- `components/Roadmap.tsx`: in-app roadmap/status content.
- `index.css`: Tailwind import plus custom global theme, scrollbar, safe-area, animation, and prose utilities.
- `cloudbuild.yaml`: Artifact Registry build/push and Cloud Run deploy.
- `Dockerfile` + `nginx.conf`: production static build served by nginx on port `8080`.

## Working Rules

- Keep changes small and app-local. This is a mobile-first calming utility, not a marketing site.
- Prefer functional React components, typed data structures, and local constants for static content.
- Keep copy medically conservative: this can provide sleep hygiene and relaxation guidance, not diagnosis or treatment claims.
- Avoid adding services, environment variables, or network calls unless the feature explicitly needs them.
- If AI features return later, isolate client-visible configuration behind `VITE_*` vars and avoid putting private API keys in the browser.
- Use lucide-react icons for UI controls when available.

## Verification

Run before handing off code changes:

```bash
npm run check
```

For container/deploy changes, also run:

```bash
docker build -t sleep-aid:local .
docker run --rm -p 8080:8080 sleep-aid:local
```

Then open `http://localhost:8080`.

## Known Follow-Ups

- Add an ESLint/Prettier policy before broad refactors.
- Consider moving long static content arrays into `data/` modules if feature work expands.
- Consider a Playwright smoke test for the four main navigation views before public launch.
