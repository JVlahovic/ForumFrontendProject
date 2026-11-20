# Forum Frontend

Angular single-page application for the forum backend. Standalone components, zoneless change
detection, Bootstrap styling, and role-aware UI.

> Built as the final project for the Logate Academy 2025–2026 course.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 21.2 (standalone components, zoneless) |
| Language | TypeScript 5.9 |
| Styling | Bootstrap 5.3.8 |
| HTTP | `HttpClient` + functional interceptor |
| State | `BehaviorSubject` (auth), plain fields + `ChangeDetectorRef` |
| Tests | Vitest |

---

## Features

- Login, registration with email verification, password reset (code → new password).
- Category home page with role-based visibility.
- Thread list per category, create thread, thread detail with paginated replies.
- Reply, edit own post, delete own post; moderator/admin pin/lock/delete thread.
- **Global thread search** (navbar, logged-in only): results grouped by category.
- User panel: profile, threads started, change password.
- Admin panel: user search (username / role), ban/unban, role assignment, category management.
- Route guards: `authGuard`, `adminGuard`.
- Auth interceptor attaches `Bearer` token and detects expired tokens.

---

## Requirements

- **Node.js 20+** and **npm 10+**
- A running backend (default `http://localhost:8090`)

---

## Environment Configuration

Angular never ships secrets. The only configuration is the **public API base URL**, and it is
swapped at **build time** via `fileReplacements`.

| File | Used by | Purpose |
|------|---------|---------|
| `src/environments/environment.ts` | `ng serve` (development) | Local API URL |
| `src/environments/environment.prod.ts` | `ng build` (production) | Deployed API URL |

```ts
// environment.ts (development)
export const Environment = {
  production: false,
  apiUrl: 'http://localhost:8090/api',
};
```

```ts
// environment.prod.ts (production)
export const Environment = {
  production: true,
  apiUrl: 'https://your-backend.example.com/api',
};
```

`angular.json` → `projects.forum-frontend.architect.build.configurations.production.fileReplacements`:

```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

### Rules

- **Commit both files** — Vercel builds from the repository and needs `environment.prod.ts`.
- **Never put secrets here.** The API URL is public; authentication is a JWT stored in
  `localStorage`.
- To point at a different backend: edit the relevant file, then rebuild/redeploy.
- Verify which file was baked into a build:

  ```bash
  grep -o "localhost:8090\|your-backend.example.com" dist/forum-frontend/browser/main-*.js | sort -u
  ```

---

## Install & Run

```bash
npm install
npm start
```

Open **http://localhost:4200**.

The backend must be running and its CORS must allow `http://localhost:4200` (see the backend
README's `CORS_ALLOWED_ORIGINS`).

---

## Build

```bash
npm run build
```

Output: **`dist/forum-frontend/browser/`** (the folder to deploy — it contains `index.html`).

Other scripts:

| Script | Command | Purpose |
|--------|---------|---------|
| `start` | `ng serve` | Dev server (development config) |
| `build` | `ng build` | Production build |
| `watch` | `ng build --watch --configuration development` | Incremental dev build |
| `test` | `ng test` | Vitest unit tests |

---

## Routes

| Path | Component | Guard |
|------|-----------|-------|
| `''` | Home (categories) | — |
| `login` | Login | — |
| `register` | Register | — |
| `verify` | Verify email | — |
| `forgot-password` | Forgot password | — |
| `category/:categoryId` | Thread list | — |
| `category/:categoryId/new` | Create thread | — |
| `thread/:threadId` | Thread detail | — |
| `rules` | Category redirect | — |
| `announcements` | Category redirect | — |
| `search` | Global thread search | `authGuard` |
| `user-panel` | User panel | `authGuard` |
| `admin-panel` | Admin panel | `adminGuard` |

---

## Deployment (Vercel)

1. Push the project to GitHub.
2. In Vercel: **Add New → Project** → import the repo.
3. Build settings:
  - **Framework Preset:** Angular (or Other)
  - **Root Directory:** repository root (where `package.json`/`angular.json` live)
  - **Install Command:** `npm ci`
  - **Build Command:** `ng build`
  - **Output Directory:** `dist/forum-frontend/browser`
4. `vercel.json` provides the SPA fallback so deep links work:

   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

5. Set `environment.prod.ts` → `apiUrl` to the backend's public **HTTPS** URL (Vercel is HTTPS;
   a plain-HTTP backend is blocked as mixed content).
6. Ensure the backend's `CORS_ALLOWED_ORIGINS` includes the Vercel production domain.
7. After changing the API URL, push again — Vercel redeploys automatically.

---

## Project Structure

```
src/app/
├── components/
│   ├── home/            # category list
│   ├── login/ register/ verify/
│   ├── forgot-password/ # two-step reset
│   ├── navbar/          # links, username, logout, global search
│   ├── thread-list/     # threads in a category
│   ├── thread-create/
│   ├── thread-detail/   # OP + replies + edit/delete + moderation
│   ├── search/          # global thread search (grouped by category)
│   ├── user-panel/      # profile, threads, change password
│   ├── change-password/
│   ├── admin-panel/     # user search + categories
│   └── category-redirect/
├── guards/              # authGuard, adminGuard
├── interceptors/        # auth-interceptor (Bearer token)
├── models/              # request/response interfaces
└── services/
    ├── api/api-auth.service.ts
    ├── api/api-forum.service.ts
    ├── api/api-user.service.ts
    ├── api/api-admin.service.ts
    └── api/error.util.ts
```

---

## Error Handling

All HTTP errors pass through `extractErrorMessage()`:

- `text/plain` bodies from the backend are shown as-is;
- structured bodies fall back to `message`/`detail`;
- network failures (`status 0`) show a connectivity message;
- otherwise a status-based message (401/403/404/409/422/500...) is used.

Because the app is **zoneless**, each async callback calls
`ChangeDetectorRef.detectChanges()` after mutating state — keep this pattern for new components.

---

## Troubleshooting

| Symptom | Cause / Fix |
|---------|-------------|
| Every call fails with `status 0` | Backend not running, wrong `apiUrl`, or CORS blocked |
| Red alert says “OK” / empty | Pre-fix behavior — ensure `error.util.ts` has the hardened implementation |
| Prod build still calls `localhost:8090` | `fileReplacements` missing or wrong env file |
| Deep links 404 on Vercel | Missing `vercel.json` rewrite |
| Admin token rejected | Role not ADMIN in DB, or token expired |
| Search returns nothing | You lack view access to matching categories, or no title match |

---

## License

Educational project.
