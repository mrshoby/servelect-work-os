export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  return Response.json({ ok: true, version: "7.7.0", status: "warning", primaryWrite: "gated", evidence: "Primary write dry-run accepted but primary DB writes remain disabled until rollback and provider telemetry pass.", payload });
}
export async function GET() { return Response.json({ ok: true, version: "7.7.0", route: "dry-run", primaryWrite: "gated" }); }
