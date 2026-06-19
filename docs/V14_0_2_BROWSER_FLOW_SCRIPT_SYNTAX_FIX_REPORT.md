# v14.0.2 — Browser Flow Script Syntax Fix

## Scope

This hotfix repairs only the QA script syntax introduced in v14.0.1.

## Fixed issue

`audit-v1401-browser-flow.mjs` used an invalid JavaScript string:

```js
"type="date""
```

The script now uses a valid string literal:

```js
'type="date"'
```

## Rules preserved

- The audit still fails if required browser-flow markers are missing.
- The marker `setSelectedTaskId(task.id)` remains required.
- The marker `type="date"` remains required.
- The build does not weaken GoodDay route-specific content checks.
- The build does not add a second internal Taskuri menu.

## Next step

After this hotfix passes:

```powershell
node scripts/audit-v1401-browser-flow.mjs
node scripts/audit-v1402-browser-flow-script-syntax.mjs
```

Continue with Vercel validation and screenshots for v14 before moving to v15.
