# SERVELECT WORK OS — rulare în Visual Studio Code

## 1. Deschidere proiect

Deschide folderul rădăcină `servelect-work-os` în Visual Studio Code sau deschide fișierul:

```text
servelect-work-os.code-workspace
```

## 2. Extensii recomandate

VS Code va propune automat extensiile din `.vscode/extensions.json`:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Nightly
- Path Intellisense
- Expo Tools

## 3. Comenzi principale în terminal

```powershell
corepack enable
corepack install -g pnpm@11.5.1
pnpm install
pnpm --filter @servelect/web dev
```

Apoi deschide:

```text
http://localhost:3000
```

## 4. Comenzi din VS Code

Apasă `Ctrl + Shift + P` → `Tasks: Run Task` și alege:

- `SERVELECT: install dependencies`
- `SERVELECT: dev web`
- `SERVELECT: dev web port 3001`
- `SERVELECT: build web`
- `SERVELECT: typecheck web`
- `SERVELECT: clean web cache`
- `SERVELECT: dev mobile`

## 5. Structură importantă

```text
apps/web/app/              paginile Next.js App Router
apps/web/components/       componente UI web
apps/web/lib/store.ts      state global demo
packages/shared/src/       types + mock data comune web/mobile
apps/mobile/               schelet Expo React Native
```

## 6. Fixuri incluse în acest pachet

- `apps/web/postcss.config.js` a fost redenumit în `postcss.config.cjs`, ca să funcționeze cu `"type": "module"`.
- Clasa invalidă Tailwind `hover:bg-white/7` a fost înlocuită cu `hover:bg-white/10`.
- A fost adăugat setup complet pentru Visual Studio Code.

## 7. Când apare eroare de cache Next.js

Rulează:

```powershell
.\scripts\clean-web.ps1
pnpm --filter @servelect/web dev
```

## 8. Când instalarea devine stricată

Rulează:

```powershell
.\scripts\reset-install.ps1
```
