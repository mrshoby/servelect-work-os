export type WriteGateMode = "mock-memory" | "shadow" | "write-gated" | "prisma-active";
export type CrudCapabilityStatus = "ready" | "partial" | "guarded" | "blocked" | "planned";

export type ProductionTaskCrudCapability = {
  id: string;
  label: string;
  status: CrudCapabilityStatus;
  readiness: number;
  route: string;
  description: string;
  productionRule: string;
};

export type ProductionTaskCrudRelease = {
  ok: boolean;
  version: string;
  name: string;
  generatedAt: string;
  readiness: number;
  taskCoreReadiness: number;
  apiReadiness: number;
  prismaReadiness: number;
  writeGateMode: WriteGateMode;
  isProductionWriteEnabled: boolean;
  isFullProductionTaskSystem: boolean;
  summary: string;
  capabilities: ProductionTaskCrudCapability[];
  safetyChecks: string[];
  nextBuild: string;
};

export const productionTaskCrudCapabilities: ProductionTaskCrudCapability[] = [
  {
    id: "task-create",
    label: "Create task mutation",
    status: "guarded",
    readiness: 78,
    route: "POST /api/v1/tasks",
    description: "Task create este disponibil ca API contract/UI activation, cu provider mock-memory sau write-gated în funcție de mediu.",
    productionRule: "Nu activează Prisma writes fără TASK_WRITE_GATE=enabled și DATABASE_URL valid."
  },
  {
    id: "task-update",
    label: "Update task mutation",
    status: "guarded",
    readiness: 74,
    route: "PATCH /api/v1/tasks/:id",
    description: "Task update/status change este pregătit pentru optimistic update + rollback, dar DB writes rămân controlate.",
    productionRule: "Orice update trebuie să genereze audit event înainte de prisma-active."
  },
  {
    id: "task-delete",
    label: "Delete / archive task",
    status: "partial",
    readiness: 62,
    route: "DELETE /api/v1/tasks/:id",
    description: "Delete trebuie să fie soft-delete/archive în production, nu ștergere definitivă fără audit.",
    productionRule: "Folosește archivedAt/deletedAt și actorId obligatoriu."
  },
  {
    id: "subtasks-comments",
    label: "Subtasks & comments persistence",
    status: "planned",
    readiness: 44,
    route: "POST /api/v1/tasks/:id/comments, /subtasks",
    description: "Subtaskurile și comentariile rămân următorul bloc critic pentru taskuri production complete.",
    productionRule: "Necesită RBAC + audit + server validation."
  },
  {
    id: "prisma-write-gate",
    label: "Prisma write gate",
    status: "guarded",
    readiness: 58,
    route: "GET /api/v1/enterprise/production-task-crud-write-gate",
    description: "Definește condițiile de activare pentru scrieri reale PostgreSQL/Prisma.",
    productionRule: "Implicit OFF. Se activează doar cu env flags și smoke tests verzi."
  },
  {
    id: "audit-rbac",
    label: "Audit + RBAC enforcement",
    status: "partial",
    readiness: 52,
    route: "server-side guards",
    description: "Guards există conceptual, dar enforcement complet pe fiecare mutație task/project rămâne de finalizat.",
    productionRule: "Nicio mutație fără actor, role, permission și audit row."
  }
];

