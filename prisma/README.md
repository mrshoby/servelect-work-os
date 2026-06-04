# Prisma / PostgreSQL foundation

v0.4 adaugă schema pentru backend real, dar aplicația Vercel rămâne funcțională și fără `DATABASE_URL` prin API mock.

Activare DB reală, în etapa următoare:

```bash
pnpm add -D prisma
pnpm add @prisma/client
```

Setează `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/servelect_work_os?schema=public"
```

Apoi:

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

Pentru producție, recomandăm PostgreSQL managed + connection pooling.
