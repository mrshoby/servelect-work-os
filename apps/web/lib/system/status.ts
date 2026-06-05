import { countCapabilitiesByStatus, getRoleMatrix, SERVELECT_APP_CHANNEL, SERVELECT_APP_VERSION, systemCapabilities } from "./capabilities";
import { getDatabaseStatus } from "@/lib/backend/data-provider";
import { isAuthRequired } from "@/lib/auth/session";

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
    roles: getRoleMatrix(),
    notes: [
      "v0.8 adaugă status/readiness API, governance UI și workflow templates.",
      "Mock provider rămâne implicit pentru Vercel-safe deploy.",
      "Prisma/PostgreSQL se activează doar când există DATABASE_URL și SERVELECT_DATA_PROVIDER=prisma."
    ]
  };
}
