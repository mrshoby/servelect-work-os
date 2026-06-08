import { NextResponse } from "next/server";
import { assignTask, reassignTask } from "../../../../../../../lib/enterprise/work-os-v60-enterprise-operating-layer";

type AssignmentPayload = {
  mode?: "assign" | "reassign";
  taskId?: string;
  targetUserId?: string;
  toUserId?: string;
  fromUserId?: string;
  actorId?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as AssignmentPayload;
  const taskId = payload.taskId ?? "t-5001";
  const actorId = payload.actorId ?? "u1";
  if (payload.mode === "reassign") {
    return NextResponse.json(reassignTask(taskId, payload.fromUserId ?? "u6", payload.toUserId ?? payload.targetUserId ?? "u7", actorId));
  }
  return NextResponse.json(assignTask(taskId, payload.targetUserId ?? payload.toUserId ?? "u6", actorId));
}
