import { NextResponse } from "next/server";
import { getV91Payload, getV91RouteMap } from "@/lib/enterprise/work-os-v91-goodday-task-execution";

export async function GET() {
  return NextResponse.json({ ...getV91Payload("workspace"), routes: getV91RouteMap(), message: "v9.1.0 Taskuri GoodDay-like execution parity layer is mounted on canonical Taskuri/Admin/API routes." });
}
