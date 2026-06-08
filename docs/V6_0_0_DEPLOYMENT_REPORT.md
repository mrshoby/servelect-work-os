# v6.0.0 Deployment Report

## Deployment workflow

1. Download update ZIP to `C:\Users\Vlad Taran\Downloads`.
2. Extract update ZIP.
3. Apply patch files to `D:\01_digitalizare_automatizare\servelect-work-os-main`.
4. Update package versions to `6.0.0`.
5. Run `pnpm typecheck`.
6. Run `pnpm build`.
7. Commit and push to GitHub `main`.
8. Vercel deploys automatically from GitHub if connected.

## Commit message

`v6.0.0 - Enterprise operating layer and role-aware workflow engine`
