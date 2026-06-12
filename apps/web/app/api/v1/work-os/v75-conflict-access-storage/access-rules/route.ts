import { NextResponse } from "next/server";
import { addAccessRule, createV75RuntimeState } from "@/lib/enterprise/work-os-v75-conflict-access-attachments";

export async function GET() {
  return NextResponse.json({ ok: true, release: "7.5.0", accessRules: createV75RuntimeState().accessRules });
}

export async function POST() {
  return NextResponse.json({ ok: true, release: "7.5.0", state: addAccessRule(createV75RuntimeState()) });
}
