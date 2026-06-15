import { NextResponse } from "next/server";
import { v88DeadLetterRecovery, v88PixelDiffBaselines, v88ProviderSecrets, v88Release, v88RuntimeProof, v88WebhookDrills } from "@/lib/enterprise/work-os-v88-pixel-diff-provider-webhook";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, current: "8.8.0", next: "8.9.0", acceptedOnlyAfter: ["functional routes PASS", "screenshot routes PASS", "no NO_PNG", "no secrets in repo"] });
}
