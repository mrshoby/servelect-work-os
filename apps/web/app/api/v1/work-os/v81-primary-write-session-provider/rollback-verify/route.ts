import { NextResponse } from "next/server";
import { v81PrimaryWriteQueue, v81ReconciliationLanes } from "@/lib/enterprise/work-os-v81-primary-write-session-provider";

export async function GET() {
  const rollbackLane = v81ReconciliationLanes.find((lane) => lane.lane === "primary_pilot_to_rollback");
  const checkpoints = v81PrimaryWriteQueue().map((item) => ({ id: item.id, checkpoint: item.rollbackCheckpoint, lockVersion: item.lockVersion, state: item.reconciliationState }));
  return NextResponse.json({ ok: true, rollbackVerified: rollbackLane?.status === "passed", rollbackLane, checkpoints });
}
