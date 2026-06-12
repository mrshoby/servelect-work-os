import { NextResponse } from "next/server";
import { createV76RuntimeState, requestSignedUpload, requestSignedDownload, runProviderDelivery, evaluateAccess, deleteOrRestoreAttachment } from "@/lib/enterprise/work-os-v76-provider-storage";

export async function GET() {
  const initial = createV76RuntimeState();
  const state = deleteOrRestoreAttachment(initial, initial.signedUrls[0]?.id ?? "signed_att_pif_001");
  return NextResponse.json({ ok: true, mode: "file_version_delete_restore_shadow", files: state.signedUrls, audit: state.auditEvents[0] });
}
export async function POST() { return GET(); }
