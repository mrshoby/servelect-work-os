# v9.0.4 — Unified Taskuri Navigation Shell Fix Report

## Problemă confirmată
Căutarea locală a arătat că `apps/web/components/work-os/V79PrimaryWritePilotClient.tsx` încă randă un `aside` intern întunecat cu `SERVELECT / Work OS` și etichetă veche de release. Acesta creează al doilea meniu în paginile Taskuri.

## Fix
- Elimină sidebar-ul intern/paralel din `V79PrimaryWritePilotClient.tsx`.
- Păstrează `Taskuri` ca navigație canonică.
- Actualizează release truth la v9.0.4.
- Adaugă audit sursă care blochează `hidden w-72`, `legacy v7_9 label · legacy provider/ACL/primary-pilot label` și `legacy provider/ACL/primary-pilot label`.
- Adaugă test live pentru rutele relevante.

## Criteriu acceptare
- `pnpm typecheck` PASS
- `pnpm lint` PASS
- `pnpm build` PASS
- `node scripts/audit-v904-unified-navigation-source.mjs` PASS
- `./scripts/work-os-v904-navigation-shell-test.ps1 -BaseUrl https://servelect-work-os-web.vercel.app` PASS
- Screenshoturile nu mai arată al doilea meniu întunecat Work OS în `/taskuri`.

