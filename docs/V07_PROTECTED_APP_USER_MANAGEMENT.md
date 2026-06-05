# SERVELECT WORK OS v0.7 — Protected App + User Management

v0.7 finalizează fundația de acces după v0.6 Auth + RBAC Foundation.

## Scop

Aplicația rămâne deployment-safe pe Vercel, dar are acum fundația pentru:

- protected app prin middleware;
- pagină `/unauthorized`;
- zonă nouă `/admin/users` pentru Utilizatori & RBAC;
- impersonare demo controlată;
- endpoint API pentru verificarea unei permisiuni;
- endpoint API pentru citire / patch demo user;
- integrare vizuală în HR & Admin și sidebar.

## Fișiere principale

- `apps/web/middleware.ts`
- `apps/web/app/unauthorized/page.tsx`
- `apps/web/app/admin/users/page.tsx`
- `apps/web/components/admin/UserManagementPanel.tsx`
- `apps/web/lib/auth/guard.ts`
- `apps/web/app/api/v1/auth/authorize/route.ts`
- `apps/web/app/api/v1/auth/impersonate/route.ts`
- `apps/web/app/api/v1/auth/users/[id]/route.ts`

## Cum funcționează protecția

Implicit:

```env
SERVELECT_REQUIRE_AUTH=false
```

În acest mod, aplicația rămâne demo public și nu blochează Vercel.

Când setezi:

```env
SERVELECT_REQUIRE_AUTH=true
```

middleware-ul verifică cookie-ul `servelect_emp_session`. Dacă lipsește, utilizatorul este trimis la `/login?next=...`.

## Endpointuri noi

### POST `/api/v1/auth/authorize`

Body:

```json
{ "permission": "admin:manage" }
```

Răspuns:

```json
{ "ok": true, "data": { "allowed": true } }
```

### POST `/api/v1/auth/impersonate`

Schimbă sesiunea demo pe un user existent.

Body:

```json
{ "email": "andrei.popescu@servelect.ro" }
```

### GET/PATCH `/api/v1/auth/users/[id]`

Citește sau simulează modificarea unui user demo. Persistarea reală este planificată după DB/Auth complet.

## Limitări intenționate

- Nu activează încă Auth.js / SSO real.
- Nu persistă modificările userilor în DB.
- Nu blochează automat toate componentele UI pe permisiuni; pregătește fundația.

## Următorul pas

v0.8 poate fi:

- Auth.js / Microsoft / Google SSO;
- user management persistent în PostgreSQL;
- protectarea reală a API route handlers pe permisiuni;
- ecran de roluri custom și policy editor.
