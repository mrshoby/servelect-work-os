# V7.0.0 QA Report

## QA inclus in apply script

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

## Smoke tests incluse

- `scripts/work-os-v700-functional-test.ps1`
- `scripts/audit-v700-screenshots.mjs`

## Status sincer

QA nu a fost executat pe masina utilizatorului in momentul generarii ZIP-ului. Apply script-ul este responsabil sa ruleze QA local. Buildul nu trebuie considerat final daca typecheck/lint/build sau route smoke pica.

## Warning-uri acceptabile temporar

Warning-uri vechi de unused vars pot exista; erorile noi din v7 trebuie reparate imediat.
