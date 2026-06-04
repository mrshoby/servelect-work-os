# SERVELECT WORK OS — v0.5 Database + Prisma Activation

## Scop

v0.5 introduce stratul de persistare reală pentru backend, fără să rupă deployment-ul existent pe Vercel.

Aplicația rămâne stabilă pe `SERVELECT_DATA_PROVIDER=mock`, dar codul are acum provider opțional `prisma` pentru PostgreSQL.

## Ce include v0.5

- `repository.ts` devine un selector de provider: `mock` sau `prisma`.
- `repository.mock.ts` păstrează comportamentul v0.4, rapid și sigur.
- `repository.prisma.ts` adaugă operații reale pentru proiecte/taskuri folosind Prisma.
- `prisma-client.ts` face import dinamic pentru `@prisma/client`, ca build-ul să nu pice până nu activezi DB.
- `prisma-mappers.ts` mapează enum-urile românești UI ↔ enum-uri Prisma-safe.
- Endpointuri DB:
  - `GET /api/v1/db/mode`
  - `GET /api/v1/db/status`
  - `POST /api/v1/db/seed`
- Scripturi PowerShell pentru instalare Prisma, migrate și seed.

## Mod implicit sigur

În Vercel, dacă nu setezi nimic, aplicația merge în continuare cu mock server-side:

```env
SERVELECT_DATA_PROVIDER=mock
```

## Activare PostgreSQL + Prisma

### 1. Creează o bază PostgreSQL

Poți folosi:

- Vercel Postgres / Neon
- Supabase PostgreSQL
- Railway PostgreSQL
- Render PostgreSQL

Ai nevoie de connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/servelect_work_os?sslmode=require"
```

### 2. Instalează Prisma dependencies local o singură dată

În repo:

```powershell
.\scripts\prisma-install.ps1 -Repo "."
```

Asta va modifica:

- `apps/web/package.json`
- `pnpm-lock.yaml`

Fă commit după instalare:

```powershell
git add apps/web/package.json pnpm-lock.yaml
git commit -m "Install Prisma dependencies"
git push
```

### 3. Setează Vercel Environment Variables

În Vercel Project → Settings → Environment Variables:

```env
SERVELECT_DATA_PROVIDER=prisma
DATABASE_URL=...
SERVELECT_SEED_TOKEN=un-token-lung
```

### 4. Rulează migrate deploy

Local, cu `DATABASE_URL` setat:

```powershell
$env:DATABASE_URL="postgresql://..."
.\scripts\prisma-migrate-deploy.ps1 -Repo "."
```

Sau în Vercel poți rula comanda de migrate dintr-un workflow separat mai târziu.

### 5. Seed inițial

După deploy cu Prisma activ:

```powershell
.\scripts\seed-real-db.ps1 -BaseUrl "https://site-ul-tau.vercel.app" -SeedToken "tokenul-din-vercel"
```

## Endpointuri de verificare

```text
/api/v1/health
/api/v1/db/mode
/api/v1/db/status
/api/v1/projects
/api/v1/tasks
```

## Important

v0.5 nu schimbă UI-ul. Este o versiune de backend/persistence. După ce confirmăm că v0.5 este stabilă, următoarea versiune logică este:

```text
v0.6 — Auth + RBAC real + login protected app
```
