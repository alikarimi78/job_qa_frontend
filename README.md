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
- `src/pages/` — one folder per page; each holds the page component, its own `hooks/` (all state
  and requests live there, so the `.jsx` files only render), `components/` used by that page alone,
  and a `constants.js` for its settings. `MainLayout/` is the signed-in frame (header, sidebar),
  `AdminLayout/` loads the current account for the admin sections, `NotFound/` and `Unauthorized/`
  are the 404 and 403 pages.
- `src/routes/` — the route tree (`AppRoutes.jsx`), the sign-in/role guard (`ProtectedRoute.jsx`),
  every URL (`paths.js`) and redirects from old addresses
- `src/components/` — only what more than one page uses: `ui/` primitives, `icons/` the icon set,
  `dialogs/`, `account/` forms, and `job/` (the job boxes `JobDetails/` and the editor `JobForm/`)
- `src/hooks/` — hooks shared by several pages
- `src/services/` — the whole API surface, one RTK Query file per backend router
- `src/store/` — the auth slice, persisted with redux-persist
- `src/constants/` — roles, labels and column order mirrored from the backend
- `src/utils/` — plain functions: error translation, Persian dates and numbers, text matching
- `tailwind.config.js` — the theme (Vazirmatn font, z-index layers, modal animation); the font
  itself is self-hosted in `src/assets/fonts/` and declared in `src/styles.css`

Every source file starts with a one- or two-sentence comment saying what it is for.
