# v6.4.16 QA Report

Scriptul de aplicare ruleaza local, in ordine:
1. pnpm typecheck
2. pnpm lint
3. pnpm build
4. next start local pe 127.0.0.1:3100
5. capturi reale pentru cele 10 rute Taskuri

Validarea finala ramane pe PC-ul utilizatorului, deoarece doar acolo exista repo-ul local actual, cache-ul browserului si localStorage-ul care au produs problema reala.
