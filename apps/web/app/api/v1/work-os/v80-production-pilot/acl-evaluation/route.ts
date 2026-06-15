import { NextResponse } from "next/server";
import { v80AclRules, v80Actors, v80Can } from "@/lib/enterprise/work-os-v80-production-pilot-readiness";

export async function GET() {
  const matrix = v80Actors.flatMap((actor) => v80AclRules.map((acl) => ({
    actorId: actor.id,
    actor: actor.name,
    role: actor.role,
    department: actor.departmentName,
    entityType: acl.entityType,
    entityId: acl.entityId,
    scope: acl.scope,
    canRead: v80Can(actor, acl, "read"),
    canWrite: v80Can(actor, acl, "write"),
    canAdmin: v80Can(actor, acl, "admin")
  })));
  return NextResponse.json({ ok: true, rows: matrix.length, matrix });
}
