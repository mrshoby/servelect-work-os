export type V91Surface = "taskuri" | "admin" | "api";
export type V91View = "workspace" | "action-board" | "hierarchy" | "task-detail" | "workload" | "time-tracking" | "updates" | "requests" | "governance";
export type V91Status = "blocked" | "action_required" | "in_progress" | "review" | "done";
export type V91Priority = "critical" | "high" | "medium" | "low";

export type V91Task = {
  id: string;
  code: string;
  title: string;
  project: string;
  folder: string;
  department: string;
  owner: string;
  assignee: string;
  status: V91Status;
  priority: V91Priority;
  due: string;
  progress: number;
  estimateHours: number;
  loggedHours: number;
  watchers: string[];
  tags: string[];
  actionRequiredBy: string[];
  dependencies: string[];
  checklist: { label: string; done: boolean }[];
  updates: { author: string; text: string; at: string }[];
};

export type V91Workspace = {
  release: { version: "9.1.0"; name: string; direction: string; productionWrites: "pilot_only" };
  score: { gooddayLikeUx: number; taskExecution: number; hierarchy: number; actionRequired: number; workload: number; timeTracking: number; collaboration: number; productionReadiness: number };
  nav: { label: string; href: string; view: V91View }[];
  tasks: V91Task[];
  workload: { person: string; department: string; capacity: number; planned: number; overloadRisk: "low" | "medium" | "high"; focus: string }[];
  requests: { id: string; source: string; title: string; owner: string; status: string; convertToTask: string }[];
  controls: { id: string; label: string; status: string; detail: string }[];
};

const tasks: V91Task[] = [
  { id: "t-910-001", code: "SWO-910", title: "Unificare Action Required cu Taskuri reale", project: "SERVELECT EMP — platformă operațională", folder: "Taskuri / Execution", department: "Automatizări", owner: "Platform Owner", assignee: "Mihai Ionescu", status: "action_required", priority: "critical", due: "2026-06-19", progress: 72, estimateHours: 18, loggedHours: 11.5, watchers: ["Andrei Popescu", "Ioana Marinescu"], tags: ["Action Required", "RBAC", "Provider"], actionRequiredBy: ["Manager departament", "Platform Owner"], dependencies: ["SWO-904", "SWO-903"], checklist: [{ label: "Meniu Taskuri unic confirmat", done: true }, { label: "Action Required legat de task drawer", done: true }, { label: "Audit vizual live după Vercel", done: false }], updates: [{ author: "System", text: "Task creat din checkpoint v9.0.4 — fără shell paralel.", at: "2026-06-15 12:05" }, { author: "Mihai Ionescu", text: "Pregătit pentru validare manager înainte de pilot write.", at: "2026-06-15 12:28" }] },
  { id: "t-910-002", code: "SWO-911", title: "Task detail panel cu checklist, watchers, dependențe și update stream", project: "SERVELECT EMP — platformă operațională", folder: "Taskuri / Detail", department: "Producție", owner: "Andrei Popescu", assignee: "Cristian Radu", status: "in_progress", priority: "high", due: "2026-06-20", progress: 64, estimateHours: 24, loggedHours: 15, watchers: ["Alexandra Rusu", "George Stan"], tags: ["Drawer", "Checklist", "Updates"], actionRequiredBy: ["Responsabil proiect"], dependencies: ["SWO-910"], checklist: [{ label: "Header task-first", done: true }, { label: "Dependencies & blockers", done: true }, { label: "Editare inline reală în provider layer", done: false }], updates: [{ author: "Cristian Radu", text: "Am legat secțiunea de detalii de același model de task.", at: "2026-06-15 12:31" }] },
  { id: "t-910-003", code: "SWO-912", title: "Workload planner pe departamente Servelect", project: "SERVELECT EMP — platformă operațională", folder: "Echipă / Workload", department: "Audit energetic", owner: "Ioana Marinescu", assignee: "Radu Audit", status: "review", priority: "medium", due: "2026-06-21", progress: 81, estimateHours: 10, loggedHours: 8, watchers: ["Platform Owner"], tags: ["Workload", "Department", "Capacity"], actionRequiredBy: [], dependencies: [], checklist: [{ label: "Capacitate per departament", done: true }, { label: "Risc supraîncărcare", done: true }, { label: "Mutare drag/drop reală", done: false }], updates: [{ author: "Ioana Marinescu", text: "Planificarea workload este vizibilă lângă taskuri, nu într-un dashboard separat.", at: "2026-06-15 12:43" }] },
  { id: "t-910-004", code: "SWO-913", title: "Request intake pentru cereri interne convertibile în taskuri", project: "SERVELECT EMP — platformă operațională", folder: "Forms / Requests", department: "Comercial", owner: "Alexandra Rusu", assignee: "George Stan", status: "blocked", priority: "high", due: "2026-06-22", progress: 45, estimateHours: 16, loggedHours: 6, watchers: ["Ioana Marinescu"], tags: ["Forms", "Requests", "Approvals"], actionRequiredBy: ["Admin"], dependencies: ["SWO-911"], checklist: [{ label: "Request list", done: true }, { label: "Convert to task action", done: true }, { label: "Persistență DB reală", done: false }], updates: [{ author: "Alexandra Rusu", text: "Cererea rămâne blocată până la activarea write pilot controlat.", at: "2026-06-15 12:55" }] }
];

