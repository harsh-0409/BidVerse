# BidVerse — Bidding Website

BidVerse is a full‑stack bidding/auction web app.

- **Backend:** Spring Boot (Java 17), Spring Data JPA, MySQL
- **Frontend:** React + Vite
- **Reverse proxy (Docker):** Nginx serves the built frontend and proxies `/api` + `/uploads` to the backend

## Live Deployment

- **Frontend:** https://frontend-production-e286.up.railway.app/

If the app is taking a moment to wake up on first load, refresh once after a few seconds.

## Repository structure

- `bidverse-backend/` — Spring Boot API
- `bidverse-frontend/` — React client
- `docker-compose.yml` — runs MySQL + backend + frontend (nginx)

---

## Prerequisites (local run)

### Backend

- Java **17** (JDK 17)
- MySQL **8+**

### Frontend

- Node.js **18+** (recommended) + npm

---

## Run locally (recommended for development)

### 1) Backend (Spring Boot)

1. Make sure MySQL is running.
2. Configure DB credentials in `bidverse-backend/src/main/resources/application.properties`.

> Security note: don’t commit real passwords. Prefer environment variables or a local-only properties override.

Run the backend:

```powershell
cd "./bidverse-backend"
./mvnw.cmd spring-boot:run
```

Backend default URL:

- `http://localhost:8080`

### 2) Frontend (React + Vite)

Install deps:

```powershell
cd "./bidverse-frontend"
npm install
```

Start dev server:

```powershell
npm run dev
```

Open:

- `http://localhost:5174` (project config)

---

## Run with Docker (production-like)

This uses:

- MySQL container
- Spring Boot backend container (port **2000** inside the docker network)
- Nginx container serving the built frontend and proxying:
  - `/api/*` → backend
  - `/uploads/*` → backend

### Start containers

```powershell
docker compose up --build
```

Open:

- Frontend: `http://localhost:30021`

### Stop containers

```powershell
docker compose down
```

### Notes about docker ports

- `docker-compose.yml` maps frontend → `30021:80`
- Backend is routed via nginx using `http://backend:2000`

---

## Common commands

### Backend

```powershell
cd "./bidverse-backend"
./mvnw.cmd test
./mvnw.cmd clean package
```

### Frontend

```powershell
cd "./bidverse-frontend"
npm run build
npm run preview
```

---

## Troubleshooting

### MySQL connection issues (local)

- Verify MySQL is running and credentials in `application.properties` are correct.
- Default MySQL port is `3306`.

### Port already in use

- Local backend: `8080`
- Local frontend: `5174`
- Docker frontend: `30021`

---

## What to commit / not commit

- Commit: `docker-compose.yml`, `bidverse-backend/backend.Dockerfile`, `bidverse-frontend/frontend.Dockerfile`, `bidverse-frontend/nginx.conf`
- Don’t commit: secrets/passwords, `.env` containing secrets, build output (`target/`, `dist/`), `node_modules/`
