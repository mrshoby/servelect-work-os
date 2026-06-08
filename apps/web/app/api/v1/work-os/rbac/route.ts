import { NextResponse } from "next/server";
import { v59Permissions, v59RoleOrder, v59RolePermissionMap } from "@/lib/enterprise/work-os-enterprise-accounts";

export function GET() {
  return NextResponse.json({ ok: true, data: { roles: v59RoleOrder, permissions: v59Permissions, rolePermissionMap: v59RolePermissionMap } });
}
