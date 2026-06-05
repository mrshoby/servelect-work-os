import { repository } from "@/lib/backend/repository";
import { jsonOk } from "@/lib/backend/http";
import { getDatabaseStatus } from "@/lib/backend/data-provider";
import { isAuthRequired } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type ReadinessCheck = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
};

async function checkRepository(): Promise<ReadinessCheck> {
  try {
    const dashboard = await repository.dashboard();
    return {
      id: "repository",
      label: "Repository layer",
      status: "pass",
      detail: `OK: ${dashboard.tasks.total} taskuri, ${dashboard.projects.total} proiecte.`
    };
  } catch (error) {
    return {
      id: "repository",
      label: "Repository layer",
      status: "fail",
      detail: error instanceof Error ? error.message : "Repository indisponibil."
    };
  }
}

export async function GET() {
  const db = getDatabaseStatus();
  const checks: ReadinessCheck[] = [
    await checkRepository(),
    {
      id: "data-provider",
      label: "Data provider",
      status: db.active === "prisma" ? "pass" : "warn",
      detail: db.message
    },
    {
      id: "auth-mode",
      label: "Protected app",
      status: isAuthRequired() ? "pass" : "warn",
      detail: isAuthRequired()
        ? "SERVELECT_REQUIRE_AUTH=true. Aplicația este protejată prin middleware."
        : "Auth este în demo/open mode. Pentru producție setează SERVELECT_REQUIRE_AUTH=true."
    },
    {
      id: "database-url",
      label: "DATABASE_URL",
      status: db.hasDatabaseUrl ? "pass" : "warn",
      detail: db.hasDatabaseUrl
        ? "DATABASE_URL este setat. Poți activa providerul prisma."
        : "DATABASE_URL lipsește. Vercel folosește mock provider."
    },
    {
      id: "version",
      label: "Versiune aplicație",
      status: "pass",
      detail: "v0.8.0 Persistence & Governance Core."
    }
  ];

  const failed = checks.filter((check) => check.status === "fail").length;
  const warnings = checks.filter((check) => check.status === "warn").length;

  return jsonOk({
    ready: failed === 0,
    productionReady: failed === 0 && warnings === 0,
    summary: {
      pass: checks.filter((check) => check.status === "pass").length,
      warn: warnings,
      fail: failed
    },
    checks
  });
}
