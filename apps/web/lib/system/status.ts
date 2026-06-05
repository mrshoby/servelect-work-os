import { countCapabilitiesByStatus, getRoleMatrix, SERVELECT_APP_CHANNEL, SERVELECT_APP_VERSION, systemCapabilities } from "./capabilities";
import { getDatabaseStatus } from "@/lib/backend/data-provider";
import { isAuthRequired } from "@/lib/auth/session";
import { getActionCenterSummary } from "@/lib/action-center/actions";
import { getWorkflowExecutionSummary } from "@/lib/workflows/executions";

export type ServelectSystemStatus = ReturnType<typeof getServelectSystemStatus>;

export function getServelectSystemStatus() {
  const db = getDatabaseStatus();
  const authRequired = isAuthRequired();

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
      workflowExecutions: getWorkflowExecutionSummary()
    },
    roles: getRoleMatrix(),
    notes: [
      "v0.9 adaugă Action Center, audit log UI/API și jurnal de execuții workflow.",
      "Mock provider rămâne implicit pentru Vercel-safe deploy.",
      "Prisma/PostgreSQL rămâne pregătit pentru activare controlată în etapa DB real."
    ]
  };
}
