# SERVELECT WORK OS v6.8.0 — Real Persistence/API Unification

## Scope

v6.8.0 adds a control layer for moving SERVELECT WORK OS from local interactive mock/localStorage toward API adapter, Prisma shadow and later Prisma primary persistence.

## Added routes

- `/work-os/persistence-api`
- `/work-os/real-api-unification`
- `/admin/persistence-api`
- `/api/v1/work-os/persistence-api`
- `/api/v1/work-os/persistence-api/health`
- `/api/v1/work-os/persistence-api/mutations`

## Domains covered

Tasks, projects, tickets, notifications, approvals, CRM, stock, IoT, pontaj and documents.

## Important truth

This build does not yet enable destructive primary DB writes. It defines readiness, contracts, RBAC gates, audit requirements, rollback requirements and route-level API health so the next builds can safely promote domains toward real persistence.
