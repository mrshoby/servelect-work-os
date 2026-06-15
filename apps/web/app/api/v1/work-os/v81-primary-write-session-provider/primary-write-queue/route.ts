import { NextResponse } from "next/server";
import { v81PrimaryWriteQueue } from "@/lib/enterprise/work-os-v81-primary-write-session-provider";

export async function GET() {
  return NextResponse.json({ ok: true, queue: v81PrimaryWriteQueue() });
}
