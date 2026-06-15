# v9.7.0 — Portfolio Program Board, WorkGraph & Reporting Command Layer

## Scope

Build major incremental peste v9.6.0. Nu creează aplicație separată și nu reintroduce shell paralel Work OS. Taskuri rămâne entry-ul canonic.

## Implemented

- Program board operațional în Taskuri.
- WorkGraph cross-module pentru proiecte, taskuri, tickets, evidence, decisions și workload.
- Reporting command layer pentru executive, SLA, workload și evidence readiness.
- Resource portfolio și saved layouts pentru compact density / command navigation.
- Admin reporting governance.
- API v97 pentru program board, WorkGraph, reporting, SLA/evidence, resource portfolio, saved layouts și readiness.

## Gates

- Global production writes: OFF / pilot gated.
- No second Work OS shell.
- No standalone app surface.
- Screenshots and source audit required before next build.

## Next

v9.8.0 — Advanced portfolio permissions, report exports and persisted layout preferences.
