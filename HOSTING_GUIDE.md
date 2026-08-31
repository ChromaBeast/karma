# Karma Production Hosting & Real Database Guide

This guide walks you through connecting a real PostgreSQL + `pgvector` database and deploying the Karma monorepo to production.

---

## 1. Setting Up the Database (PostgreSQL + pgvector)

Karma requires PostgreSQL with the `pgvector` extension for semantic career node retrieval and ATS resume matching.

### Option A: Supabase (Recommended — Free Tier)
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Under **Project Settings -> Database**, locate your **Connection String** (use **Transaction Pooler** or **Session Pooler**).
3. Under **Database -> Extensions**, confirm that `vector` and `pgcrypto` are enabled (Supabase enables `vector` by default).
4. Copy the connection URI:
   ```env
   DATABASE_URL=postgres://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
   ```

### Option B: Neon.tech (Serverless Postgres)
1. Go to [neon.tech](https://neon.tech) and create a free PostgreSQL project.
2. In the Neon SQL Console, run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   ```
3. Copy the connection string from the dashboard:
   ```env
   DATABASE_URL=postgres://[USER]:[PASSWORD]@[ENDPOINT].neon.tech/neondb?sslmode=require
   ```

### Option C: Local Docker (100% Free / Offline)
Run PostgreSQL 16 with `pgvector` and Redis locally using the included `docker-compose.yml`:
```bash
docker compose up -d
```
Connection string:
```env
DATABASE_URL=postgres://postgres:postgrespassword@localhost:5432/karma?sslmode=disable
```

---

## 2. Deploying the Go API Backend (`apps/api`)

The Go backend compiles to a minimal, high-performance Docker container (~15MB) using the provided `apps/api/Dockerfile`.

### Deploying on Railway:
1. Go to [railway.app](https://railway.app) and click **New Project -> Deploy from GitHub Repo**.
2. Select your `karma` repository.
3. Set the **Root Directory** to `apps/api`.
4. Under **Variables**, add:
   - `DATABASE_URL`: *(Your Supabase or Neon PostgreSQL URL)*
   - `PORT`: `8080`
   - `JWT_SECRET`: *(A secure 32+ character random string)*
5. Railway automatically builds the Dockerfile and assigns a public HTTPS URL (e.g. `https://api-karma.up.railway.app`).

### Deploying on Render:
1. Go to [render.com](https://render.com) -> **New Web Service**.
2. Connect your repo, choose **Docker** runtime with root directory `apps/api`.
3. Add your `DATABASE_URL` environment variable.

---

## 3. Deploying the Next.js Frontend (`apps/web`)

### Deploying on Vercel:
1. Go to [vercel.com](https://vercel.com) and import your `karma` repository.
2. Set **Root Directory** to `apps/web`.
3. In **Environment Variables**, set:
   ```env
   NEXT_PUBLIC_API_URL=https://api-karma.up.railway.app/v1
   ```
4. Click **Deploy**. Vercel will build and host your Next.js application globally on edge CDN with free SSL.

---

## 4. Local Development Workflow

1. **Start Database & Redis:**
   ```bash
   docker compose up -d
   ```

2. **Start Backend API:**
   ```bash
   cd apps/api
   export DATABASE_URL="postgres://postgres:postgrespassword@localhost:5432/karma?sslmode=disable"
   go run ./cmd/server
   ```
   *(Migrations run automatically on startup).*

3. **Start Frontend Web:**
   ```bash
   pnpm --filter @karma/web dev
   ```
   Open `http://localhost:3000`.
