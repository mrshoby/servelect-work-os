# v6.4.16 Runtime and Screenshot Audit Fix

Auditul v6.4.15 a confirmat ca rutele raspund HTTP 200, dar capturile reale au ramas FAIL. Screenshot-ul /taskuri/tabel a indicat CSS neaplicat in captura, iar celelalte rute au ajuns la client-side exception.

Fixuri aplicate strict:
- storage key nou v6416 pentru a evita localStorage corupt din iteratiile vechi;
- migrare/normalizare pentru taskuri, proiecte, tickete si saved views vechi;
- array fallback pentru checklist/comments/attachments/dependencies/tags/activityLog;
- fix Rules of Hooks in TaskDrawer: useState nu mai este dupa return conditionat;
- script screenshot audit cu profil browser curat si virtual-time-budget pentru CSS/hydration;
- verificari statice pentru project.risks, normalizeTask si storage key v6416.

Nu este redesign nou. Scopul este ca buildul sa nu mai intre in client-side exception si ca screenshot-urile reale sa fie capturate corect pentru audit vizual.
