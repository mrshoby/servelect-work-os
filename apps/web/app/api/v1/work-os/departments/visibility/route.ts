import { NextResponse } from "next/server";
import { getAssignableUsersForTask, getVisibilityForUser } from "../../../../../../lib/enterprise/work-os-v62-department-rbac";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? "u1";
  const taskId = url.searchParams.get("taskId");
  return NextResponse.json({
    version: "6.2.0",
    visibility: getVisibilityForUser(userId),
    assignableUsersForTask: taskId ? getAssignableUsersForTask(userId, taskId) : []
  });
}
