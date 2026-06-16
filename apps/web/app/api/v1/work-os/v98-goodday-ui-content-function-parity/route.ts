import { NextResponse } from "next/server";
import { getV98GoodDayParitySummary } from "@/lib/enterprise/work-os-v98-goodday-ui-content-function-parity";

export async function GET() {
  const data = getV98GoodDayParitySummary();
  return NextResponse.json({ ok: true, release: "v9.8.0", surface: "Taskuri dense workspace", writes: data.productionWrites, counts: { tasks: data.tasksCount, tickets: data.ticketsCount, projects: data.projectsCount, users: data.usersCount }, readiness: { visualSimilarityTarget: data.visualSimilarityTarget, functionalParityTarget: data.functionalParityTarget }, data });
}
