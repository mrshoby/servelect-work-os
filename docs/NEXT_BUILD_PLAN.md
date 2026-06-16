# SERVELECT WORK OS — NEXT BUILD PLAN

Current technical line: v11.0.1 — Next.js 15 Route Context Build Fix for Major Taskuri Workspace Redesign.

## Current status

- v10.0.3 stabilized Taskuri route/API smoke at 27 / 27.
- v11.0.0 introduced the major Taskuri workspace redesign but failed local `pnpm build` because the dynamic API route `[section]` used a synchronous params type that is not compatible with Next.js 15 generated route context.
- v11.0.1 fixes that build blocker only.
- Source and interactive source audits passed for v11.0.0, but route/API and screenshot/manual UI audits were invalid because the failed build prevented the new UI from reaching Vercel.

## Canonical navigation rule

Taskuri remains the single canonical Work OS entry. `/work-os/*` remains compatibility routing only and must not introduce a second visible shell.

## Quality rule

Do not accept a build based only on HTTP 200 or screenshot existence. Manual UI density and browser interaction flow remain mandatory.

## Required next verification

1. Run `pnpm typecheck`.
2. Run `pnpm build`.
3. Run `node scripts/audit-v1101-source.mjs`.
4. Commit and push v11.0.1.
5. Wait for Vercel deployment.
6. Run `scripts/work-os-v1101-functional-test.ps1` against Vercel.
7. Rerun v11 screenshot/manual UI density audit.

## Next major build after v11 is technically deployed

v12.0.0 — Real Drag/Drop Board Persistence, Gantt Edit Engine, Provider Mutation Adapter & Browser Flow QA.

Do not start v12 until v11.0.1 builds and the v11 UI is visible on Vercel.
