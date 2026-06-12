# SERVELECT WORK OS v7.1.1 — Backend Mutation Adapter Typecheck Fix

Hotfix punctual peste v7.1.0.

## Problemă

TypeScript strict a refuzat transmiterea `V71MutationRequest<V71TaskMutationPayload>` și `V71MutationRequest<V71TicketMutationPayload>` către `auditFrom`, deoarece `auditFrom` cerea `V71MutationRequest<Record<string, unknown>>`.

## Rezolvare

`auditFrom` este acum generic:

```ts
function auditFrom<TPayload>(request: V71MutationRequest<TPayload>, ...)
```

## Scope

- fără redesign;
- fără rute noi;
- fără demo separat;
- păstrează direcția v7.1: backend mutation adapter + server notification model.
