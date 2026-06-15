import { NextResponse } from "next/server";
import { v81EvaluateSessionAcl, v81SessionActors } from "@/lib/enterprise/work-os-v81-primary-write-session-provider";

export async function GET() {
  return NextResponse.json({
    ok: true,
    actors: v81SessionActors,
    checks: [
      { input: ["wi-ticket-escalate-001", "usr-audit-manager"], result: v81EvaluateSessionAcl("wi-ticket-escalate-001", "usr-audit-manager") },
      { input: ["wi-view-share-003", "usr-super-admin"], result: v81EvaluateSessionAcl("wi-view-share-003", "usr-super-admin") },
      { input: ["wi-timesheet-004", "usr-comercial"], result: v81EvaluateSessionAcl("wi-timesheet-004", "usr-comercial") }
    ]
  });
}
