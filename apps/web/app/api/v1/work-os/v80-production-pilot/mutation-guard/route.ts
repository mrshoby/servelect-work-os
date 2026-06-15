import { NextResponse } from "next/server";
import { v80EvaluateMutation, v80MutationPilots } from "@/lib/enterprise/work-os-v80-production-pilot-readiness";

export async function GET() {
  const evaluations = v80MutationPilots.map((mutation) => v80EvaluateMutation(mutation.id, mutation.actorId));
  return NextResponse.json({ ok: true, evaluations });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const mutationId = typeof body.mutationId === "string" ? body.mutationId : "mut-ticket-escalate";
  const actorId = typeof body.actorId === "string" ? body.actorId : undefined;
  const evaluation = v80EvaluateMutation(mutationId, actorId);
  return NextResponse.json({ ok: true, evaluation });
}
