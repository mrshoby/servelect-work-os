import { NextResponse } from "next/server";
import { createV57ShadowMutation, type V57Domain } from "@/lib/enterprise/work-os-data-switchboard";

export const dynamic = "force-dynamic";

const domains = new Set(["tasks", "projects", "pontaj", "materials", "approvals", "iot", "maintenance", "users", "documents", "reports"]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const domain = typeof body.domain === "string" && domains.has(body.domain) ? body.domain as V57Domain : "tasks";
  const title = typeof body.title === "string" && body.title.trim().length > 0 ? body.title : "Untitled shadow mutation";

  return NextResponse.json(createV57ShadowMutation({
    domain,
    title,
    adapter: typeof body.adapter === "string" ? body.adapter : undefined,
    actor: typeof body.actor === "string" ? body.actor : undefined,
    payloadSummary: typeof body.payloadSummary === "string" ? body.payloadSummary : undefined
  }));
}