const nav: V91Workspace["nav"] = [
  { label: "Workspace Command", href: "/taskuri/workspace-command", view: "workspace" },
  { label: "Action Required", href: "/taskuri/action-board", view: "action-board" },
  { label: "Hierarchy", href: "/taskuri/hierarchy-map-v91", view: "hierarchy" },
  { label: "Task Detail", href: "/taskuri/task-detail-v91", view: "task-detail" },
  { label: "Workload", href: "/taskuri/workload-planner-v91", view: "workload" },
  { label: "Time Tracking", href: "/taskuri/time-tracking-v91", view: "time-tracking" },
  { label: "Updates", href: "/taskuri/updates-stream-v91", view: "updates" },
  { label: "Requests", href: "/taskuri/request-intake-v91", view: "requests" }
];

export function getV91Workspace(): V91Workspace {
  return {
    release: { version: "9.1.0", name: "GoodDay-like Task Execution Parity Layer", direction: "Taskuri rămâne fluxul canonic: workspace command, action required, hierarchy, task detail, workload, time tracking, updates și request intake.", productionWrites: "pilot_only" },
    score: { gooddayLikeUx: 86, taskExecution: 88, hierarchy: 84, actionRequired: 87, workload: 82, timeTracking: 80, collaboration: 83, productionReadiness: 91 },
    nav,
    tasks,
    workload: [
      { person: "Mihai Ionescu", department: "Automatizări", capacity: 40, planned: 36, overloadRisk: "low", focus: "Provider canary + notifications" },
      { person: "Cristian Radu", department: "Producție", capacity: 40, planned: 44, overloadRisk: "high", focus: "Task detail + field operations" },
      { person: "Radu Audit", department: "Audit energetic", capacity: 32, planned: 29, overloadRisk: "medium", focus: "Approval gates + evidence" },
      { person: "Alexandra Rusu", department: "Comercial", capacity: 36, planned: 31, overloadRisk: "low", focus: "Request intake + client collaboration" }
    ],
    requests: [
      { id: "REQ-910-01", source: "Comercial", title: "Cerere ofertă cu rezervare materiale", owner: "Alexandra Rusu", status: "triage", convertToTask: "SWO-913" },
      { id: "REQ-910-02", source: "Teren", title: "Poză lipsă PV recepție pentru proiect Cluj", owner: "Cristian Radu", status: "action_required", convertToTask: "SWO-911" },
      { id: "REQ-910-03", source: "Audit energetic", title: "Verificare documente ESG înainte de raport", owner: "Radu Audit", status: "review", convertToTask: "SWO-912" }
    ],
    controls: [
      { id: "ctrl-menu", label: "Single Taskuri navigation", status: "passed", detail: "Nu se creează shell Work OS paralel; rutele noi sunt sub Taskuri/Admin/API." },
      { id: "ctrl-write", label: "Production writes gate", status: "pilot_only", detail: "Scrierile rămân pilot/gated, fără activare globală." },
      { id: "ctrl-plan", label: "NEXT_BUILD_PLAN read", status: "required", detail: "Scriptul de apply citește docs/NEXT_BUILD_PLAN.md înainte de patch." },
      { id: "ctrl-visual", label: "Screenshot audit", status: "required", detail: "Rutele Taskuri noi trebuie capturate după Vercel deploy." }
    ]
  };
}

export function getV91Payload(view: V91View = "workspace") {
  const workspace = getV91Workspace();
  const actionRequired = workspace.tasks.filter((task) => task.status === "action_required" || task.actionRequiredBy.length > 0);
  const blocked = workspace.tasks.filter((task) => task.status === "blocked");
  return { ok: true, version: workspace.release.version, release: workspace.release, view, nav: workspace.nav, score: workspace.score, summary: { tasks: workspace.tasks.length, actionRequired: actionRequired.length, blocked: blocked.length, workloadPeople: workspace.workload.length, requests: workspace.requests.length, productionWrites: workspace.release.productionWrites }, tasks: workspace.tasks, actionRequired, blocked, workload: workspace.workload, requests: workspace.requests, controls: workspace.controls };
}

export function getV91RouteMap() {
  return ["/taskuri/workspace-command", "/taskuri/action-board", "/taskuri/hierarchy-map-v91", "/taskuri/task-detail-v91", "/taskuri/workload-planner-v91", "/taskuri/time-tracking-v91", "/taskuri/updates-stream-v91", "/taskuri/request-intake-v91", "/admin/taskuri-workspace-governance", "/api/v1/work-os/v91-goodday-task-execution", "/api/v1/work-os/v91-goodday-task-execution/health", "/api/v1/work-os/v91-goodday-task-execution/action-required", "/api/v1/work-os/v91-goodday-task-execution/workload", "/api/v1/work-os/v91-goodday-task-execution/requests", "/api/v1/work-os/v91-goodday-task-execution/readiness"];
}
