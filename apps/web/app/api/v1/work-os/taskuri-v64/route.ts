import { NextResponse } from "next/server";
import {
  v64Approvals,
  v64CompletionStatus,
  v64Departments,
  v64Notifications,
  v64Projects,
  v64Tasks,
  v64Tickets,
  v64Users
} from "@/lib/enterprise/work-os-v64-taskuri-functional";

export function GET() {
  return NextResponse.json({
    version: "6.4.0",
    scope: "Taskuri 1:1 GoodDay functional redesign",
    routes: [
      "/taskuri",
      "/taskuri/my-work",
      "/taskuri/inbox",
      "/taskuri/tickets",
      "/taskuri/proiecte-active",
      "/taskuri/proiecte-viitoare",
      "/taskuri/proiecte-finalizate",
      "/taskuri/board",
      "/taskuri/tabel",
      "/taskuri/calendar",
      "/taskuri/workload"
    ],
    counts: {
      tasks: v64Tasks.length,
      tickets: v64Tickets.length,
      projects: v64Projects.length,
      approvals: v64Approvals.length,
      notifications: v64Notifications.length,
      users: v64Users.length,
      departments: v64Departments.length
    },
    completionStatus: v64CompletionStatus,
    departments: v64Departments,
    users: v64Users,
    tasks: v64Tasks,
    tickets: v64Tickets,
    projects: v64Projects,
    approvals: v64Approvals,
    notifications: v64Notifications
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { action?: string; entityId?: string; payload?: unknown };
  return NextResponse.json({
    ok: true,
    mode: "mock-shadow-write",
    version: "6.4.0",
    action: body.action ?? "unknown",
    entityId: body.entityId ?? null,
    payload: body.payload ?? null,
    auditEvent: {
      id: `audit-${Date.now()}`,
      message: "Mutation accepted in mock shadow mode. Local UI uses Zustand/localStorage style persistence until backend adapter cutover.",
      createdAt: new Date().toISOString()
    }
  });
}
