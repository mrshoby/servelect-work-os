import { getV68GlobalPersistenceHealth } from "../../../../../../lib/enterprise/work-os-v68-persistence-api-unification";

export async function GET() {
  const health = getV68GlobalPersistenceHealth();
  return Response.json({
    ok: health.averageReadiness >= 60,
    version: health.version,
    release: health.release,
    averageReadiness: health.averageReadiness,
    readyForShadow: health.readyForShadow,
    blocked: health.blocked,
    contractsReady: health.contractsReady,
    contractsTotal: health.contractsTotal,
    checkedAt: new Date().toISOString(),
  });
}
