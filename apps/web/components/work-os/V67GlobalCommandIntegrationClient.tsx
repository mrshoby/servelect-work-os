"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  FolderKanban,
  Gauge,
  Layers3,
  Link2,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
  Workflow,
  Zap
} from "lucide-react";
import {
  GOODDAY_PARITY_STORAGE_KEY,
  buildActivity,
  buildGoodDayParitySeed,
  buildNotification,
  calculateWorkload,
  canUserSeeTask,
  createTaskFromPartial,
  exportTasksCsv,
  isOverdue,
  minutesToHours,
  type GoodDayActivity,
  type GoodDayApproval,
  type GoodDayEntityKind,
  type GoodDayNotification,
  type GoodDayParityState,
  type GoodDayPriority,
  type GoodDayProject,
  type GoodDayTask,
  type GoodDayTicket,
  type GoodDayUser
} from "@/lib/enterprise/work-os-goodday-parity-core";

type V67View = "dashboard" | "notifications" | "approvals" | "search" | "action-center";
type CommandKind = "iot-alert" | "stock-low" | "budget-overrun" | "client-follow-up" | "anre-expiring" | "handover";

type SearchResult = {
  id: string;
  kind: GoodDayEntityKind | "client";
  title: string;
  subtitle: string;
  href: string;
  tone: string;
};

const viewMeta: Record<V67View, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Global Work OS Command Center",
    subtitle: "Taskuri, notificari, aprobari, tickete, workload si fluxuri cross-module intr-un singur centru operational."
  },
  notifications: {
    title: "Notification Center",
    subtitle: "Evenimente GoodDay-like pentru taskuri, tickete, aprobari, SLA, IoT, stoc si proiecte."
  },
  approvals: {
    title: "Approvals Center",
    subtitle: "Aprobari manageriale legate de taskuri, proiecte, bugete, documente si tickete."
  },
  search: {
    title: "Global Search",
    subtitle: "Cautare unificata in taskuri, tickete, proiecte, clienti, notificari si aprobari."
  },
  "action-center": {
    title: "Cross-module Action Center",
    subtitle: "Comenzi rapide care transforma evenimente Servelect in taskuri, tickete, notificari si aprobari."
  }
};

const commandCards: Array<{ kind: CommandKind; title: string; description: string; tone: string }> = [
  { kind: "iot-alert", title: "Alerta invertor offline", description: "Creeaza ticket IoT + task tehnician + notificare manager.", tone: "red" },
  { kind: "stock-low", title: "Stoc critic echipament", description: "Creeaza task de achizitie si notificare Procurement.", tone: "amber" },
  { kind: "budget-overrun", title: "Buget depasit", description: "Creeaza approval financiar pentru proiect.", tone: "purple" },
  { kind: "client-follow-up", title: "Follow-up client", description: "Creeaza task CRM pentru Comercial.", tone: "blue" },
  { kind: "anre-expiring", title: "Certificare ANRE expira", description: "Creeaza task HR si reminder pentru manager.", tone: "emerald" },
  { kind: "handover", title: "Project handover", description: "Creeaza checklist de predare pentru proiect finalizat.", tone: "slate" }
];

const nav = [
  { href: "/work-os/dashboard", label: "Dashboard" },
  { href: "/notifications", label: "Notifications" },
  { href: "/work-os/approvals", label: "Approvals" },
  { href: "/search", label: "Search" },
  { href: "/action-center", label: "Action Center" },
  { href: "/taskuri/overview", label: "Taskuri" }
];

function safeClone(state: GoodDayParityState): GoodDayParityState {
  if (typeof structuredClone === "function") return structuredClone(state);
  return JSON.parse(JSON.stringify(state)) as GoodDayParityState;
}

