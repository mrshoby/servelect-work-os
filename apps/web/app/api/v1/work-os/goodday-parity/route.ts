import { NextResponse } from "next/server";
import { buildGoodDayParitySeed, calculateWorkload, goodDayParityFeatureMatrix } from "@/lib/enterprise/work-os-goodday-parity-core";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = buildGoodDayParitySeed();
  return NextResponse.json({
    version: "6.6.0",
    module: "Taskuri GoodDay core integrated into real routes",
    routes: [
      "/taskuri",
      "/taskuri/overview",
      "/taskuri/my-work",
      "/taskuri/tickets-notificari",
      "/taskuri/proiecte-active",
      "/taskuri/proiecte-viitoare",
      "/taskuri/proiecte-finalizate",
      "/taskuri/board",
      "/taskuri/tabel",
      "/taskuri/calendar-gantt",
      "/taskuri/workload-aprobari"
    ],
    counts: {
      users: state.users.length,
      projects: state.projects.length,
      tasks: state.tasks.length,
      tickets: state.tickets.length,
      approvals: state.approvals.length,
      notifications: state.notifications.length,
      savedViews: state.savedViews.length,
      automations: state.automations.length
    },
    workload: calculateWorkload(state.users, state.tasks, state.timeEntries),
    featureMatrix: goodDayParityFeatureMatrix(),
    persistence: "localStorage + mock API/service layer; backend DB adapter remains next phase"
  });
}