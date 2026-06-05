# SERVELECT WORK OS v0.6 — Auth + RBAC Foundation

## Scop

v0.6 introduce baza de autentificare și permisiuni fără să blocheze deploy-ul Vercel și fără să forțeze încă un provider extern de auth.

Aplicația rămâne task-first și modulele operaționale rămân integrate în Work OS.

## Ce include

- pagină nouă `/login`;
- endpointuri API:
  - `GET /api/v1/auth/session`;
  - `POST /api/v1/auth/login`;
  - `POST /api/v1/auth/logout`;
  - `GET /api/v1/auth/users`;
  - `GET /api/v1/auth/permissions`;
- sesiune cookie HTTP-only demo;
- roluri și permisiuni centralizate în `apps/web/lib/auth/permissions.ts`;
- integrare RBAC cu endpointurile existente din v0.4/v0.5;
- topbar actualizat cu utilizatorul curent, status auth, schimbare utilizator și logout demo;
- mod deployment-safe: aplicația merge și fără variabile de mediu.

## Moduri de lucru

### Demo public, default

```env
SERVELECT_REQUIRE_AUTH=false
SERVELECT_DEMO_PASSWORD=""
```

În acest mod, API-ul rămâne compatibil cu demo-ul public. Dacă nu există cookie, folosește fallback demo administrator pentru a nu bloca testarea.

### Demo cu parolă

```env
SERVELECT_DEMO_PASSWORD="o-parola-demo"
```

Login-ul cere parola setată.

### Protecție API write

```env
SERVELECT_REQUIRE_AUTH=true
```

În acest mod, endpointurile write care folosesc `hasPermission(...)` cer sesiune cookie autentificată sau headere interne `x-servelect-user-email` / `x-servelect-role`.

## Utilizatori demo

Utilizatorii vin din `@servelect/shared`:

- Andrei Popescu — Administrator;
- Ioana Marinescu — Inginer proiectant;
- Mihai Ionescu — Tehnician senior;
- Cristian Radu — Tehnician;
- Alexandra Rusu — Financiar;
- George Stan — Tehnician;
- Vlad Neagu — Electrician.

## Testare rapidă

```powershell
.\scripts\test-auth-endpoints.ps1 -BaseUrl "https://site-ul-tau.vercel.app"
```

Sau manual:

```text
/api/v1/auth/session
/api/v1/auth/users
/api/v1/auth/permissions
/login
```

## Ce nu este încă producție reală

- nu există încă provider Auth.js/SSO;
- nu există încă JWT semnat real;
- cookie-ul demo este payload base64url, nu token criptografic;
- nu există resetare parolă;
- nu există invitații utilizatori.

Acestea sunt planificate pentru v0.7+ după stabilizarea DB și a API-urilor.
