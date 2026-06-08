# v6.4.4 QA/build report

Scriptul local rulează în această ordine:

1. Static assertions.
2. pnpm typecheck.
3. pnpm lint.
4. pnpm build.
5. git commit/push.

## Static assertions noi

- `function DocumentList` există.
- `function QuickStats` există.
- Sidebar folosește `(item.children ?? []).map`.
- Nu mai există `=> undefined` în `V64TaskuriFunctionalArea.tsx`.
- Alias routes există: overview, tickets-notificari, calendar-gantt, workload-aprobari.

## Notă

Nu declara final dacă `pnpm typecheck`, `pnpm lint` sau `pnpm build` pică local/Vercel.
