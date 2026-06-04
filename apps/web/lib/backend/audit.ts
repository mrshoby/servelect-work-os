import type { AuditEvent } from "./api-types";
import type { RequestSession } from "./rbac";

const auditEvents: AuditEvent[] = [];

export function writeAuditEvent(
  session: RequestSession,
  input: Omit<AuditEvent, "id" | "userId" | "userName" | "createdAt">
) {
  const event: AuditEvent = {
    id: `audit-${crypto.randomUUID()}`,
    userId: session.user.id,
    userName: session.user.name,
    createdAt: new Date().toISOString(),
    ...input
  };

  auditEvents.unshift(event);
  if (auditEvents.length > 500) auditEvents.length = 500;
  return event;
}

export function listAuditEvents(limit = 100) {
  return auditEvents.slice(0, limit);
}
