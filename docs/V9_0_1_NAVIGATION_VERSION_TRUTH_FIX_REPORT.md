# v9.0.1 Navigation Unification & Release Truth Fix Report

## Problem

The site exposed two navigation concepts:

- `Taskuri` from the main dashboard navigation;
- a second internal shell showing `SERVELECT Work OS` with stale label `v9.0.1 · Unified Taskuri Navigation / Release Truth Fix`.

This made the product feel split into two apps and created release/version confusion.

## Fix

- `Taskuri` is now the canonical execution entry.
- v90 command pages no longer render the internal Work OS sidebar/brand block.
- `/work-os/*` remains available as compatibility/cross-module surface, but not as a second primary menu.
- Release manifest exports restored.
- Version truth updated to v9.0.1.
- TypeScript error `ok is specified more than once` fixed.
- A local audit scans for stale `v9.0.1` / `Unified Taskuri Navigation / Release Truth Fix` strings.

## Not changed

- Global production writes remain disabled.
- Provider credentials are still expected via runtime ENV only.
- v9.1 should continue with DB-backed provider dispatch and webhook intake ledger.

