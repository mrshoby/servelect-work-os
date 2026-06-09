# v6.4.6 — QA/build report

## Verificări statice adăugate în script

Scriptul `APPLY_SERVELECT_WORK_OS_V6_4_6_STRICT_AUDIT_REPAIR.ps1` verifică explicit:

- să nu existe `=> undefined`;
- să nu existe `CompletionFooter`;
- să nu existe `Backend TODO`;
- să existe KPI-urile lipsă din v6.4.5;
- pagina Tabel să nu mai afișeze KPI strip (`pageId !== "table"`);
- Board să aibă grid de 7 KPI cards;
- Calendar filters să fie stateful;
- `Fixează coloane` să aibă state real;
- filtrul `overdue` să nu fie duplicat;
- footerul să fie `v6.4.6`.

## Comenzi rulate de script pe PC-ul local

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

Nu declar succes build până nu trec aceste comenzi pe repo-ul local al utilizatorului și/sau în Vercel.