function normalizeState(candidate: Partial<GoodDayParityState> | null | undefined): GoodDayParityState {
  const seed = buildGoodDayParitySeed();
  return {
    users: Array.isArray(candidate?.users) ? candidate.users : seed.users,
    clients: Array.isArray(candidate?.clients) ? candidate.clients : seed.clients,
    projects: Array.isArray(candidate?.projects) ? candidate.projects : seed.projects,
    tasks: Array.isArray(candidate?.tasks) ? candidate.tasks : seed.tasks,
    tickets: Array.isArray(candidate?.tickets) ? candidate.tickets : seed.tickets,
    notifications: Array.isArray(candidate?.notifications) ? candidate.notifications : seed.notifications,
    approvals: Array.isArray(candidate?.approvals) ? candidate.approvals : seed.approvals,
    timeEntries: Array.isArray(candidate?.timeEntries) ? candidate.timeEntries : seed.timeEntries,
    savedViews: Array.isArray(candidate?.savedViews) ? candidate.savedViews : seed.savedViews,
    automations: Array.isArray(candidate?.automations) ? candidate.automations : seed.automations,
    auditLog: Array.isArray(candidate?.auditLog) ? candidate.auditLog : seed.auditLog
  };
}

function loadState(): GoodDayParityState {
  if (typeof window === "undefined") return buildGoodDayParitySeed();
  try {
    const raw = window.localStorage.getItem(GOODDAY_PARITY_STORAGE_KEY);
    if (!raw) return buildGoodDayParitySeed();
    return normalizeState(JSON.parse(raw) as Partial<GoodDayParityState>);
  } catch {
    return buildGoodDayParitySeed();
  }
}

function byId<T extends { id: string }>(items: T[], id?: string) {
  return items.find((item) => item.id === id);
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86400000).toISOString();
}

function dateOnly(value?: string) {
  if (!value) return "-";
  return value.slice(0, 10);
}

function toneClass(tone: string) {
  if (tone === "red") return "border-red-200 bg-red-50 text-red-800";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-800";
  if (tone === "purple") return "border-purple-200 bg-purple-50 text-purple-800";
  if (tone === "blue") return "border-blue-200 bg-blue-50 text-blue-800";
  if (tone === "emerald") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  return "border-slate-200 bg-slate-50 text-slate-800";
}

