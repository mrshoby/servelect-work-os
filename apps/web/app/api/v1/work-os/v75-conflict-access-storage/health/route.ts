import { NextResponse } from "next/server";
import { v75CurrentReadiness, v75GlobalScores } from "@/lib/enterprise/work-os-v75-conflict-access-attachments";

export async function GET() {
  return NextResponse.json({ ok: true, release: "7.5.0", service: "conflict-access-attachment-storage", readiness: v75CurrentReadiness(), scores: v75GlobalScores() });
}
