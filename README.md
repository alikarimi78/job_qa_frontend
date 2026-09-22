# Job Analyse — React frontend

React + Vite client for the backend in `../job_qa_backend`.

## Local development
```bash
npm install
npm run dev        # http://localhost:5173  (proxies /api -> localhost:8000)
```

## Production (Docker)
The `Dockerfile` builds the bundle and serves it with nginx; `nginx.conf` proxies `/api/*` to the
`api` container, so no CORS configuration is needed. Add a `web` service built from this folder to the
backend's docker-compose.yml, then `docker compose up -d --build web` (app on the mapped port).

## Structure
- `src/services/` — the whole API surface, one RTK Query file per backend router
- `src/store/` — the auth slice, persisted with redux-persist
- `src/pages/` — routed pages; `pages/manage/` holds the admin sections
- `src/components/` — shared components; `components/ui/` the primitives
- `src/constant/` — labels, menu and column order mirrored from the backend
