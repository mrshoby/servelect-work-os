# v6.4.2 — Taskuri GoodDay audit and build readiness fix

## Fixed

- Fixed strict TypeScript issue in `Sidebar.tsx` where `item.children` could be undefined.
- Added missing `DocumentList` component used by Proiecte active view.
- Added missing `QuickStats` component used by Board right panel.
- Added audit reports requested for 1:1 visual comparison, functional verification, persistence and QA.
- Added safer apply script with pre-QA targeted checks.

## Notes

- This is a build/audit fix over v6.4.0, not a new unrelated redesign.
- It preserves the v6.4.0 Taskuri routes and functional store.
- Full pixel-perfect validation still requires screenshot comparison after local/Vercel build.
