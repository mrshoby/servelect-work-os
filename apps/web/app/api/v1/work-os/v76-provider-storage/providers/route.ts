import { NextResponse } from "next/server";
import { createV76RuntimeState, requestSignedUpload, requestSignedDownload, runProviderDelivery, evaluateAccess, deleteOrRestoreAttachment } from "@/lib/enterprise/work-os-v76-provider-storage";

export async function GET() {
  const state = runProviderDelivery(createV76RuntimeState(), "email_ready");
  return NextResponse.json({ ok: true, mode: "provider_switchboard_shadow", deliveries: state.deliveries, audit: state.auditEvents[0] });
}
export async function POST() { return GET(); }
