import { NextResponse } from "next/server";
import { addAttachment, createV75RuntimeState } from "@/lib/enterprise/work-os-v75-conflict-access-attachments";

export async function GET() {
  return NextResponse.json({ ok: true, release: "7.5.0", attachments: createV75RuntimeState().attachments });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { entityId?: string; fileName?: string };
  return NextResponse.json({ ok: true, release: "7.5.0", state: addAttachment(createV75RuntimeState(), { entityId: body.entityId, fileName: body.fileName }) });
}
