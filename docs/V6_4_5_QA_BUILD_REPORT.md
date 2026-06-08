# v6.4.5 QA build report

Acest pachet este pregătit să ruleze local:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

În container nu există workspace-ul instalat complet cu `node_modules`, deci rezultatul final trebuie confirmat pe PC-ul local în `D:\01_digitalizare_automatizare\servelect-work-os-main`.

Scriptul oprește commit/push dacă una dintre comenzile QA eșuează.

Static checks incluse în apply script:

- nu există `=> undefined` în `V64TaskuriFunctionalArea.tsx`;
- nu există `CompletionFooter`;
- există `TaskuriReferenceFooter`;
- nu există `Backend TODO` în UI;
- există `applySavedView`;
- KPI-urile nu mai folosesc `assigneeId === "u1"` / `createdBy === "u1"` / `ownerId === "u1"`.
