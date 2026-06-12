import { v77CurrentReadiness, v77GlobalScores } from "@/lib/enterprise/work-os-v77-goodday-ui-parity";
export async function GET() { return Response.json({ ok: true, version: "7.7.0", health: "ready", scores: v77GlobalScores(), readiness: v77CurrentReadiness() }); }
