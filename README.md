# Job Analyse — React frontend

## Local development
```bash
npm install
npm run dev        # http://localhost:5173  (proxies /api -> localhost:8000)
```
Backend must be running on port 8000 (docker compose up in the backend repo).

## Production (Docker)
Copy this folder next to the backend project, add the `web` service from
`compose.snippet.yml` to the backend's docker-compose.yml, then:
```bash
docker compose up -d --build web
```
App: http://localhost:3000 — nginx serves the bundle and proxies `/api/*`
to the `api` container, so no CORS configuration is needed anywhere.

## Structure
- `src/api.js` — axios instance; attaches the JWT automatically
- `src/auth.jsx` — login state in React context + localStorage
- `src/App.jsx` — routes and role-based navbar
- `src/pages/` — Search (public), Login, Register, Suggest, MySuggestions, Admin
- `src/components/JobForm.jsx` — the 8-field form shared by users and admin
