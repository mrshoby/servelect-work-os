import { getAuthUsers, toPublicAuthUser } from "@/lib/auth/demo-users";
import { jsonOk } from "@/lib/backend/http";

export async function GET() {
  return jsonOk(getAuthUsers().map(toPublicAuthUser));
}
