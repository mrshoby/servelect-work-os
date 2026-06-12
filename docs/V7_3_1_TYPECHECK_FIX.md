# v7.3.1 Typecheck Fix

Fixes TypeScript error in V73PrismaSchemaMigrationClient.tsx.

## Root cause
React select elements do not support the readOnly attribute. The v7.3.0 component used readOnly on a select controlled by runtime.writeMode.

## Fix
Replaced the invalid readOnly attribute with a no-op onChange handler.

## Scope
No redesign. No route changes. No backend activation. Typecheck-only hotfix.