export function getProductionTaskCrudRelease(): ProductionTaskCrudRelease {
  return {
    ok: true,
    version: "3.0.0",
    name: "Production Task CRUD Stabilization & Prisma Write-Gate",
    generatedAt: new Date().toISOString(),
    readiness: 72,
    taskCoreReadiness: 72,
    apiReadiness: 68,
    prismaReadiness: 59,
    writeGateMode: "write-gated",
    isProductionWriteEnabled: false,
    isFullProductionTaskSystem: false,
    summary:
      "v3.0 stabilizează nucleul Task CRUD pentru trecerea controlată spre Prisma/PostgreSQL: write-gate explicit, mutații create/update/delete în regim guarded, audit prerequisites și plan clar pentru activarea production writes. Taskurile NU sunt încă 100% production DB-active până când write-gate-ul nu este activat cu DATABASE_URL, RBAC și audit complet.",
    capabilities: productionTaskCrudCapabilities,
    safetyChecks: [
      "TASK_WRITE_GATE trebuie să fie disabled/guarded implicit în production beta.",
      "DATABASE_URL trebuie validat înainte de orice prisma-active write.",
      "Mutațiile task trebuie să aibă schema validation și actorId.",
      "Status change trebuie să păstreze optimistic rollback în UI.",
      "Soft-delete/archiving este obligatoriu înainte de delete real.",
      "Audit event este obligatoriu pentru create/update/delete/status-change."
    ],
    nextBuild: "v3.1.0 — Prisma Task Repository Adapter Activation"
  };
}

export function getProductionTaskCrudHealth() {
  const release = getProductionTaskCrudRelease();
  const blocked = release.capabilities.filter((capability) => capability.status === "blocked");
  const guarded = release.capabilities.filter((capability) => capability.status === "guarded");

  return {
    ok: blocked.length === 0,
    version: release.version,
    generatedAt: new Date().toISOString(),
    writeGateMode: release.writeGateMode,
    productionWritesEnabled: release.isProductionWriteEnabled,
    fullProductionTaskSystem: release.isFullProductionTaskSystem,
    readiness: release.readiness,
    guardedCapabilities: guarded.map((item) => item.id),
    blockers: blocked.map((item) => item.id),
    requiredBeforeProductionWrites: [
      "Connect Prisma client to PostgreSQL with migration-tested schema.",
      "Implement repository adapter for task create/update/archive.",
      "Add RBAC enforcement for task mutations.",
      "Persist audit log for every mutation.",
      "Run seed + smoke tests against staging DB.",
      "Enable write gate only after rollback plan is verified."
    ]
  };
}

export function getProductionTaskCrudWriteGate() {
  return {
    ok: true,
    version: "3.0.0",
    generatedAt: new Date().toISOString(),
    currentMode: "write-gated" as WriteGateMode,
    productionWritesEnabled: false,
    envFlags: [
      { key: "TASK_WRITE_GATE", requiredValue: "enabled", currentSafeDefault: "disabled" },
      { key: "TASK_PROVIDER", requiredValue: "prisma", currentSafeDefault: "mock-memory" },
      { key: "DATABASE_URL", requiredValue: "valid-postgres-url", currentSafeDefault: "not-required-for-build" }
    ],
    rules: [
      "Build-ul Vercel trebuie să treacă fără DATABASE_URL obligatoriu.",
      "Prisma active writes nu se activează din cod fără env flag explicit.",
      "Toate write operations trebuie să suporte fallback/rollback.",
      "Audit log și RBAC guard sunt obligatorii pentru production writes."
    ]
  };
}

export function getProductionTaskCrudPlan() {
  return {
    ok: true,
    version: "3.0.0",
    generatedAt: new Date().toISOString(),
    phases: [
      {
        phase: "v3.0",
        title: "Write-gate stabilization",
        status: "current",
        deliverables: ["guarded task mutations", "write-gate status", "admin production CRUD page", "release status v3"]
      },
      {
        phase: "v3.1",
        title: "Prisma task repository adapter",
        status: "next",
        deliverables: ["TaskRepository interface", "PrismaTaskRepository", "MockTaskRepository parity", "shadow comparison"]
      },
      {
        phase: "v3.2",
        title: "Task UI production mutations",
        status: "planned",
        deliverables: ["create/update/delete from /taskuri", "optimistic rollback", "toast/error states", "server validation"]
      },
      {
        phase: "v3.3",
        title: "Subtasks, comments, time entries",
        status: "planned",
        deliverables: ["comments API", "subtasks API", "time entries API", "activity log"]
      }
    ]
  };
}
