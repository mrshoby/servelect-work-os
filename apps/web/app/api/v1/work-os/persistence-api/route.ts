import { getV68GlobalPersistenceHealth } from "../../../../../lib/enterprise/work-os-v68-persistence-api-unification";

export async function GET() {
  return Response.json(getV68GlobalPersistenceHealth());
}
