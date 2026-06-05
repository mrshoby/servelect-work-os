export type TaskFunctionalityStatus = "done" | "partial" | "planned" | "blocked";

export type TaskFunctionalityArea = {
  id: string;
  label: string;
  status: TaskFunctionalityStatus;
  completion: number;
  current: string;
  missing: string[];
  nextAction: string;
};

export const TASK_FUNCTIONALITY_VERSION = "2.3.0";

export function getTaskFunctionalityStatus() {
  const areas: TaskFunctionalityArea[] = [
    {
      id: "task-list-board",
      label: "Task List / Board UI",
      status: "partial",
      completion: 72,
      current: "UI-ul de taskuri există, este optimizat performance și are list/board/calendar/approvals demo.",
      missing: ["API-backed hydration completă", "optimistic update stabil", "server pagination real"],
      nextAction: "Leagă task page de feature flag-ul API-backed store în v2.4/v2.5."
    },
    {
      id: "crud-api",
      label: "Task CRUD API",
      status: "partial",
      completion: 68,
      current: "Există contract API pentru /api/v1/tasks și /api/v1/projects în mod mock-memory.",
      missing: ["persistență PostgreSQL", "validare Zod completă", "error contracts standardizate"],
      nextAction: "Adaugă repository adapter Prisma și seed data real."
    },
    {
      id: "task-detail",
      label: "Task Detail Drawer",
      status: "partial",
      completion: 58,
      current: "Drawer-ul de task există vizual cu proprietăți principale.",
      missing: ["comments persistente", "attachments persistente", "dependencies CRUD", "activity log real"],
      nextAction: "Transformă drawer-ul în client API-backed cu tabs pentru comments/files/activity."
    },
    {
      id: "subtasks-checklists",
      label: "Subtaskuri & checklist",
      status: "partial",
      completion: 52,
      current: "Subtaskurile există în mock data și în modelul UI.",
      missing: ["subtask create/update/delete", "checklist item persistence", "bulk operations"],
      nextAction: "Adaugă endpoints /api/v1/tasks/:id/subtasks în v2.5."
    },
    {
      id: "time-tracking",
      label: "Time tracking",
      status: "partial",
      completion: 46,
      current: "Timer demo există în store/UI.",
      missing: ["time entries persistente", "approvals timesheet", "raport ore per proiect/user"],
      nextAction: "Conectează timerul la TimeEntry repository."
    },
    {
      id: "project-linking",
      label: "Project linking",
      status: "partial",
      completion: 64,
      current: "Taskurile au projectCode și sunt afișate în context proiect.",
      missing: ["project detail API", "task count server-side", "milestones persistente"],
      nextAction: "Adaugă /api/v1/projects/:id/workgraph."
    },
    {
      id: "production-db",
      label: "Production DB persistence",
      status: "planned",
      completion: 25,
      current: "DB provider este pregătit conceptual, dar production rămâne mock-memory.",
      missing: ["DATABASE_URL production", "Prisma migrations", "seed execution", "write guard tests"],
      nextAction: "Activează Prisma shadow mode controlat și repository adapter."
    }
  ];

  const completion = Math.round(areas.reduce((sum, area) => sum + area.completion, 0) / areas.length);

  return {
    ok: true,
    version: TASK_FUNCTIONALITY_VERSION,
    generatedAt: new Date().toISOString(),
    fullFunctional: false,
    completion,
    verdict: "Partea de taskuri NU este încă full functional production. Este un MVP avansat cu UI + mock/API contracts, dar nu are încă DB-backed CRUD complet, comments/files/subtasks/time tracking persistente.",
    areas,
    requiredForFullFunctional: [
      "Task CRUD API cu Prisma/PostgreSQL real",
      "Task page hidratată din API, nu doar localStorage",
      "create/update/delete cu optimistic UI + rollback",
      "subtask/comment/attachment/dependency endpoints",
      "time entries persistente",
      "activity log persistent",
      "RBAC enforcement pe fiecare mutație",
      "audit log pentru create/update/delete",
      "pagination/filtering/sorting server-side",
      "E2E tests pentru task lifecycle"
    ],
    nextBuild: {
      version: "2.4.0",
      name: "Prisma Seed Execution & Repository Adapter Pack",
      goal: "Primul pas concret spre task CRUD DB-backed real."
    }
  };
}
