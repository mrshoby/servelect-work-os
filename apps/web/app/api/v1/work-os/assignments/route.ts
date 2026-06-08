import { NextResponse } from "next/server";
import { canReassignTask, getUserById, v59Tasks, v59Users } from "@/lib/enterprise/work-os-enterprise-accounts";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as { taskId?: string; fromUserId?: string; toUserId?: string; changedBy?: string };
  const actor = getUserById(payload.changedBy ?? "u1") ?? v59Users[0];
  const target = getUserById(payload.toUserId ?? "u6") ?? v59Users[5];
  const task = v59Tasks.find((item) => item.id === payload.taskId) ?? v59Tasks[0];
  const allowed = canReassignTask(actor, task, target);
  return NextResponse.json({ ok: allowed, mode: "shadow-safe", data: { allowed, taskId: task.id, fromUserId: task.assigneeId, toUserId: target.id, changedBy: actor.id, auditEvent: "task_reassign_shadow", notification: allowed ? "queued" : "blocked_by_rbac" } }, { status: allowed ? 200 : 403 });
}
