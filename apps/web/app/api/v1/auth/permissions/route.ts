import { rolePermissionMap } from "@/lib/auth/permissions";
import { jsonOk } from "@/lib/backend/http";

export async function GET() {
  return jsonOk({ roles: rolePermissionMap });
}