function priorityTone(priority: GoodDayPriority) {
  if (priority === "Critical") return "border-red-200 bg-red-50 text-red-700";
  if (priority === "Urgent") return "border-orange-200 bg-orange-50 text-orange-700";
  if (priority === "High") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function entityHref(kind: GoodDayEntityKind | "client", id: string) {
  if (kind === "task") return "/taskuri/tabel";
  if (kind === "ticket") return "/taskuri/tickets-notificari";
  if (kind === "approval") return "/work-os/approvals";
  if (kind === "notification") return "/notifications";
  if (kind === "project") return "/taskuri/proiecte-active";
  if (kind === "automation") return "/action-center";
  if (kind === "time") return "/taskuri/workload-aprobari";
  if (kind === "client") return "/crm";
  return `/search?q=${encodeURIComponent(id)}`;
}

function createTicketFromCommand(kind: CommandKind, state: GoodDayParityState, currentUser: GoodDayUser): GoodDayTicket {
  const project = state.projects[0];
  const client = state.clients[0];
  const base = {
    id: makeId("ticket"),
    requesterId: currentUser.id,
    assigneeId: "u_mihai",
    projectId: project?.id,
    clientId: client?.id,
    equipmentId: "eq_invertor_huawei_01",
    escalated: kind === "iot-alert",
    comments: [],
    attachments: [],
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  if (kind === "iot-alert") {
    return {
      ...base,
      title: "Invertor offline - alarma automata IoT",
      type: "IoT",
      severity: "Critical",
      status: "Escaladat",
      slaDueAt: daysFromNow(1)
    };
  }
  return {
    ...base,
    title: "Ticket operational generat din Action Center",
    type: "Internal",
    severity: "High",
    status: "Nou",
    slaDueAt: daysFromNow(3)
  };
}

function createApprovalForCommand(kind: CommandKind, task: GoodDayTask, currentUser: GoodDayUser): GoodDayApproval {
  return {
    id: makeId("approval"),
    title: kind === "budget-overrun" ? "Aprobare depasire buget proiect" : "Aprobare manageriala generata automat",
    requesterId: currentUser.id,
    approverId: "u_andrei",
    entityKind: "task",
    entityId: task.id,
    status: "Pending",
    comment: "Generat din v6.7 Global Command Center",
    history: [buildActivity(task.id, "task", currentUser.id, "Approval requested", "Flux cross-module GoodDay-like")],
    createdAt: nowIso()
  };
}

function buildGlobalSearchResults(state: GoodDayParityState, query: string, currentUser: GoodDayUser): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const visibleTasks = state.tasks.filter((task) => canUserSeeTask(currentUser, task, state.projects));
  const taskResults: SearchResult[] = visibleTasks
    .filter((task) => `${task.title} ${task.description} ${task.tags.join(" ")}`.toLowerCase().includes(q))
    .map((task) => ({ id: task.id, kind: "task", title: task.title, subtitle: `${task.status} · ${task.priority} · ${dateOnly(task.dueDate)}`, href: entityHref("task", task.id), tone: "blue" }));
  const ticketResults: SearchResult[] = state.tickets
    .filter((ticket) => `${ticket.title} ${ticket.status} ${ticket.type}`.toLowerCase().includes(q))
    .map((ticket) => ({ id: ticket.id, kind: "ticket", title: ticket.title, subtitle: `${ticket.status} · SLA ${dateOnly(ticket.slaDueAt)}`, href: entityHref("ticket", ticket.id), tone: ticket.escalated ? "red" : "amber" }));
  const projectResults: SearchResult[] = state.projects
    .filter((project) => `${project.name} ${project.code} ${project.phase}`.toLowerCase().includes(q))
    .map((project) => ({ id: project.id, kind: "project", title: project.name, subtitle: `${project.status} · ${project.health} · ${project.progress}%`, href: entityHref("project", project.id), tone: "emerald" }));
  const approvalResults: SearchResult[] = state.approvals
    .filter((approval) => `${approval.title} ${approval.status}`.toLowerCase().includes(q))
    .map((approval) => ({ id: approval.id, kind: "approval", title: approval.title, subtitle: `${approval.status} · approver ${approval.approverId}`, href: entityHref("approval", approval.id), tone: "purple" }));
  const clientResults: SearchResult[] = state.clients
    .filter((client) => `${client.name} ${client.segment}`.toLowerCase().includes(q))
    .map((client) => ({ id: client.id, kind: "client", title: client.name, subtitle: `Client ${client.segment}`, href: entityHref("client", client.id), tone: "slate" }));
  return [...taskResults, ...ticketResults, ...projectResults, ...approvalResults, ...clientResults].slice(0, 30);
}

export function V67GlobalCommandIntegrationClient({ view }: { view: V67View }) {
  const [state, setState] = useState<GoodDayParityState>(() => loadState());
  const [currentUserId, setCurrentUserId] = useState("u_andrei");
  const [query, setQuery] = useState("");
  const [lastExport, setLastExport] = useState("");
  const currentUser = byId(state.users, currentUserId) ?? state.users[0];

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(GOODDAY_PARITY_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const visibleTasks = useMemo(() => state.tasks.filter((task) => canUserSeeTask(currentUser, task, state.projects)), [state.tasks, state.projects, currentUser]);
  const unread = useMemo(() => state.notifications.filter((item) => item.userId === currentUser.id && !item.read), [state.notifications, currentUser.id]);
  const pendingApprovals = useMemo(() => state.approvals.filter((item) => item.status === "Pending" && (item.approverId === currentUser.id || currentUser.role === "Super Admin" || currentUser.role === "Global Admin")), [state.approvals, currentUser]);
  const escalatedTickets = useMemo(() => state.tickets.filter((ticket) => ticket.escalated || ticket.status === "Escaladat" || ticket.severity === "Critical"), [state.tickets]);
  const overdue = useMemo(() => visibleTasks.filter((task) => isOverdue(task.dueDate) && task.status !== "Finalizat"), [visibleTasks]);
  const workload = useMemo(() => calculateWorkload(state.users, state.tasks, state.timeEntries), [state.users, state.tasks, state.timeEntries]);
  const overloaded = workload.filter((item) => item.utilization > 100);
  const searchResults = useMemo(() => buildGlobalSearchResults(state, query, currentUser), [state, query, currentUser]);
  const meta = viewMeta[view];

  function mutate(updater: (draft: GoodDayParityState) => void) {
    setState((previous) => {
      const draft = safeClone(previous);
      updater(draft);
      return draft;
    });
  }

  function pushAudit(draft: GoodDayParityState, entityId: string, entityKind: GoodDayEntityKind, action: string, detail?: string) {
    draft.auditLog.unshift(buildActivity(entityId, entityKind, currentUser.id, action, detail));
  }

  function markNotificationRead(id: string) {
    mutate((draft) => {
      const notification = draft.notifications.find((item) => item.id === id);
      if (notification) {
        notification.read = true;
        pushAudit(draft, notification.id, "notification", "Notification read", notification.title);
      }
    });
  }

  function markAllRead() {
    mutate((draft) => {
      draft.notifications.forEach((notification) => {
        if (notification.userId === currentUser.id) notification.read = true;
      });
      pushAudit(draft, currentUser.id, "notification", "All notifications read", "Global notification center");
    });
  }

  function decideApproval(approvalId: string, status: "Approved" | "Rejected") {
    mutate((draft) => {
      const approval = draft.approvals.find((item) => item.id === approvalId);
      if (!approval) return;
      approval.status = status;
      approval.decidedAt = nowIso();
      approval.comment = status === "Approved" ? "Aprobat din v6.7 global approvals" : "Respins din v6.7 global approvals";
      approval.history.unshift(buildActivity(approval.entityId, approval.entityKind, currentUser.id, `Approval ${status}`, approval.comment));
      if (approval.entityKind === "task") {
        const task = draft.tasks.find((item) => item.id === approval.entityId);
        if (task) {
          task.approvalState = status;
          task.status = status === "Approved" ? "Review" : "Blocat";
          task.activity.unshift(buildActivity(task.id, "task", currentUser.id, `Approval ${status}`, approval.comment));
        }
      }
      draft.notifications.unshift(buildNotification(approval.requesterId, `Approval ${status}`, approval.title, approval.entityKind, approval.entityId, "approval_requested"));
      pushAudit(draft, approval.entityId, approval.entityKind, `Approval ${status}`, approval.title);
    });
  }

  function runCommand(kind: CommandKind) {
    mutate((draft) => {
      const project = draft.projects[0];
      if (!project) return;
      let task: GoodDayTask | null = null;
      if (kind === "iot-alert") {
        const ticket = createTicketFromCommand(kind, draft, currentUser);
        draft.tickets.unshift(ticket);
        task = createTaskFromPartial({
          title: "Interventie urgenta: invertor offline GreenFactory",
          description: "Task generat automat din alerta IoT. Verifica echipament, status invertor si comunicare client.",
          type: "IoT Alert",
          priority: "Critical",
          status: "De facut",
          projectId: project.id,
          clientId: project.clientId,
          assigneeId: "u_mihai",
          ownerId: currentUser.id,
          department: "Mentenanta",
          relatedTicketId: ticket.id,
          tags: ["IoT", "SLA", "Urgent"],
          dueDate: new Date(ticket.slaDueAt).toISOString().slice(0, 10)
        });
        ticket.taskId = task.id;
        draft.tasks.unshift(task);
        draft.notifications.unshift(buildNotification("u_ioana", "Ticket IoT escaladat", ticket.title, "ticket", ticket.id, "ticket_escalated"));
        pushAudit(draft, ticket.id, "ticket", "IoT alert converted", "Ticket + task tehnician");
      }
      if (kind === "stock-low") {
        task = createTaskFromPartial({
          title: "Achizitie urgenta: conectori MC4 sub prag minim",
          description: "Stoc scazut detectat. Cere oferta furnizor si rezerva material pentru proiectele active.",
          type: "Procurement",
          priority: "High",
          status: "De facut",
          projectId: project.id,
          clientId: project.clientId,
          assigneeId: "u_cristian",
          ownerId: currentUser.id,
          department: "Achizitii",
          tags: ["Stoc", "Achizitii", "Procurement"],
          dueDate: new Date(daysFromNow(4)).toISOString().slice(0, 10)
        });
        draft.tasks.unshift(task);
      }
      if (kind === "budget-overrun") {
        task = createTaskFromPartial({
          title: "Analiza depasire buget montaj GreenFactory",
          description: "Costurile estimate depasesc pragul aprobat. Necesita aprobare financiara.",
          type: "Approval",
          priority: "Urgent",
          status: "Aprobare",
          projectId: project.id,
          clientId: project.clientId,
          assigneeId: "u_alexandra",
          ownerId: currentUser.id,
          department: "Financiar",
          approvalState: "Requested",
          tags: ["Buget", "Finance", "Approval"],
          dueDate: new Date(daysFromNow(2)).toISOString().slice(0, 10)
        });
        draft.tasks.unshift(task);
        draft.approvals.unshift(createApprovalForCommand(kind, task, currentUser));
      }
      if (kind === "client-follow-up") {
        task = createTaskFromPartial({
          title: "Follow-up client: confirmare calendar PIF",
          description: "Contacteaza clientul pentru confirmarea datei de receptie si documentele lipsa.",
          type: "CRM Follow-up",
          priority: "Normal",
          status: "De facut",
          projectId: project.id,
          clientId: project.clientId,
          assigneeId: "u_vlad",
          ownerId: currentUser.id,
          department: "Comercial",
          tags: ["CRM", "Client", "Follow-up"],
          dueDate: new Date(daysFromNow(3)).toISOString().slice(0, 10)
        });
        draft.tasks.unshift(task);
      }
      if (kind === "anre-expiring") {
        task = createTaskFromPartial({
          title: "Reinnoire certificare ANRE tehnician",
          description: "Certificarea ANRE expira in 30 zile. Planifica training si documente HR.",
          type: "HR",
          priority: "High",
          status: "De facut",
          projectId: project.id,
          assigneeId: "u_ioana",
          ownerId: currentUser.id,
          department: "Administrativ",
          tags: ["HR", "ANRE", "Certificare"],
          dueDate: new Date(daysFromNow(14)).toISOString().slice(0, 10)
        });
        draft.tasks.unshift(task);
      }
      if (kind === "handover") {
        task = createTaskFromPartial({
          title: "Checklist handover proiect finalizat",
          description: "Genereaza predarea finala: PV receptie, garantie, training client, documente finale.",
          type: "Document",
          priority: "Normal",
          status: "De facut",
          projectId: project.id,
          clientId: project.clientId,
          assigneeId: "u_ioana",
          ownerId: currentUser.id,
          department: "Productie",
          tags: ["Handover", "Documente", "Finalizare"],
          dueDate: new Date(daysFromNow(5)).toISOString().slice(0, 10)
        });
        task.checklist = [
          { id: makeId("chk"), title: "PV receptie semnat", done: false },
          { id: makeId("chk"), title: "Documente garantie atasate", done: false },
          { id: makeId("chk"), title: "Training client confirmat", done: false }
        ];
        draft.tasks.unshift(task);
      }
      if (task) {
        draft.notifications.unshift(buildNotification(task.assigneeId, "Task nou cross-module", task.title, "task", task.id, "task_assigned"));
        task.activity.unshift(buildActivity(task.id, "task", currentUser.id, "Created from v6.7 command", kind));
        pushAudit(draft, task.id, "task", "Cross-module command executed", kind);
      }
      const automation = draft.automations.find((item) => {
        if (kind === "iot-alert") return item.trigger === "iot_alarm";
        if (kind === "stock-low") return item.trigger === "stock_low";
        if (kind === "handover") return item.trigger === "project_completed";
        if (kind === "anre-expiring") return item.trigger === "certification_expiring";
        return item.trigger === "task_overdue";
      });
      if (automation) {
        automation.runs += 1;
        automation.lastRunAt = nowIso();
      }
    });
  }

  function exportVisibleCsv() {
    const csv = exportTasksCsv(visibleTasks, state.projects, state.users);
    setLastExport(csv.slice(0, 600));
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-950" data-audit-page="v67-global-command" data-audit-route={view} data-audit-ready="true">
      <section className="mx-auto flex max-w-7xl flex-col gap-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">SERVELECT WORK OS v6.7.2</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{meta.title}</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">{meta.subtitle}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <select value={currentUserId} onChange={(event) => setCurrentUserId(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                {state.users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name} · {user.role}</option>
                ))}
              </select>
              <button onClick={exportVisibleCsv} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                <Download className="h-4 w-4" /> Export task CSV
              </button>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard icon={<FolderKanban className="h-5 w-5" />} label="Visible tasks" value={visibleTasks.length} sub={`${overdue.length} overdue`} tone="blue" />
          <MetricCard icon={<Bell className="h-5 w-5" />} label="Unread notifications" value={unread.length} sub="role-aware" tone="emerald" />
          <MetricCard icon={<ShieldCheck className="h-5 w-5" />} label="Pending approvals" value={pendingApprovals.length} sub="global gates" tone="purple" />
          <MetricCard icon={<AlertTriangle className="h-5 w-5" />} label="Escalated tickets" value={escalatedTickets.length} sub="SLA / IoT risk" tone="red" />
          <MetricCard icon={<Gauge className="h-5 w-5" />} label="Overloaded users" value={overloaded.length} sub="capacity engine" tone="amber" />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col gap-5">
            {view === "dashboard" && <DashboardPanel state={state} visibleTasks={visibleTasks} pendingApprovals={pendingApprovals} unread={unread} workload={workload} runCommand={runCommand} />}
            {view === "notifications" && <NotificationsPanel notifications={state.notifications.filter((item) => item.userId === currentUser.id)} markRead={markNotificationRead} markAllRead={markAllRead} />}
            {view === "approvals" && <ApprovalsPanel approvals={pendingApprovals} users={state.users} projects={state.projects} tasks={state.tasks} decide={decideApproval} />}
            {view === "search" && <SearchPanel query={query} setQuery={setQuery} results={searchResults} />}
            {view === "action-center" && <ActionCenterPanel runCommand={runCommand} automations={state.automations} />}
          </div>
          <aside className="flex flex-col gap-5">
            <QuickLinks />
            <WorkloadMini workload={workload} />
            <ActivityFeed auditLog={state.auditLog} users={state.users} />
            {lastExport && <ExportPreview value={lastExport} />}
          </aside>
        </section>
      </section>
    </main>
  );
}

