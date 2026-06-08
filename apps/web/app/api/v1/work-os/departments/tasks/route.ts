import { NextResponse } from "next/server";
import { departmentTasksV62, getVisibleTasksForUser } from "../../../../../../lib/enterprise/work-os-v62-department-rbac";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const departmentId = url.searchParams.get("departmentId");
  const tasks = userId ? getVisibleTasksForUser(userId) : departmentTasksV62;
  const filteredTasks = departmentId ? tasks.filter((task) => task.departmentId === departmentId) : tasks;
  return NextResponse.json({ version: "6.2.0", count: filteredTasks.length, tasks: filteredTasks });
}
