import { systemCapabilities } from "@/lib/system/capabilities";
import { getActionCenterSummary } from "@/lib/action-center/actions";
import { getWorkflowExecutionSummary } from "@/lib/workflows/executions";

export type ReleaseGateStatus = "passed" | "warning" | "blocked" | "planned";

export type ReleaseGate = {
  id: string;
  title: string;
  status: ReleaseGateStatus;
  owner: string;
  evidence: string;
  action: string;
};

export type ReleaseMilestone = {
  id: string;
  title: string;
  version: string;
  date: string;
  summary: string;
  routes: string[];
};

export const SERVELECT_RELEASE_VERSION = "1.0.0";
export const SERVELECT_RELEASE_CHANNEL = "v1.0 Enterprise Work OS Baseline";

export const releaseMilestones: ReleaseMilestone[] = [
  {
    id: "v07",
    title: "Protected App + User Management",
    version: "0.7.0",
    date: "2026-06-05",
    summary: "App protejată, sesiune demo HTTP-only, autorizare API și user management demo.",
    routes: ["/admin/users", "/unauthorized", "/api/v1/auth/session"]
  },
  {
    id: "v08",
    title: "Persistence & Governance Core",
    version: "0.8.0",
    date: "2026-06-05",
    summary: "Status/readiness API, workflow templates și system governance UI.",
    routes: ["/admin/system", "/workflows", "/api/v1/system/status"]
  },
  {
    id: "v09",
    title: "Action Center & Audit Automation",
    version: "0.9.0",
    date: "2026-06-05",
    summary: "Coadă unificată task-first, audit log și workflow executions demo.",
    routes: ["/action-center", "/admin/audit", "/api/v1/action-center"]
  },
  {
    id: "v10",
    title: "Enterprise Release Baseline",
    version: "1.0.0",
    date: "2026-06-05",
    summary: "Release console, checklist de producție și manifest API pentru guvernanță v1.",
    routes: ["/admin/release", "/api/v1/release/manifest", "/api/v1/release/checklist"]
  }
];

export const releaseGates: ReleaseGate[] = [
  {
    id: "build-vercel",
    title: "Build Vercel / Next.js",
    status: "passed",
    owner: "Platform",
    evidence: "Next.js 15 compile + typecheck fără erori după fixurile v0.8/v0.9.",
    action: "Menține build gate obligatoriu înainte de fiecare tag release."
  },
  {
    id: "workos-task-first",
    title: "Work OS task-first",
    status: "passed",
    owner: "Product",
    evidence: "Dashboard, Taskuri, Proiecte, Action Center și workflow-uri sunt centrate pe taskuri/acțiuni.",
    action: "Următorul pas: CRUD real persistent și ownership pe fiecare acțiune."
  },
  {
    id: "governance-rbac",
    title: "RBAC + protected app foundation",
    status: "warning",
    owner: "Security",
    evidence: "Există sesiune demo, authorize API, role matrix și pagini admin protejate conceptual.",
    action: "Înlocuiește demo auth cu Auth.js/SSO și aplică permission gates la nivel de componentă."
  },
  {
    id: "persistence-db",
    title: "Persistență DB reală",
    status: "warning",
    owner: "Backend",
    evidence: "Repository layer mock/prisma-ready există, dar mock provider rămâne implicit pentru deploy sigur.",
    action: "v1.1 trebuie să activeze Prisma/PostgreSQL controlat cu seed, audit log și user persistence."
  },
  {
    id: "mobile-offline",
    title: "Mobile offline-first",
    status: "planned",
    owner: "Mobile",
    evidence: "Există schelet Expo și preview mobil, dar sync offline real nu este încă activ.",
    action: "v1.2 poate introduce mobile data store, queued mutations și sync status."
  },
  {
    id: "iot-real-connectors",
    title: "IoT real connectors",
    status: "planned",
    owner: "Energy Ops",
    evidence: "Alertele și graficele sunt mock; Timescale/MQTT/Modbus sunt pregătite arhitectural.",
    action: "v1.3 poate introduce ingestie telemetry și alert rules persistente."
  }
];

export function getReleaseChecklist() {
  const totals = releaseGates.reduce<Record<ReleaseGateStatus, number>>(
    (acc, gate) => {
      acc[gate.status] += 1;
      return acc;
    },
    { passed: 0, warning: 0, blocked: 0, planned: 0 }
  );

  const productionScore = Math.round(((totals.passed + totals.warning * 0.55) / releaseGates.length) * 100);

  return {
    version: SERVELECT_RELEASE_VERSION,
    channel: SERVELECT_RELEASE_CHANNEL,
    productionScore,
    totals,
    gates: releaseGates,
    blockers: releaseGates.filter((gate) => gate.status === "blocked"),
    warnings: releaseGates.filter((gate) => gate.status === "warning"),
    planned: releaseGates.filter((gate) => gate.status === "planned")
  };
}

export function getReleaseManifest() {
  const actionCenter = getActionCenterSummary();
  const workflowExecutions = getWorkflowExecutionSummary();
  const checklist = getReleaseChecklist();

  return {
    ok: checklist.blockers.length === 0,
    generatedAt: new Date().toISOString(),
    app: {
      name: "SERVELECT WORK OS / SERVELECT EMP",
      version: SERVELECT_RELEASE_VERSION,
      channel: SERVELECT_RELEASE_CHANNEL,
      releaseType: "enterprise-baseline"
    },
    summary: {
      productionScore: checklist.productionScore,
      capabilities: systemCapabilities.length,
      actionItems: actionCenter.total,
      criticalActions: actionCenter.critical,
      workflowExecutions: workflowExecutions.total,
      releaseGates: releaseGates.length
    },
    milestones: releaseMilestones,
    checklist,
    nextRecommendedVersions: [
      {
        version: "1.1.0",
        title: "Database Activation Pack",
        focus: "Prisma/PostgreSQL real, seed, audit log persistent, user persistence și migrations gate."
      },
      {
        version: "1.2.0",
        title: "Mobile Field Operations Pack",
        focus: "Expo mobile real pentru tehnicieni, checklist, QR, foto obligatorii și offline queue."
      },
      {
        version: "1.3.0",
        title: "IoT Telemetry Pack",
        focus: "MQTT/Modbus/API ingestie reală, TimescaleDB și alert rules care generează task/ticket."
      }
    ]
  };
}
