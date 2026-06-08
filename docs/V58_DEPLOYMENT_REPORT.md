# v5.8.0 Deployment Report

Deployment workflow:

1. Download update pack ZIP to Downloads.
2. Extract ZIP using provided PowerShell command.
3. Copy patch files into local source repo.
4. Update versions to 5.8.0.
5. Run `pnpm typecheck` and `pnpm build`.
6. Commit and push to GitHub.
7. Vercel deploys from GitHub main branch.

No final project copy in Downloads is required. Downloads is used only for the update ZIP, extracted temp folder and optional logs.
