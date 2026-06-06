import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    version: "5.4.0",
    domain: "offers",
    mode: process.env.SERVELECT_WORK_OS_WRITE_MODE || "shadow-safe",
    persisted: false,
    message: "Shadow-safe submit accepted. Real production write requires explicit SERVELECT_WORK_OS_WRITE_MODE gate.",
    auditEnvelope: {
      actor: "current-user-placeholder",
      action: "offers-create.submit.preview",
      before: null,
      after: body,
      requestId: `req-${Date.now()}`
    }
  });
}
