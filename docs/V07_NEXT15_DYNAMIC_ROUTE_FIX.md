# v0.7 Next.js 15 dynamic route type fix

## Problemă

Vercel a oprit build-ul la ruta:

```text
app/api/v1/auth/users/[id]/route.ts
```

Eroarea era cauzată de semnătura route handler-ului pentru Next.js 15:

```ts
type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};
```

Next.js 15 validează strict al doilea argument al route handler-elor dinamice și cere `params` ca `Promise`.

## Fix

Ruta folosește acum semnătura compatibilă cu Next.js 15:

```ts
type UserRouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: UserRouteParams) {
  const { id } = await params;
}
```

Același model este aplicat și pentru `PATCH`.
