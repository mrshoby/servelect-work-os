import { createV77RuntimeState } from "@/lib/enterprise/work-os-v77-goodday-ui-parity";
export async function GET() {
  const state = createV77RuntimeState();
  return Response.json({ ok: true, version: "7.7.0", telemetry: { queuedNotifications: state.notifications.filter((item) => item.providerState === "queued").length, deliveredNotifications: state.notifications.filter((item) => item.providerState === "delivered").length, dryRuns: state.dryRuns.length, auditEvents: state.audit.length, activeTimer: Boolean(state.activeTimerTaskId) } });
}
