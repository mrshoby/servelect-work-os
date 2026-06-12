import { NextResponse } from "next/server";
import { createV76RuntimeState, requestSignedUpload, requestSignedDownload, runProviderDelivery, evaluateAccess, deleteOrRestoreAttachment } from "@/lib/enterprise/work-os-v76-provider-storage";

export async function GET() {
  const state = requestSignedUpload(createV76RuntimeState(), { entity: "task", entityId: "SWO-1001", fileName: "signed-upload-demo.pdf" });
  return NextResponse.json({ ok: true, mode: "shadow_signed_upload", record: state.signedUrls[0], audit: state.auditEvents[0] });
}
export async function POST() { return GET(); }
