import { NextResponse } from "next/server";
import { v88DeadLetterRecovery, v88PixelDiffBaselines, v88ProviderSecrets, v88Release, v88RuntimeProof, v88WebhookDrills } from "@/lib/enterprise/work-os-v88-pixel-diff-provider-webhook";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    release: v88Release,
    runtimeProof: v88RuntimeProof(),
    providerSecrets: v88ProviderSecrets,
    webhookDrills: v88WebhookDrills,
    pixelDiffBaselines: v88PixelDiffBaselines,
    deadLetterRecovery: v88DeadLetterRecovery,
  });
}
