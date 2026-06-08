# Changelog — v5.5.0

## Added

- Task Execution Cockpit pentru pagina `Taskuri`.
- Saved views operaționale pentru lucru zilnic.
- Quick edit pentru status, prioritate, responsabil și deadline.
- Bulk operations safe pentru taskuri selectate.
- Kanban compact cu drag/drop.
- Dependency map `blocked by / blocking`.
- Timeline agregat de activitate și comentarii.
- Admin / Manager / Technician / Employee / Client interaction controls.
- Version metadata pentru release.
- Script local de aplicare, QA, ZIP, commit/push și Vercel.

## Changed

- `apps/web/app/taskuri/page.tsx` folosește noul `V55TaskExecutionCenter`.
- Package versions sunt actualizate de script la `5.5.0` unde există `package.json`.

## Safety notes

- Nu se activează permanent delete în noul UI v5.5.
- Nu se creează upload nesecurizat.
- Scrierile reale rămân responsabilitatea infrastructurii existente/write-mode.

## Known limitations

- Persistența reală a comentariilor/activity comments este planificată pentru v5.6.0.
- Upload-ul de atașamente rămâne conceptual până la integrarea storage real.
- Vercel deploy poate fi verificat automat doar dacă Vercel CLI este instalat și autentificat sau dacă repo-ul este conectat la Vercel prin GitHub.
