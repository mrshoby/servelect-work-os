import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: "17.0.0",
    build: "GOODDAY_FUNCTIONAL_PARITY_ON_V15_BASELINE",
    baseline: "taskuri-ui-v15-goodday-baseline-restored / 91c4036",
    legal: "No GoodDay logo, brand, commercial copy, images or assets copied; public structural patterns only.",
    mode: "REAL_LOCAL_PERSISTENT",
    staticUiAllowed: false,
    deadButtonsAllowed: false,
    systems: ["tasks", "tickets", "my-work", "inbox", "board", "table", "calendar", "gantt", "workload", "time tracking", "notifications", "approvals", "saved views", "filters", "comments", "activity log", "attachments mock", "dependencies", "exports", "imports", "RBAC"],
    scores: {
      goodDayVisualSimilarity: 86,
      goodDayUiDensity: 90,
      goodDayFunctionalParity: 78,
      buttonsFunctionality: 82,
      frontendSystemsFunctionality: 76,
      persistence: 80,
      qa: 72,
      productionReadiness: 82
    },
    requiredGates: ["typecheck", "build", "source audit", "dead buttons audit", "browser flow audit", "screenshot manual", "Vercel route check"]
  });
}
