import { NextResponse } from "next/server";
import { getV98GoodDayParitySummary } from "@/lib/enterprise/work-os-v98-goodday-ui-content-function-parity";

export async function GET() {
  const data = getV98GoodDayParitySummary(); const byUser = data.users.map((user) => { const assigned = data.tasks.filter((task) => task.assigneeId === user.id); return { user: user.name, department: user.department, capacity: user.capacity, allocated: assigned.reduce((sum, task) => sum + task.estimate, 0), tasks: assigned.length }; }); return NextResponse.json({ ok: true, workload: byUser });
}
