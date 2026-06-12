import { NextResponse } from "next/server";
import { createV76RuntimeState, requestSignedUpload, requestSignedDownload, runProviderDelivery, evaluateAccess, deleteOrRestoreAttachment } from "@/lib/enterprise/work-os-v76-provider-storage";

export async function GET() {
  const state = createV76RuntimeState();
  return NextResponse.json({ ok: true, version: state.version, writeMode: state.writeMode, summary: { signedUrls: state.signedUrls.length, deliveries: state.deliveries.length, guards: state.mutationGuards.length, primaryWrites: "gated" } });
}
