import { NextResponse } from "next/server";
import { v88DeadLetterRecovery, v88PixelDiffBaselines, v88ProviderSecrets, v88Release, v88RuntimeProof, v88WebhookDrills } from "@/lib/enterprise/work-os-v88-pixel-diff-provider-webhook";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, gates: ["pixel_diff_review", "webhook_signature_valid", "rollback_checkpoint_present", "department_scope_valid", "no_global_write"] });
}
