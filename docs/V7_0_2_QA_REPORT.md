# V7.0.2 QA Report

Status inițial: v7.0.1 a picat la `pnpm typecheck` în `app/admin/release/page.tsx` deoarece `manifest.summary` nu mai expunea câmpurile cerute de UI.

Fix aplicat: `apps/web/lib/release/manifest.ts` expune câmpurile compatibile cu Release Console.

QA de rulat local:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

Buildul rămâne INCOMPLET până trec comenzile local pe repo-ul utilizatorului.
