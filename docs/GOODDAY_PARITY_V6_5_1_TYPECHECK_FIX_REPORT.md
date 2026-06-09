# SERVELECT WORK OS v6.5.1 - GoodDay parity typecheck fix

## Problema reparata

TypeScript error in components/work-os/GoodDayParityCoreClient.tsx:

pproval.entityKind avea tipul GoodDayEntityKind, care include si project, dar functia pushAudit accepta doar 	ask | ticket | approval | notification | time | automation.

## Fix aplicat

- Importat GoodDayEntityKind in GoodDayParityCoreClient.tsx.
- Schimbat semnatura pushAudit ca sa accepte GoodDayEntityKind.
- Astfel approval-urile legate de proiecte pot scrie audit log fara eroare TypeScript.

## UI / design

Nu s-a modificat UI-ul, layoutul sau designul.

## QA local

Scriptul ruleaza, daca nu este folosit -SkipQa:

- pnpm typecheck
- pnpm lint
- pnpm build

## Status

Hotfix punctual pentru build/typecheck v6.5.0 -> v6.5.1.
