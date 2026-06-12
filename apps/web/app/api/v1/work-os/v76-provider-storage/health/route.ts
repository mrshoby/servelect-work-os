import { NextResponse } from "next/server";
import { createV76RuntimeState, requestSignedUpload, requestSignedDownload, runProviderDelivery, evaluateAccess, deleteOrRestoreAttachment } from "@/lib/enterprise/work-os-v76-provider-storage";

export async function GET() {
  return NextResponse.json({ ok: true, version: "7.6.0", service: "v76-provider-storage", status: "ready", primaryWrites: "gated", providers: ["in_app", "email_ready", "push_ready", "websocket_ready"] });
}
