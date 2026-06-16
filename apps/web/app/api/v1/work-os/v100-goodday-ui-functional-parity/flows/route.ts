import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "10.0.3",
    flowAudit: "endpoint present",
    requiredNext: ["create task", "edit drawer", "move board", "bulk table", "create ticket", "approve", "export", "refresh persistence"],
    acceptance: "not-final-until-browser-flow-pass",
  });
}
