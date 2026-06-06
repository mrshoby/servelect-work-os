export type GovernanceTone = "ready" | "beta" | "partial" | "blocked" | "shadow";

export type GovernanceMetric = {
  id: string;
  label: string;
  completion: number;
  tone: GovernanceTone;
  summary: string;
};

export type GovernanceControl = {
  id: string;
  title: string;
  owner: string;
  status: GovernanceTone;
  evidence: string[];
  nextAction: string;
};

export type RbacRule = {
  role: "Admin" | "Manager" | "Inginer" | "Tehnician" | "Viewer";
  canCreate: boolean;
  canUpdate: boolean;
  canAssign: boolean;
  canClose: boolean;
  canDelete: boolean;
  notes: string;
};

export type AuditEventContract = {
  event: string;
  source: "ui" | "api" | "shadow" | "system";
  requiredFields: string[];
  persistenceMode: "shadow-audit" | "db-write-gated" | "planned";
};

export type TaskProductionGovernanceRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  readiness: number;
  productionWritesEnabled: boolean;
  writeGateMode: "off-by-default" | "shadow-only" | "controlled";
  summary: string;
  productStatus: GovernanceMetric[];
  controls: GovernanceControl[];
  rbac: RbacRule[];
  auditTrailContract: AuditEventContract[];
  rolloutPlan: Array<{ phase: string; completion: number; exitCriteria: string[] }>;
  nextBuild: string;
};

export function getTaskProductionGovernanceRelease(): TaskProductionGovernanceRelease {
  return {
    ok: true,
    version: "3.5.0",
    name: "Enterprise Task Production Governance Pack",
    generatedAt: new Date().toISOString(),
    readiness: 84,
    productionWritesEnabled: false,
    writeGateMode: "controlled",
    summary:
      "v3.5 consolideaza taskurile pentru productie: RBAC, audit trail, write-gate, rollback, health checks, release readiness si criterii clare de activare Prisma writes.",
    productStatus: [
      { id: "website-web-app", label: "Website/Web App", completion: 90, tone: "ready", summary: "Interfata web este stabila pentru beta enterprise, cu pagini admin de verificare si status vizibil." },
      { id: "task-project-core", label: "Task & Project Core", completion: 85, tone: "beta", summary: "Task board, drawer, API bridge, mutations si shadow audit sunt conectate functional." },
      { id: "backend-api", label: "Backend/API", completion: 81, tone: "beta", summary: "Endpointurile enterprise si task governance sunt disponibile cu health/readiness contracts." },
      { id: "database-prisma-seed", label: "Database/Prisma/Seed", completion: 76, tone: "partial", summary: "Prisma repository este pregatit in shadow/write-gate mode; scrierile DB raman controlate." },
      { id: "auth-rbac", label: "Auth/RBAC", completion: 60, tone: "partial", summary: "Matricea RBAC este definita pentru fluxurile Task CRUD; enforcement complet ramane etapa urmatoare." },
      { id: "iot-ops", label: "IoT/Ops", completion: 42, tone: "shadow", summary: "Zona IoT/Ops ramane in integrare graduală cu taskuri, alerte si operatiuni teren." },
      { id: "mobile-app", label: "Mobile App", completion: 32, tone: "shadow", summary: "Aplicatia mobila ramane in urma web-ului si necesita conectare la aceleasi contracte API." }
    ],
    controls: [
      {
        id: "write-gate",
        title: "Prisma write-gate controlled activation",
        owner: "Backend/API",
        status: "beta",
        evidence: ["GET /api/v1/tasks/write-gate", "GET /api/v1/tasks/prisma-write-gate", "shadow mutation audit"],
        nextAction: "Permite scrieri reale doar dupa RBAC enforcement si audit trail persistent."
      },
      {
        id: "rbac-enforcement",
        title: "Task RBAC matrix",
        owner: "Auth/RBAC",
        status: "partial",
        evidence: ["role matrix", "delete blocked by default", "admin-only control plane"],
        nextAction: "Conecteaza rolurile reale din sesiune/user profile la fiecare mutatie."
      },
      {
        id: "audit-trail",
        title: "Task mutation audit trail",
        owner: "Database/Prisma/Seed",
        status: "partial",
        evidence: ["create/update/status/assignment events", "shadow-audit contract", "rollback checklist"],
        nextAction: "Persistenta in DB pentru TaskAuditEvent si export admin."
      },
      {
        id: "rollback",
        title: "Safe rollback and kill switch",
        owner: "Operations",
        status: "ready",
        evidence: ["writes off by default", "shadow mode", "feature-gate plan"],
        nextAction: "Adauga environment based kill switch pentru Vercel/production."
      }
    ],
    rbac: [
      { role: "Admin", canCreate: true, canUpdate: true, canAssign: true, canClose: true, canDelete: true, notes: "Acces complet, dar delete trebuie auditat." },
      { role: "Manager", canCreate: true, canUpdate: true, canAssign: true, canClose: true, canDelete: false, notes: "Poate coordona taskuri si proiecte, fara stergere hard." },
      { role: "Inginer", canCreate: true, canUpdate: true, canAssign: false, canClose: true, canDelete: false, notes: "Poate lucra taskuri tehnice si inchide taskuri proprii/atribuite." },
      { role: "Tehnician", canCreate: true, canUpdate: true, canAssign: false, canClose: false, canDelete: false, notes: "Poate raporta progres teren si crea taskuri operative." },
      { role: "Viewer", canCreate: false, canUpdate: false, canAssign: false, canClose: false, canDelete: false, notes: "Read-only pentru audit/status." }
    ],
    auditTrailContract: [
      { event: "task.create", source: "api", requiredFields: ["taskId", "title", "actorId", "createdAt"], persistenceMode: "shadow-audit" },
      { event: "task.update", source: "api", requiredFields: ["taskId", "changes", "actorId", "updatedAt"], persistenceMode: "shadow-audit" },
      { event: "task.status.change", source: "ui", requiredFields: ["taskId", "from", "to", "actorId", "changedAt"], persistenceMode: "shadow-audit" },
      { event: "task.assignment.change", source: "ui", requiredFields: ["taskId", "assigneeId", "actorId", "changedAt"], persistenceMode: "shadow-audit" },
      { event: "task.delete.request", source: "system", requiredFields: ["taskId", "actorId", "reason", "requestedAt"], persistenceMode: "planned" }
    ],
    rolloutPlan: [
      { phase: "Shadow reads", completion: 100, exitCriteria: ["read-shadow endpoint verde", "board state consistent", "no browser freeze"] },
      { phase: "Shadow mutations", completion: 85, exitCriteria: ["create/update/status audited", "no duplicate ok fields", "RBAC matrix visible"] },
      { phase: "Controlled writes", completion: 62, exitCriteria: ["write-gate env ready", "Prisma adapter verified", "rollback tested"] },
      { phase: "Production writes", completion: 35, exitCriteria: ["persistent TaskAuditEvent", "admin approval", "backup/export plan"] }
    ],
    nextBuild: "v3.6.0 — Persistent Task Audit Events & RBAC Enforcement"
  };
}
