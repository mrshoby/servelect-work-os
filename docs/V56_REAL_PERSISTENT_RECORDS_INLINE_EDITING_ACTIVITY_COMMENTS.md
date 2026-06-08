# SERVELECT WORK OS v5.6.0 — Real Persistent Records, Inline Editing & Activity Comments

## Scop

v5.6.0 continuă corect roadmap-ul după v5.5.0. v5.5 a adus interacțiuni task/project execution: task drawer, quick edit, bulk operations, saved views, dependencies, activity timeline și attachments UI.

v5.6.0 duce acele interacțiuni către zona de recorduri persistente, inline editing și activity comments, păstrând comportamentul sigur `shadow-safe` până la v5.7.

## De ce este pe calea bună față de promptul inițial

Promptul inițial cerea o platformă Work OS, nu un dashboard de energie/stocuri. v5.6 păstrează centrul aplicației pe:

- proiecte;
- taskuri;
- subtaskuri/checklist;
- comentarii/activity;
- atașamente;
- time/pontaj;
- aprobări;
- roluri și permisiuni;
- legături către IoT, mentenanță, materiale și CRM ca module operaționale.

## Rute noi

- `/work-os/persistent-records`
- `/work-os/status`
- `/api/v1/work-os/persistent-records`
- `/api/v1/work-os/status`

## Status/procente vizibile pe site

v5.6 reintroduce explicit statusul pe categorii:

- Website/Web App
- Task & Project Core
- Backend/API
- Database/Prisma/Seed
- Auth/RBAC
- IoT/Ops
- Mobile App

Procentele sunt orientative și sunt bazate pe capabilitățile existente în cod și pe ce este vizibil pe site, nu pe promisiuni de producție completă.

## Siguranță write mode

v5.6 nu activează scrieri reale periculoase. Persistența reală rămâne pregătită, dar controlată prin `SERVELECT_WORK_OS_WRITE_MODE` și următorul build v5.7.

## Următorul build recomandat

v5.7.0 — Real Database Adapter Switchboard & Record Mutations.