function MetricCard(props: { icon: ReactNode; label: string; value: string | number; sub: string; tone: string }) {
  return (
    <div className={`rounded-[22px] border p-4 shadow-sm ${toneClass(props.tone)}`}>
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-white/70 p-2">{props.icon}</div>
        <span className="text-2xl font-bold">{props.value}</span>
      </div>
      <p className="mt-3 text-sm font-semibold">{props.label}</p>
      <p className="text-xs opacity-75">{props.sub}</p>
    </div>
  );
}

function DashboardPanel(props: { state: GoodDayParityState; visibleTasks: GoodDayTask[]; pendingApprovals: GoodDayApproval[]; unread: GoodDayNotification[]; workload: ReturnType<typeof calculateWorkload>; runCommand: (kind: CommandKind) => void }) {
  const highPriority = props.visibleTasks.filter((task) => ["High", "Urgent", "Critical"].includes(task.priority)).slice(0, 5);
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dashboard executiv task-first</h2>
          <p className="text-sm text-slate-600">Legaturi reale intre taskuri, notificari, aprobari, workload si comenzi cross-module.</p>
        </div>
        <Sparkles className="h-6 w-6 text-emerald-600" />
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {commandCards.slice(0, 3).map((command) => (
          <button key={command.kind} onClick={() => props.runCommand(command.kind)} className={`rounded-2xl border p-4 text-left text-sm transition hover:shadow-md ${toneClass(command.tone)}`}>
            <p className="font-semibold">{command.title}</p>
            <p className="mt-1 text-xs opacity-75">{command.description}</p>
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-800">Taskuri critice</p>
          <div className="mt-3 space-y-2">
            {highPriority.map((task) => (
              <Link key={task.id} href="/taskuri/tabel" className="block rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-emerald-200 hover:bg-emerald-50">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{task.title}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] ${priorityTone(task.priority)}`}>{task.priority}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{task.status} · due {dateOnly(task.dueDate)}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-800">Semnale globale</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <SignalRow icon={<Bell className="h-4 w-4" />} label="Notificari necitite" value={props.unread.length} />
            <SignalRow icon={<ShieldCheck className="h-4 w-4" />} label="Aprobari asteptare" value={props.pendingApprovals.length} />
            <SignalRow icon={<Timer className="h-4 w-4" />} label="Time entries" value={props.state.timeEntries.length} />
            <SignalRow icon={<Workflow className="h-4 w-4" />} label="Automations" value={props.state.automations.length} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SignalRow(props: { icon: ReactNode; label: string; value: number }) {
  return <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span className="inline-flex items-center gap-2">{props.icon}{props.label}</span><strong>{props.value}</strong></div>;
}

function NotificationsPanel(props: { notifications: GoodDayNotification[]; markRead: (id: string) => void; markAllRead: () => void }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-semibold">Notificari globale</h2><p className="text-sm text-slate-600">Read/unread, link la entitate si audit local.</p></div>
        <button onClick={props.markAllRead} className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Mark all read</button>
      </div>
      <div className="mt-4 space-y-3">
        {props.notifications.map((notification) => (
          <div key={notification.id} className={`rounded-2xl border p-4 ${notification.read ? "border-slate-200 bg-white" : "border-emerald-200 bg-emerald-50"}`}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">{notification.title}</p>
                <p className="text-sm text-slate-600">{notification.body}</p>
                <p className="mt-1 text-xs text-slate-400">{notification.kind} · {notification.entityKind} · {dateOnly(notification.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <Link className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700" href={entityHref(notification.entityKind, notification.entityId)}>Open</Link>
                {!notification.read && <button onClick={() => props.markRead(notification.id)} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white">Read</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ApprovalsPanel(props: { approvals: GoodDayApproval[]; users: GoodDayUser[]; projects: GoodDayProject[]; tasks: GoodDayTask[]; decide: (approvalId: string, status: "Approved" | "Rejected") => void }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">Aprobari globale</h2>
      <p className="text-sm text-slate-600">Aprobari legate de task/proiect/ticket/document, cu istoric si update in store.</p>
      <div className="mt-4 space-y-3">
        {props.approvals.map((approval) => {
          const requester = byId(props.users, approval.requesterId);
          const task = approval.entityKind === "task" ? byId(props.tasks, approval.entityId) : undefined;
          return (
            <div key={approval.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{approval.title}</p>
                  <p className="text-sm text-slate-600">Requester: {requester?.name ?? approval.requesterId} · Entity: {approval.entityKind}</p>
                  {task && <p className="mt-1 text-xs text-slate-500">Task: {task.title} · {task.status} · {task.approvalState}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => props.decide(approval.id, "Approved")} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">Approve</button>
                  <button onClick={() => props.decide(approval.id, "Rejected")} className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white">Reject</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SearchPanel(props: { query: string; setQuery: (value: string) => void; results: SearchResult[] }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <Search className="h-5 w-5 text-slate-400" />
        <input value={props.query} onChange={(event) => props.setQuery(event.target.value)} placeholder="Cauta task, ticket, proiect, client, aprobare..." className="w-full bg-transparent text-sm outline-none" />
      </div>
      <div className="mt-4 space-y-3">
        {props.results.map((result) => (
          <Link key={`${result.kind}-${result.id}`} href={result.href} className={`block rounded-2xl border p-4 transition hover:shadow-sm ${toneClass(result.tone)}`}>
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-sm font-semibold">{result.title}</p><p className="text-xs opacity-75">{result.kind} · {result.subtitle}</p></div>
              <ChevronIcon />
            </div>
          </Link>
        ))}
        {props.query && props.results.length === 0 && <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Nu exista rezultate pentru cautarea curenta.</p>}
      </div>
    </section>
  );
}

function ChevronIcon() {
  return <span className="text-lg font-semibold opacity-50">›</span>;
}

function ActionCenterPanel(props: { runCommand: (kind: CommandKind) => void; automations: GoodDayParityState["automations"] }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">Action Center cross-module</h2>
      <p className="text-sm text-slate-600">Comenzi GoodDay-like adaptate Servelect: IoT, stoc, CRM, HR, buget, handover.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {commandCards.map((command) => (
          <button key={command.kind} onClick={() => props.runCommand(command.kind)} className={`rounded-2xl border p-4 text-left transition hover:shadow-md ${toneClass(command.tone)}`}>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4" /><p className="text-sm font-semibold">{command.title}</p></div>
            <p className="mt-2 text-xs opacity-75">{command.description}</p>
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-800">Automation rules</p>
        <div className="mt-3 grid gap-2">
          {props.automations.map((automation) => (
            <div key={automation.id} className="flex flex-col justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm sm:flex-row sm:items-center">
              <span className="font-medium text-slate-800">{automation.name}</span>
              <span className="text-xs text-slate-500">{automation.trigger} → {automation.action} · runs {automation.runs}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickLinks() {
  const links = [
    ["Taskuri table", "/taskuri/tabel"],
    ["Board", "/taskuri/board"],
    ["Tickets", "/taskuri/tickets-notificari"],
    ["Workload", "/taskuri/workload-aprobari"],
    ["Proiecte", "/proiecte"],
    ["CRM", "/crm"],
    ["IoT", "/iot"],
    ["Echipamente", "/echipamente"]
  ];
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-950">Legaturi Work OS</h3>
      <div className="mt-3 grid gap-2">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800">
            {label}<Link2 className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function WorkloadMini(props: { workload: ReturnType<typeof calculateWorkload> }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-950">Workload global</h3>
      <div className="mt-3 space-y-3">
        {props.workload.slice(0, 6).map((row) => (
          <div key={row.user.id}>
            <div className="flex items-center justify-between text-xs font-medium text-slate-600"><span>{row.user.name}</span><span>{row.utilization}%</span></div>
            <div className="mt-1 h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${row.utilization > 100 ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(row.utilization, 140)}%` }} /></div>
            <p className="mt-1 text-[11px] text-slate-400">{minutesToHours(row.estimated)} / {minutesToHours(row.weeklyCapacity)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityFeed(props: { auditLog: GoodDayActivity[]; users: GoodDayUser[] }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-950">Activity stream</h3>
      <div className="mt-3 space-y-2">
        {props.auditLog.slice(0, 8).map((activity) => (
          <div key={activity.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-800">{activity.action}</p>
            <p className="text-[11px] text-slate-500">{byId(props.users, activity.actorId)?.name ?? activity.actorId} · {activity.entityKind} · {dateOnly(activity.createdAt)}</p>
            {activity.detail && <p className="mt-1 text-[11px] text-slate-400">{activity.detail}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function ExportPreview(props: { value: string }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950"><FileText className="h-4 w-4" /> CSV preview</div>
      <pre className="max-h-52 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-3 text-[11px] text-emerald-100">{props.value}</pre>
    </section>
  );
}
