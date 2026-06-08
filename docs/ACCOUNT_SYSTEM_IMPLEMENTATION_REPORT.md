# SERVELECT WORK OS v5.9.0 — Enterprise Accounts, Team Hierarchy, Role-Based Dashboards & GoodDay Compliance Hardening

Update major peste linia v5.8.0. Scopul este consolidarea Work OS-ului ca aplicație task-first, account-aware și RBAC-aware, fără a șterge modulele existente.

## Principii păstrate
- Nu se pornește de la zero.
- Nu se înlocuiește repo-ul cu mockup static.
- Se păstrează rutele Work OS existente.
- Conturile, echipele, RBAC și dashboardurile sunt integrate cu taskuri/proiecte/aprobări/materiale/audit.
- Scrierile reale rămân shadow-safe/demo până la activarea backendului real.

## Implementat
- `apps/web/lib/enterprise/work-os-enterprise-accounts.ts`
- `apps/web/lib/stores/account-store.ts`
- `/account`, `/account/profile`, `/account/settings`, `/account/security`, `/account/notifications`
- avatar fallback initials
- account settings demo-persistent-ready
- notification preferences
- security mock: password, 2FA, sessions, login history
- demo users extinși: Andrei, Ioana, Mihai, George, Alexandra, Cristian, Vlad, Diana, Bogdan, Client Demo

## Conturi demo
Toate conturile includ: username, avatar/initials, role, department, team, managerId, jobTitle, phone, location, timezone, language, status, presenceStatus, settings.
