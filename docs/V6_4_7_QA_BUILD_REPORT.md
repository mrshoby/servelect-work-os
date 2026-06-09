# v6.4.7 QA build report

Scriptul de aplicare rulează obligatoriu:

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

În mediul ChatGPT nu pot confirma buildul Vercel final, pentru că repo-ul local și Vercel rulează pe calculatorul utilizatorului / GitHub. Scriptul oprește procesul dacă una dintre comenzi eșuează.

Audit static inclus în script:

- fără `=> undefined`;
- fără `CompletionFooter`;
- fără text vizibil `Backend TODO`;
- versiune footer `v6.4.7`;
- `ReferenceGantt` prezent;
- Calendar/Gantt 1:1 column ratio prezent;
- Calendar bottom grid cu 5 panouri prezent;
- Table saved-view strip prezent;
- pinned columns stateful;
- un singur guard pentru overdue saved view.
