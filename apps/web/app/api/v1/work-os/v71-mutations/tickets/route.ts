import { NextResponse } from "next/server";
import { applyV71Mutation, buildMutationRequest, createV71Snapshot, V71_RELEASE_VERSION } from "@/lib/enterprise/work-os-v71-backend-mutation-adapter";

export async function GET() {
  const snapshot = createV71Snapshot("api_shadow");
  return NextResponse.json({ ok: true, version: V71_RELEASE_VERSION, records: snapshot.state.tickets, mode: "api_shadow" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const mutation = buildMutationRequest("ticket", String(body.action ?? "update") as never, (body.payload ?? body) as Record<string, unknown>, String(body.actorId ?? "u_andrei"), String(body.role ?? "Super Admin"), String(body.department ?? "Management"), "api_shadow");
  const result = applyV71Mutation(createV71Snapshot("api_shadow").state, mutation);
  return NextResponse.json({ ok: result.ok, version: V71_RELEASE_VERSION, result });
}
