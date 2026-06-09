import { NextResponse } from "next/server";
import { buildGoodDayParitySeed, goodDayParityFeatureMatrix } from "@/lib/enterprise/work-os-goodday-parity-core";

export async function GET() {
  const seed = buildGoodDayParitySeed();
  return NextResponse.json({
    ok: true,
    version: "6.5.0",
    scope: "GoodDay-like functional core adapted for SERVELECT WORK OS",
    features: goodDayParityFeatureMatrix(),
    counts: {
      users: seed.users.length,
      clients: seed.clients.length,
      projects: seed.projects.length,
      tasks: seed.tasks.length,
      tickets: seed.tickets.length,
      notifications: seed.notifications.length,
      approvals: seed.approvals.length,
      timeEntries: seed.timeEntries.length,
      savedViews: seed.savedViews.length,
      automations: seed.automations.length
    },
    servelectExamples: [
      "alerta invertor offline -> ticket + task tehnician",
      "stoc sub minim -> procurement task",
      "document PIF lipsa -> task documente",
      "buget depasit -> approval",
      "client follow-up -> CRM task",
      "certificare ANRE expira -> HR task"
    ]
  });
}
