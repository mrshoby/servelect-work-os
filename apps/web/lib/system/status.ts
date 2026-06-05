import { countCapabilitiesByStatus, getRoleMatrix, SERVELECT_APP_CHANNEL, SERVELECT_APP_VERSION, systemCapabilities } from "./capabilities";
import { getDatabaseStatus } from "@/lib/backend/data-provider";
import { isAuthRequired } from "@/lib/auth/session";
import { getActionCenterSummary } from "@/lib/action-center/actions";
import { getReleaseChecklist } from "@/lib/release/manifest";
import { getWorkflowExecutionSummary } from "@/lib/workflows/executions";

export type ServelectSystemStatus = ReturnType<typeof getServelectSystemStatus>;

export function getServelectSystemStatus() {
  const db = getDatabaseStatus();
  const authRequired = isAuthRequired();
  const release = getReleaseChecklist();

  return {
    app: {
      name: "SERVELECT WORK OS / SERVELECT EMP",
      version: SERVELECT_APP_VERSION,
      channel: SERVELECT_APP_CHANNEL,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
      nodeEnv: process.env.NODE_ENV ?? "development"
    },
    runtime: {
      dataProvider: db.active,
      requestedDataProvider: db.requested,
      hasDatabaseUrl: db.hasDatabaseUrl,
      prismaReady: db.prismaReady,
      authRequired,
      deployUrl: process.env.VERCEL_URL ?? null,
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null
    },
    capabilities: {
      items: systemCapabilities,
      byStatus: countCapabilitiesByStatus()
    },
    operational: {
      actionCenter: getActionCenterSummary(),
      workflowExecutions: getWorkflowExecutionSummary(),
      release: {
        productionScore: release.productionScore,
        blockers: release.blockers.length,
        warnings: release.warnings.length,
        planned: release.planned.length
      }
    },
    roles: getRoleMatrix(),
    notes: [
      "v1.0 marchează baseline-ul enterprise: release manifest, production gates și roadmap v1.x.",
      "Mock provider rămâne implicit pentru Vercel-safe deploy.",
      "Următorul pas recomandat este v1.1 Database Activation Pack: Prisma/PostgreSQL real, seed, audit log persistent și user persistence."
    ]
  };
}
