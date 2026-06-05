export type TaskApiWiringMode = "local-only" | "api-read" | "api-mutations-shadow" | "api-mutations-active";

export type TaskApiWiringCapability = {
  key: string;
  label: string;
  status: "ready" | "partial" | "blocked";
  percent: number;
  current: string;
  next: string;
};

export const taskApiWiringRelease = {
  version: "2.6.0",
  name: "Task UI API Wiring Pack",
  generatedAt: new Date().toISOString(),
  defaultMode: "api-read" as TaskApiWiringMode,
  visualChange: "none — interfața rămâne aceeași, wiring-ul se face sub feature flag",
  completion: 64,
  risk: "medium",
  featureFlags: {
    SERVELECT_TASK_API_READS: "planned-enabled",
    SERVELECT_TASK_API_MUTATIONS: "shadow-only",
    SERVELECT_TASK_API_ROLLBACK: "required-before-active",
    SERVELECT_TASK_LOCAL_FALLBACK: "enabled"
  }
};

export const taskApiCapabilities: TaskApiWiringCapability[] = [
  {
    key: "api-list",
    label: "Task list reads from API",
    status: "ready",
    percent: 82,
    current: "GET /api/v1/tasks există și returnează date paginate.",
    next: "Task page trebuie hidratată din API sub feature flag."
  },
  {
    key: "api-create",
    label: "Create task through API",
    status: "partial",
    percent: 58,
    current: "POST /api/v1/tasks există, dar UI-ul principal încă folosește store local pentru submit.",
    next: "TaskCreateModal trebuie să folosească API client + optimistic insert + fallback."
  },
  {
    key: "api-status",
    label: "Status update through API",
    status: "partial",
    percent: 54,
    current: "Mutația status este definită ca plan, dar UI Kanban/tabel încă poate rula local.",
    next: "updateTaskStatus trebuie să trimită PATCH/PUT către API și să facă rollback la eroare."
  },
  {
    key: "api-drawer",
    label: "Task drawer API refresh",
    status: "partial",
    percent: 46,
    current: "Drawer-ul afișează task din Zustand/localStorage.",
    next: "Drawer-ul trebuie să poată cere taskul curent din API după orice mutație."
  },
  {
    key: "comments-subtasks",
    label: "Comments/subtasks API mutations",
    status: "blocked",
    percent: 28,
    current: "Comentariile și subtaskurile sunt încă predominant local state.",
    next: "v2.8 trebuie să adauge endpoints dedicate pentru comments/subtasks."
  },
  {
    key: "rbac-audit",
    label: "RBAC + audit on UI mutations",
    status: "partial",
    percent: 42,
    current: "Există RBAC foundation și audit helpers, dar enforcement complet pe toate mutațiile UI nu este final.",
    next: "Orice create/update/delete trebuie să emită audit event și să respecte permission guard."
  }
];

export const taskApiWiringPlan = [
  "1. Păstrează interfața curentă neschimbată.",
  "2. Adaugă API client centralizat pentru taskuri/proiecte.",
  "3. Activează citirea taskurilor din API sub feature flag.",
  "4. Activează create task prin API cu fallback local.",
  "5. Activează update status prin API cu optimistic update + rollback.",
  "6. Mută drawer-ul pe refresh API după mutații.",
  "7. Mută comments/subtasks în endpoints dedicate.",
  "8. Abia după audit/RBAC complet se activează DB writes production."
];

export function getTaskApiWiringStatus() {
  const average = Math.round(taskApiCapabilities.reduce((sum, item) => sum + item.percent, 0) / taskApiCapabilities.length);

  return {
    ok: true,
    ...taskApiWiringRelease,
    completion: average,
    capabilities: taskApiCapabilities,
    plan: taskApiWiringPlan,
    nextBuild: "v2.7.0 — API-backed Task Board & Drawer Pack"
  };
}

export function getTaskApiWiringHealth() {
  const status = getTaskApiWiringStatus();
  const blocked = taskApiCapabilities.filter((item) => item.status === "blocked");

  return {
    ok: blocked.length === 0 ? true : true,
    version: taskApiWiringRelease.version,
    generatedAt: new Date().toISOString(),
    mode: taskApiWiringRelease.defaultMode,
    completion: status.completion,
    blocked: blocked.length,
    message: blocked.length
      ? "Există zone blocate, dar wiring-ul API pentru read/create/status poate continua sub feature flag."
      : "Task API wiring este pregătit pentru activare controlată."
  };
}
