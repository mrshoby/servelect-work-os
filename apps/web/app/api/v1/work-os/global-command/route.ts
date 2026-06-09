import { NextResponse } from "next/server";
import { buildGoodDayParitySeed, calculateWorkload, goodDayParityFeatureMatrix } from "@/lib/enterprise/work-os-goodday-parity-core";

export async function GET() {
  const state = buildGoodDayParitySeed();
  const workload = calculateWorkload(state.users, state.tasks, state.timeEntries);
  const unreadNotifications = state.notifications.filter((notification) => !notification.read).length;
  const pendingApprovals = state.approvals.filter((approval) => approval.status === "Pending").length;
  const escalatedTickets = state.tickets.filter((ticket) => ticket.escalated || ticket.status === "Escaladat" || ticket.severity === "Critical").length;
  const overloadedUsers = workload.filter((item) => item.utilization > 100).length;

  return NextResponse.json({
    ok: true,
    version: "6.7.2",
    name: "SERVELECT WORK OS v6.7.2 Global Command Integration Typecheck Fix",
    scope: [
      "global notifications",
      "global approvals",
      "global search",
      "action center",
      "cross-module task factory",
      "workload signals",
      "Taskuri-Proiecte-CRM-IoT-Stock-HR links"
    ],
    metrics: {
      tasks: state.tasks.length,
      projects: state.projects.length,
      tickets: state.tickets.length,
      unreadNotifications,
      pendingApprovals,
      escalatedTickets,
      overloadedUsers,
      automations: state.automations.length
    },
    pages: [
      "/work-os/dashboard",
      "/notifications",
      "/work-os/notification-center",
      "/work-os/approvals",
      "/search",
      "/action-center",
      "/taskuri/overview"
    ],
    goodDayParityMatrix: goodDayParityFeatureMatrix()
  });
}
